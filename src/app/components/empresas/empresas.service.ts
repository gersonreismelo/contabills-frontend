import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private apiUrl = 'http://localhost:8080/empresas';

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

  obterEmpresas(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  obterEmpresaPorId(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  cadastrarEmpresa(empresa: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, empresa, { headers: this.getAuthHeaders() });
  }

  atualizarEmpresa(empresa: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${empresa.apelidoId}`, empresa, { headers: this.getAuthHeaders() });
  }

  removerEmpresa(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
