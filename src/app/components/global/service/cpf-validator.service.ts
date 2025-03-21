import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CpfValidatorService {

  validacaoDeCpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log("Validando CPF:", control.value);

      const cpf = control.value;
      if (!cpf) return null;

      const cpfLimpo = cpf.replace(/[^\d]+/g, '');

      if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
        console.log("CPF inválido (tamanho ou repetição de números iguais)");
        return { cpfInvalido: true };
      }

      let soma = 0;
      let peso = 10;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * peso--;
      }
      let primeiroDigito = (soma * 10) % 11;
      if (primeiroDigito === 10 || primeiroDigito === 11) primeiroDigito = 0;

      soma = 0;
      peso = 11;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * peso--;
      }
      let segundoDigito = (soma * 10) % 11;
      if (segundoDigito === 10 || segundoDigito === 11) segundoDigito = 0;

      if (cpfLimpo.charAt(9) === primeiroDigito.toString() && cpfLimpo.charAt(10) === segundoDigito.toString()) {
        console.log("CPF válido");
        return null;
      }

      console.log("CPF inválido (dígitos verificadores errados)");
      return { cpfInvalido: true };
    };
  }
}
