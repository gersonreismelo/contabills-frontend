import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../global/service/session.service';
import { UsuarioService } from '../../usuario/usuario.service';
import { Parcelamento } from '../parcelamento';
import { ParcelamentosService } from '../parcelamentos.service';

@Component({
  selector: 'app-parcelamento-list',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './parcelamentos-list.component.html',
  styleUrls: ['./parcelamentos-list.component.scss']
})
export class ParcelamentosListComponent implements OnInit {
  public parcelamentos: Parcelamento[] = [];
  public parcelamentosFiltrados: Parcelamento[] = [];
  public filtro: 'todos' | 'enviados' | 'naoEnviados' = 'naoEnviados';
  public showModal: boolean = false;
  public parcelamentoSelecionado: Parcelamento | null = null;
  public showFiltroModal: boolean = false;
  public showDeleteModal: boolean = false;
  public parcelamentoParaExcluir: Parcelamento | null = null;
  public loading: boolean = false;
  public errorMessage: string = '';
  public exibirPopupSucesso: boolean = false;
  public exibirPopupEnvioSucesso: boolean = false;
  public showUploadModal: boolean = false;
  public pdfSelecionado: File | null = null;
  public usuario: any = null;
  public subjectMensagem: string = '';
  public textMensagem: string = '';

  constructor(
    private parcelamentosService: ParcelamentosService,
    private router: Router,
    private sessionService: SessionService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.buscarParcelamentos();
    this.carregarDadosUsuario();
  }

  private carregarDadosUsuario(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.usuarioService.buscarUsuarioPorEmail(email).subscribe(
        data => {
          this.usuario = data;
        },
        error => {
          console.error('Erro ao carregar dados do usuário', error);
        }
      );
    }
  }

  buscarParcelamentos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.parcelamentosService.obterParcelamentos().subscribe({
      next: (data) => this.processarDadosParcelamentos(data),
      error: (error) => this.lidarComErro(error, 'parcelamentos')
    });
  }

  abrirModalUpload(parcelamento: Parcelamento): void {
    this.parcelamentoSelecionado = parcelamento;
    this.pdfSelecionado = null;
    this.showUploadModal = true;

    const nomeEmpresa = parcelamento.empresa?.razaoSocial || 'Empresa';
    const nomeUsuario = this.usuario?.nome || 'Cliente';
    this.subjectMensagem = `Parcelamento da ${nomeEmpresa} - Boleto para pagamento`;
    this.textMensagem = `Olá ${nomeEmpresa},\nSegue em anexo o boleto do parcelamento para pagamento.\n\nAtenciosamente,\n${nomeUsuario}.`;
  }



  selecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.pdfSelecionado = input.files[0];
    }
  }

  processarDadosParcelamentos(parcelasData: any): void {
    if (!parcelasData || !parcelasData.results) {
      console.warn('Dados de parcelamentos inválidos:', parcelasData);
      this.parcelamentos = [];
      this.loading = false;
      return;
    }

    this.parcelamentos = parcelasData.results;
    this.aplicarFiltro();
    this.loading = false;
  }

  aplicarFiltro(): void {
    switch (this.filtro) {
      case 'todos':
        this.parcelamentosFiltrados = [...this.parcelamentos];
        break;
      case 'enviados':
        this.parcelamentosFiltrados = this.parcelamentos.filter(p => p.enviadoMesAtual);
        break;
      case 'naoEnviados':
        this.parcelamentosFiltrados = this.parcelamentos.filter(p => !p.enviadoMesAtual);
        break;
    }
  }

  alterarFiltro(novoFiltro: 'todos' | 'enviados' | 'naoEnviados'): void {
    this.filtro = novoFiltro;
    this.aplicarFiltro();
    this.alternarModalFiltro();
  }

  alternarModalFiltro(): void {
    this.showFiltroModal = !this.showFiltroModal;
  }

  navegarParaAdicionarParcelamento(): void {
    this.router.navigate(['/novo-parcelamento']);
  }

  navegarParaEditarParcelamento(numeroParcelamento: number): void {
    this.router.navigate([`/editar-parcelamento/${numeroParcelamento}`]);
  }

  abrirConfirmacaoEnvio(): void {
    this.showUploadModal = false;
    this.showModal = true;
  }

  marcarComoEnviado(): void {
    if (this.parcelamentoSelecionado && this.pdfSelecionado) {
      const formData = new FormData();
      formData.append('file', this.pdfSelecionado);

      const idParcelamento = this.parcelamentoSelecionado.numeroParcelamento;

      const textMensagemHtml = this.textMensagem.replace(/\n/g, '<br/>');

      this.parcelamentosService.enviarPdfParcelamento(
        idParcelamento,
        formData,
        this.subjectMensagem,
        textMensagemHtml
      ).subscribe({
        next: () => {
          this.buscarParcelamentos();
          this.showModal = false;
          this.exibirPopupEnvioSucesso = true;
        },
        error: (error) => this.lidarComErro(error, 'enviar PDF do parcelamento')
      });
    }
  }

  cancelarUpload(): void {
    this.showUploadModal = false;
  }

  cancelarEnvio(): void {
    this.showModal = false;
  }

  navegarParaEmpresa(empresa: any): void {
    if (empresa && empresa.apelidoId) {
      this.router.navigate(['/empresas', empresa.apelidoId]);
    } else {
      console.error('Empresa ou apelidoId não encontrado.');
    }
  }

  confirmarDelete(parcelamento: Parcelamento): void {
    this.parcelamentoParaExcluir = parcelamento;
    this.showDeleteModal = true;
  }

  cancelarDelete(): void {
    this.showDeleteModal = false;
  }

  deletarParcelamento(numeroParcelamento: number): void {
    if (this.parcelamentoParaExcluir) {
      this.parcelamentosService.deletarParcelamento(numeroParcelamento).subscribe({
        next: () => {
          this.buscarParcelamentos();
          this.showDeleteModal = false;
          this.exibirPopupSucesso = true;
        },
        error: (error) => this.lidarComErro(error, 'excluir parcelamento')
      });
    }
  }

  fecharPopupSucesso(): void {
    this.exibirPopupSucesso = false;
  }

  fecharPopupEnvioSucesso(): void {
    this.exibirPopupEnvioSucesso = false;
  }

  private lidarComErro(error: HttpErrorResponse, endpoint: string) {
    console.error(`Erro ao buscar ${endpoint}:`, error);

    if (error.status === 403) {
      this.sessionService.notificarSessaoExpirada();
    }
  }
}
