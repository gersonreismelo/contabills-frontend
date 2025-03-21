import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../global/service/session.service';
import { SociosService } from '../socios.service';

@Component({
  selector: 'app-lista-de-socios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './socios-list.component.html',
  styleUrls: ['./socios-list.component.scss']
})
export class SociosListComponent implements OnInit {
  public socios: any[] = [];
  public termoBuscaSocio: string = '';
  public isLoading: boolean = false;
  public MensagemErro: string | null = null;
  public exibirModalExclusao: boolean = false;
  private socioParaExcluir: any = null;

  constructor(
    private sociosService: SociosService,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.carregarSocios();
  }

  carregarSocios(): void {
    this.isLoading = true;
    this.MensagemErro = null;

    this.sociosService.obterSocios().subscribe({
      next: (dados) => {
        this.socios = dados.content ?? [];
        this.isLoading = false;
      },
      error: (err) => this.lidarComErro(err, 'carregar os dados dos sócios')
    });
  }


  get sociosFiltrados() {
    const termo = this.termoBuscaSocio.toLowerCase();
    return this.socios.filter((socio) => socio.nome.toLowerCase().includes(termo));
  }

  navegarParaAdicionarSocio(): void {
    this.router.navigate(['/novo-socio']);
  }

  navegarParaEditarSocio(id: number): void {
    this.router.navigate([`/editar-socio/${id}`]);
  }

  navegarParaEmpresa(empresa: any): void {
    this.router.navigate(['/empresas', empresa.apelidoId]);
  }

  confirmarExclusao(socio: any): void {
    this.socioParaExcluir = socio;
    this.exibirModalExclusao = true;
  }

  cancelarExclusao(): void {
    this.exibirModalExclusao = false;
    this.socioParaExcluir = null;
  }

  deletarSocio(): void {
    if (!this.socioParaExcluir) return;

    this.sociosService.deletarSocio(this.socioParaExcluir.id).subscribe({
      next: () => {
        this.carregarSocios();
        this.cancelarExclusao();
      },
      error: (err) => this.lidarComErro(err, 'excluir o sócio')
    });
  }

  private lidarComErro(error: HttpErrorResponse, endpoint: string) {
    console.error(`Erro ao buscar ${endpoint}:`, error);

    if (error.status === 403) {
      this.sessionService.notificarSessaoExpirada();
    }
  }
}
