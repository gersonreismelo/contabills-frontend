import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private assuntoExpiracaoSessao = new BehaviorSubject<boolean>(false);
  sessionExpired$ = this.assuntoExpiracaoSessao.asObservable();

  constructor(private router: Router, private authService: AuthService) { }

  notificarSessaoExpirada(): void {
    this.authService.logout();
    this.assuntoExpiracaoSessao.next(true);
  }

  sessaoValida(): boolean {
    return !!localStorage.getItem('session_token');
  }

  redirecionarParaLogin(): void {
    this.assuntoExpiracaoSessao.next(false);
    this.router.navigate(['/login']);
  }
}
