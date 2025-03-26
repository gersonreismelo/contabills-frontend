import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SociosService {
  private apiUrl = 'http://localhost:8080/socios';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado. O usuário pode não estar autenticado.');
      return new HttpHeaders();
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  obterSocios(): Observable<{ content: any[] }> {
    return this.http.get<{ content: any[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
  }


  obterSocioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  adicionarSocio(socio: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, socio, { headers: this.getAuthHeaders() });
  }

  atualizarSocio(id: number, socio: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, socio, { headers: this.getAuthHeaders() });
  }

  deletarSocio(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  buscarIdPorCpf(cpf: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/buscarIdPorCpf/${cpf}`, { headers: this.getAuthHeaders() });
  }

  buscarSocioPorCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscarPorCpf/${cpf}`, { headers: this.getAuthHeaders() });
  }
}

