import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Parcelamento } from '../parcelamentos/parcelamento';

@Injectable({
  providedIn: 'root'
})
export class ParcelamentosService {
  private apiUrl = 'http://localhost:8080/parcelamentos';

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

  obterParcelamentos(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  obterParcelamentoPorId(id: number): Observable<Parcelamento> {
    if (isNaN(id) || id <= 0) {
      return throwError(() => new Error('ID inválido.'));
    }

    return this.http.get<Parcelamento>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  adicionarParcelamento(parcelamento: any): Observable<any> {
    return this.http.post(this.apiUrl, parcelamento, { headers: this.getAuthHeaders() });
  }

  atualizarParcelamento(parcelamento: Partial<Parcelamento>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${parcelamento.numeroParcelamento}`, parcelamento, { headers: this.getAuthHeaders() });
  }

  editarParcelamento(id: number, updates: Partial<Parcelamento>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, updates, { headers: this.getAuthHeaders() });
  }

  deletarParcelamento(numeroParcelamento: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${numeroParcelamento}`, { headers: this.getAuthHeaders() });
  }

  enviarPdfParcelamento(idParcelamento: number, formData: FormData, subject: string, text: string): Observable<any> {
    const url = `${this.apiUrl}/enviar-pdf/${idParcelamento}`;
    formData.append('subject', subject);
    formData.append('text', text);

    const headers = this.getAuthHeaders().delete('Content-Type');
    return this.http.post(url, formData, { headers, responseType: 'text' });
  }
}
