import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EmpresasService } from '../empresas/empresas.service';
import { SessionService } from '../global/service/session.service';
import { ParcelamentosService } from '../parcelamentos/parcelamentos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public dadosDoGraficoDePizza: any[] = [];
  public dadosGraficoCertificados: any[] = [];
  public dadosGraficoProcuracao: any[] = [];
  public totalParcelas: number = 0;
  public totalParcelasNaoPagas: number = 0;
  public totalParcelasCount: number = 0;
  public parcelasNaoPagas: number = 0;
  public parcelasPagas: number = 0;
  public totalEmpresas: number = 0;
  public comCertificadoCount: number = 0;
  public comProcuracaoCount: number = 0;

  constructor(
    private empresasService: EmpresasService,
    private parceamentosService: ParcelamentosService,
    private router: Router,
    private sessionService: SessionService
  ) { }
  public showSessionExpiredModalErro: boolean = false;


  ngOnInit(): void {
    this.buscarParcelamentos();
    this.buscarEmpresas();
  }

  buscarParcelamentos(): void {
    this.parceamentosService.obterParcelamentos().subscribe({
      next: (data) => this.processarDadosDeParcelamentos(data),
      error: (error) => this.lidarComErro(error, 'parcelamentos')
    });
  }

  buscarEmpresas(): void {
    this.empresasService.obterEmpresas().subscribe({
      next: (data) => this.ProcessarDadosDasEmpresas(data),
      error: (error) => this.lidarComErro(error, 'empresas')
    });
  }

  processarDadosDeParcelamentos(parcelasData: any): void {
    if (!parcelasData || !parcelasData.results) {
      console.warn('Dados de parcelamentos inválidos:', parcelasData);
      return;
    }

    const total = parcelasData.info?.count || parcelasData.results.length;

    const parcelasPagas = parcelasData.results.filter((p: any) => p.enviadoMesAtual).length;

    const parcelasNaoPagas = total - parcelasPagas;

    this.totalParcelasCount = total;
    this.parcelasPagas = parcelasPagas;
    this.totalParcelasNaoPagas = parcelasNaoPagas;

    this.dadosDoGraficoDePizza = [
      { name: 'Guias Não Enviadas', value: parcelasNaoPagas },
      { name: 'Guias Enviadas', value: parcelasPagas }
    ];
  }

  ProcessarDadosDasEmpresas(empresasData: any): void {
    if (!empresasData || !empresasData.results) {
      console.warn('Dados de empresas inválidos:', empresasData);
      return;
    }

    const empresas = empresasData.results;
    this.totalEmpresas = empresas.length;

    this.comCertificadoCount = empresas.filter((empresa: any) => empresa.possuiCertificado).length;
    this.comProcuracaoCount = empresas.filter((empresa: any) => empresa.possuiProcuracao).length;

    this.dadosGraficoCertificados = [
      { name: 'Sem Certificado', value: this.totalEmpresas - this.comCertificadoCount },
      { name: 'Com Certificado', value: this.comCertificadoCount }
    ];

    this.dadosGraficoProcuracao = [
      { name: 'Sem Procuração', value: this.totalEmpresas - this.comProcuracaoCount },
      { name: 'Com Procuração', value: this.comProcuracaoCount }
    ];
  }

  navegarParaParcelamentos() {
    this.router.navigate(['/parcelamentos']);
  }

  private lidarComErro(error: HttpErrorResponse, endpoint: string) {
    console.error(`Erro ao buscar ${endpoint}:`, error);

    if (error.status === 403) {
      this.sessionService.notificarSessaoExpirada();
    }
  }

}
