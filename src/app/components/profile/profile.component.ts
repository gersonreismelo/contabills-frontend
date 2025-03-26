import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../global/service/auth.service';
import { SessionService } from '../global/service/session.service';
import { UsuarioService } from '../usuario/usuario.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  usuario: any = null;
  isEditing = false;
  private assinaturaDoUsuario!: Subscription;
  @ViewChild('fileInput') fileInput!: ElementRef;
  exibirModalConfirmacaoFoto = false;
  exibirModalConfirmacaoDados = false;
  novaFoto: File | null = null;
  enderecoFotoPerfil: string | null = null;
  novaFotoUrl: string | null = null;
  novaSenha = '';
  confirmarNovaSenha = '';
  exibirPopupSucessoFoto = false;
  exibirPopupSucessoDados = false;

  erroNome: string = '';
  erroSenha: string = '';
  erroConfirmarSenha: string = '';
  erroTelefone: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.carregarDadosUsuario();
  }

  validarNome() {
    if (!this.usuario.nome || this.usuario.nome.trim() === '') {
      this.erroNome = 'O nome é obrigatório.';
    } else if (this.usuario.nome.trim().length < 3) {
      this.erroNome = 'O nome deve ter pelo menos 3 caracteres.';
    } else {
      this.erroNome = '';
    }
  }

  validarSenhas() {
    if (this.novaSenha && this.novaSenha.trim() !== '') {
      if (this.novaSenha.trim().length < 8) {
        this.erroSenha = 'A senha deve ter pelo menos 8 caracteres.';
      } else {
        this.erroSenha = '';
      }
      if (this.novaSenha !== this.confirmarNovaSenha) {
        this.erroConfirmarSenha = 'As senhas não coincidem.';
      } else {
        this.erroConfirmarSenha = '';
      }
    } else {
      this.erroSenha = '';
      this.erroConfirmarSenha = '';
    }
  }

  validarTelefone() {
    if (!this.usuario.telefone || this.usuario.telefone.trim() === '') {
      this.erroTelefone = 'O telefone é obrigatório.';
      return;
    }
    const telefoneFormatado = this.usuario.telefone.replace(/\D/g, '');
    if (telefoneFormatado.length < 10) {
      this.erroTelefone = 'O telefone deve conter o DDD e ter pelo menos 8 dígitos no número.';
    } else {
      this.erroTelefone = '';
    }
  }

  eitarPerfil(): void {
    this.isEditing = true;
  }

  onTelefoneChange(value: string): void {
    let digits = value.replace(/\D/g, '');

    let formatted = '';

    if (!digits) {
      this.usuario.telefone = '';
      this.validarTelefone();
      return;
    }

    if (digits.length <= 2) {
      formatted = `(${digits}`;
    } else {
      formatted = `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    }

    if (digits.length > 6) {
      const total = digits.length;
      const bloco = total === 11 ? 5 : 4;

      const parte1 = digits.substring(0, 2);           // DDD
      const parte2 = digits.substring(2, 2 + bloco);   // Primeiros 4 ou 5
      const parte3 = digits.substring(2 + bloco);      // Restante

      formatted = `(${parte1}) ${parte2}-${parte3}`;
    }

    this.usuario.telefone = formatted;

    this.validarTelefone();
  }


  formatarTelefone(input: string): string {
    let numero = input.replace(/\D/g, '');
    if (numero.length === 10) {
      return `(${numero.substring(0, 2)}) ${numero.substring(2, 6)}-${numero.substring(6, 10)}`;
    } else if (numero.length === 11) {
      return `(${numero.substring(0, 2)}) ${numero.substring(2, 7)}-${numero.substring(7, 11)}`;
    }
    return input;
  }

  cancelarEdicao(): void {
    this.isEditing = false;
    this.carregarDadosUsuario();
  }

  salvarAlteracoes(): void {
    this.validarNome();
    this.validarTelefone();
    this.validarSenhas();

    if (this.erroNome || this.erroTelefone || this.erroSenha || this.erroConfirmarSenha) {
      alert('Por favor, corrija os erros antes de salvar.');
      return;
    }

    let dataFormatada = null;
    if (this.usuario.data) {
      dataFormatada = new Date(this.usuario.data).toISOString().split('T')[0];
    }

    const updates: any = {
      nome: this.usuario.nome.trim(),
      telefone: this.usuario.telefone,
      data: dataFormatada
    };

    if (this.novaSenha.trim()) {
      updates.senha = this.novaSenha;
    }

    this.usuarioService.atualizarUsuario(this.usuario.id, updates).subscribe(
      () => {
        this.isEditing = false;
        this.carregarDadosUsuario();
        this.exibirPopupSucessoDados = true;
      },
      error => {
        this.lidarComErro('Erro ao atualizar perfil', error);
      }
    );
  }

  logout(): void {
    try {
      this.authService.logout();
      this.router.navigate(['/login']);
    } catch (err) {
      this.lidarComErro('Erro ao fazer logout', err);
    }
  }

  lidarComErro(mensagem: string, erro: any): void {
    console.error(mensagem, erro);
    if (erro.status === 403) {
      this.sessionService.notificarSessaoExpirada();
    } else {
      alert(`${mensagem}: ${erro.message || erro}`);
    }
  }

  ngOnDestroy(): void {
    if (this.assinaturaDoUsuario) {
      this.assinaturaDoUsuario.unsubscribe();
    }
  }

  private carregarDadosUsuario(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.usuarioService.buscarUsuarioPorEmail(email).subscribe(
        usuario => {
          this.usuario = usuario;
          this.novaSenha = '';
          this.confirmarNovaSenha = '';
          if (this.usuario.id) {
            this.carregarFotoUsuario(this.usuario.id);
          }
        },
        error => {
          this.lidarComErro('Erro ao obter dados do usuário', error);
        }
      );
    }
  }

  private carregarFotoUsuario(userId: number): void {
    this.usuarioService.buscarFotoUsuario(userId).subscribe(
      (blob: Blob) => {
        this.enderecoFotoPerfil = URL.createObjectURL(blob);
      },
      error => {
        console.error('Erro ao buscar foto do usuário', error);
        this.enderecoFotoPerfil = null;
      }
    );
  }


  mudancaArquivo(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.novaFoto = file;
        this.novaFotoUrl = e.target.result;
        this.exibirModalConfirmacaoFoto = true;
      };
      reader.readAsDataURL(file);
    }
  }

  acionarEntradaArquivo(): void {
    this.fileInput.nativeElement.click();
  }

  abrirModalConfirmacaoAtualizacao(): void {
    this.exibirModalConfirmacaoDados = true;
  }

  fecharModalConfirmacaoAtualizacao(): void {
    this.exibirModalConfirmacaoDados = false;
  }

  confirmarSalvarAlteracoes(): void {
    this.exibirModalConfirmacaoDados = false;
    this.salvarAlteracoes();
  }

  confirmarMudancaFoto(): void {
    if (this.novaFoto) {
      const formData = new FormData();
      formData.append('foto', this.novaFoto, this.novaFoto.name);

      this.usuarioService.atualizarFoto(this.usuario.id, formData).subscribe(
        () => {
          window.location.reload();
        },
        error => {
          this.lidarComErro('Erro ao atualizar foto de perfil', error);
        }
      );
    }
  }

  cancelarMudancaFoto(): void {
    this.novaFoto = null;
    this.novaFotoUrl = null;
    this.exibirModalConfirmacaoFoto = false;
  }

  fecharPopupSucessoDados(): void {
    this.exibirPopupSucessoDados = false;
  }

  fecharPopupSucessoFoto(): void {
    this.exibirPopupSucessoFoto = false;
  }
}
