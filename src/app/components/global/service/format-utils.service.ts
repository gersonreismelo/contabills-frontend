import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

@Injectable({ providedIn: 'root' })

export class FormatUtilsService {

  dataNoPassadoValidator(control: AbstractControl): ValidationErrors | null {
    const dataSelecionada = new Date(control.value);
    const hoje = new Date();
    const idade = hoje.getFullYear() - dataSelecionada.getFullYear();

    if (dataSelecionada > hoje) {
      return { dataFutura: true };
    }

    if (idade > 150) {
      return { idadeInvalida: true };
    }

    return null;
  }

  formatarTelefone(input: string): string {
    let numero = input.replace(/\D/g, '');
    if (numero.length > 11) {
      numero = numero.substring(0, 11);
    }
    if (numero.length > 10) {
      return `(${numero.substring(0, 2)}) ${numero.substring(2, 7)}-${numero.substring(7, 11)}`;
    } else if (numero.length > 6) {
      return `(${numero.substring(0, 2)}) ${numero.substring(2, 6)}-${numero.substring(6, 10)}`;
    } else if (numero.length > 2) {
      return `(${numero.substring(0, 2)}) ${numero.substring(2)}`;
    } else if (numero.length > 0) {
      return `(${numero}`;
    }
    return numero;
  }

  formatarCPF(input: string): string {
    let cpf = input.replace(/\D/g, '');
    if (cpf.length <= 3) {
      return cpf;
    } else if (cpf.length <= 6) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}`;
    } else if (cpf.length <= 9) {
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}`;
    }
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  }

  formatarCNPJ(input: string): string {
    let cnpj = input.replace(/\D/g, '');
    if (cnpj.length <= 2) {
      return cnpj;
    } else if (cnpj.length <= 5) {
      return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}`;
    } else if (cnpj.length <= 8) {
      return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}`;
    } else if (cnpj.length <= 12) {
      return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}`;
    }
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
  }

  formatarCEP(cep: string): string {
    cep = cep.replace(/\D/g, '');
    if (cep.length <= 5) {
      return cep;
    } else {
      return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
    }
  }


  limitarCapital(valor: number): number {
    if (valor < 0) return 0;
    if (valor > 999999999) return 999999999;
    return valor;
  }

  marcarCamposComoDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);

      if (controle instanceof FormGroup) {
        Object.keys(controle.controls).forEach(subCampo => {
          controle.get(subCampo)?.markAsDirty();
          controle.get(subCampo)?.updateValueAndValidity();
        });
      } else if (controle instanceof FormArray) {
        (controle as FormArray).controls.forEach((grupo: AbstractControl) => {
          if (grupo instanceof FormGroup) {
            Object.keys(grupo.controls).forEach(campoGrupo => {
              grupo.get(campoGrupo)?.markAsDirty();
              grupo.get(campoGrupo)?.updateValueAndValidity();
            });
          }
        });
      } else {
        controle?.markAsDirty();
        controle?.updateValueAndValidity();
      }
    });
  }

  senhasCoincidem(formGroup: FormGroup): { [key: string]: boolean } | null {
    const senha = formGroup.get('senha')?.value;
    const confirmarSenha = formGroup.get('confirmarSenha')?.value;
    return senha !== confirmarSenha ? { senhaDiferente: true } : null;
  }

  dataFuturaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const dataInformada = new Date(control.value);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataInformada.setHours(0, 0, 0, 0);

    return dataInformada <= hoje ? { dataNaoFutura: true } : null;
  }

}