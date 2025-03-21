import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private assuntoUsuarioLogado = new BehaviorSubject<string | null>(localStorage.getItem('token') ? 'User' : null);
  loggedInUser = this.assuntoUsuarioLogado.asObservable();

  constructor() { }

  logout(): void {
    localStorage.removeItem('token');
    this.assuntoUsuarioLogado.next(null);
  }

  estaLogado(): boolean {
    return !!localStorage.getItem('token');
  }

  registrarUsuarioLogado(user: string): void {
    this.assuntoUsuarioLogado.next(user);
  }
}
