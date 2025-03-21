export interface Endereco {
  logradouro: string;
  numero: number;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface Socio {
  id?: number;
  responsavelEmpresa: boolean;
  papelNaEmpresa: string;
  cpf: string;
  rg: string;
  dataDeEmissaoRg: string;
  cnh?: string;
  dataDeEmissaoCnh?: string;
  dataDeValidadeCnh?: string;
  nomeDaMae: string;
  nomeDoPai?: string;
  dataNascimento: string;
  nacionalidade: string;
  estadoCivil: string;
  tipoDeComunhao: string;
  profissao: string;
  capitalSocialSocio: number;
  enderecoSocio: Endereco;
  nome: string;
}

export interface Empresa {
  apelidoId: number;
  razaoSocial: string;
  tipoEmpresa: string;
  cnpj: string;
  iptu?: string;
  email: string;
  telefone: string;
  capitalSocialEmpresa: number;
  possuiProcuracao: boolean;
  possuiCertificado: boolean;
  enderecoEmpresa: Endereco;
  socios: Socio[];
  parcelamentos: any[];
}

export interface Parcelamento {
  numeroParcelamento: number;
  tipoParcelamento: string;
  valorParcela: number;
  enviadoMesAtual: boolean;
  empresa: Empresa;
}




