import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado. O usuário pode não estar autenticado.');
      return new HttpHeaders();
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  cadastrar(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastro`, usuario);
  }

  login(credenciais: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciais);
  }

  buscarUsuarioPorEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/email?email=${email}`, { headers: this.getAuthHeaders() });
  }

  atualizarUsuario(id: number, updates: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, updates, {
      headers: this.getAuthHeaders(),
    });
  }

  atualizarFoto(id: number, formData: FormData): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/foto`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  buscarFotoUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/foto`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }
}