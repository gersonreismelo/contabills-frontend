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

  constructor(
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.carregarDadosUsuario();
  }

  eitarPerfil(): void {
    this.isEditing = true;
  }

  cancelarEdicao(): void {
    this.isEditing = false;
    this.carregarDadosUsuario();
  }

  salvarAlteracoes(): void {
    let dataFormatada = null;
    if (this.usuario.data) {
      dataFormatada = new Date(this.usuario.data).toISOString().split('T')[0];
    }

    const updates: any = {
      nome: this.usuario.nome,
      telefone: this.usuario.telefone,
      data: dataFormatada
    };

    if (this.novaSenha.trim()) {
      console.log(this.novaSenha)
      updates.senha = this.novaSenha;
    } else {
      console.log("coco")
    }

    this.usuarioService.atualizarUsuario(this.usuario.id, updates).subscribe(
      () => {
        this.isEditing = false;
        this.carregarDadosUsuario();
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
          this.carregarDadosUsuario();
          this.novaFoto = null;
          this.exibirModalConfirmacaoFoto = false;
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
}