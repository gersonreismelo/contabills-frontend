export interface Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Empresa {
  apelidoId: number;
  razaoSocial: string;
  tipoEmpresa: string;
  cnpj: string;
  enderecoEmpresa: Endereco;
}

export interface Parcelamento {
  numeroParcelamento: number;
  tipoParcelamento: string;
  valorParcela: number;
  enviadoMesAtual: boolean;
  empresa: Empresa;
}
