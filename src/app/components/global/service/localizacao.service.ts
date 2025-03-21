import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Municipio {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {

  private baseUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades';

  constructor(private http: HttpClient) { }

  obterEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(`${this.baseUrl}/estados`);
  }

  obterMunicipios(uf: string): Observable<Municipio[]> {
    return this.http.get<Municipio[]>(`${this.baseUrl}/estados/${uf}/municipios`);
  }

  consultaCep(cep: string): Observable<any> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    return this.http.get(url);
  }
}