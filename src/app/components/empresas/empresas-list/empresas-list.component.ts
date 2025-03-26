import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SessionService } from '../../global/service/session.service';
import { EmpresasService } from '../empresas.service';

@Component({
  selector: 'app-empresas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './empresas-list.component.html',
  styleUrls: ['./empresas-list.component.scss']
})
export class EmpresasListComponent implements OnInit {
  public empresas: any[] = [];
  public termoDeBusca: string = '';
  public loading: boolean = false;
  mensagemDeErro: string | null = null;

  public totalEmpresas: number = 0;
  public comCertificadoCount: number = 0;
  public comProcuracaoCount: number = 0;

  public dadosGraficoCertificado: any[] = [];
  public dadosGraficoProcuracao: any[] = [];
  public exibirPopupExclusaoSucesso: boolean = false;


  constructor(
    private empresasService: EmpresasService,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.buscarEmpresas();
  }

  buscarEmpresas(): void {
    this.loading = true;
    this.mensagemDeErro = '';

    this.empresasService.obterEmpresas().subscribe({
      next: (data) => this.processarDadosEmpresas(data),
      error: (error) => this.lidarComErro(error, 'empresas')
    });
  }

  processarDadosEmpresas(empresasData: any): void {
    if (!empresasData || !empresasData.info) {
      console.warn('Dados de empresas inválidos:', empresasData);
      this.empresas = [];
      this.loading = false;
      return;
    }

    this.totalEmpresas = empresasData.info.count || 0;
    this.comCertificadoCount = empresasData.info.comCertificado || 0;
    this.comProcuracaoCount = empresasData.info.comProcuracao || 0;

    this.empresas = empresasData.results || [];

    this.dadosGraficoCertificado = [
      { name: 'Sem Certificado', value: this.totalEmpresas - this.comCertificadoCount },
      { name: 'Com Certificado', value: this.comCertificadoCount }
    ];

    this.dadosGraficoProcuracao = [
      { name: 'Sem Procuração', value: this.totalEmpresas - this.comProcuracaoCount },
      { name: 'Com Procuração', value: this.comProcuracaoCount }
    ];

    this.loading = false;
  }

  get empresasFiltradas() {
    return this.empresas.filter(empresa =>
      empresa.razaoSocial?.toLowerCase().includes(this.termoDeBusca.toLowerCase())
    );
  }

  navegarParaAdicionarEmpresa(): void {
    this.router.navigate(['/nova-empresa']);
  }

  navegarParaEmpresa(empresa: any): void {
    if (empresa && empresa.apelidoId) {
      this.router.navigate(['/empresas', empresa.apelidoId]);
    } else {
      console.warn('ID da empresa não encontrado.');
    }
  }

  private lidarComErro(error: HttpErrorResponse, endpoint: string) {
    console.error(`Erro ao buscar ${endpoint}:`, error);

    if (error.status === 403) {
      this.sessionService.notificarSessaoExpirada();
    }
  }
}
