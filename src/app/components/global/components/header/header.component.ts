import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../usuario/usuario.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  usuarioLogado: string | null = null;
  usuarioFotoUrl: string | null = null;
  menuAberto: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioService: UsuarioService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.authService.loggedInUser.subscribe(user => {
      this.usuarioLogado = user;
    });
    this.carregarFotoDoUsuario();
  }

  carregarFotoDoUsuario(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.usuarioService.buscarUsuarioPorEmail(email).subscribe(
        usuario => {
          if (usuario && usuario.id) {
            this.usuarioService.buscarFotoUsuario(usuario.id).subscribe(
              (blob: Blob) => {
                this.usuarioFotoUrl = URL.createObjectURL(blob);
              },
              erro => {
                console.error('Erro ao buscar foto do usuário', erro);
                this.usuarioFotoUrl = null;
              }
            );
          }
        },
        error => {
          console.error('Erro ao buscar dados do usuário', error);
        }
      );
    }
  }

  alternarMenuHamburger(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenuHamburger(): void {
    this.menuAberto = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.menuAberto &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.menuAberto = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (window.innerWidth > 768) {
      this.menuAberto = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
