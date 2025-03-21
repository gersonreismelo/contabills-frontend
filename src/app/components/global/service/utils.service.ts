import { Injectable } from '@angular/core';
import { Empresa, Socio } from './models';


@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() { }

  obterEmpresaPadrao(): Empresa {
    return {
      apelidoId: 0,
      razaoSocial: '',
      tipoEmpresa: '',
      cnpj: '',
      iptu: '',
      email: '',
      telefone: '',
      capitalSocialEmpresa: 0,
      possuiProcuracao: false,
      possuiCertificado: false,
      enderecoEmpresa: {
        logradouro: '',
        numero: 0,
        bairro: '',
        cidade: '',
        complemento: '',
        uf: '',
        cep: '',
      },
      socios: [this.obterSocioPadrao()],
      parcelamentos: [],
    };
  }

  obterSocioPadrao(): Socio {
    return {
      responsavelEmpresa: false,
      papelNaEmpresa: '',
      cpf: '',
      rg: '',
      dataDeEmissaoRg: '',
      nomeDaMae: '',
      nomeDoPai: '',
      dataNascimento: '',
      nacionalidade: '',
      estadoCivil: '',
      tipoDeComunhao: '',
      profissao: '',
      capitalSocialSocio: 0,
      enderecoSocio: {
        logradouro: '',
        numero: 0,
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
      },
      nome: '',
    };
  }
}
