import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CpfValidatorService } from '../../global/service/cpf-validator.service';

@Injectable({
  providedIn: 'root'
})
export class SociosFormService {
  constructor(private fb: FormBuilder, private cpfValidatorService: CpfValidatorService) { }

  criarFormulario(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      cpf: ['', [Validators.required, this.cpfValidatorService.validacaoDeCpf()]],
      rg: ['', [Validators.required]],
      dataDeEmissaoRg: ['', Validators.required],
      cnh: [''],
      dataDeEmissaoCnh: [''],
      dataDeValidadeCnh: [''],
      dataNascimento: ['', [Validators.required]],
      nacionalidade: ['', [Validators.required]],
      estadoCivil: ['', [Validators.required]],
      tipoDeComunhao: ['', [Validators.required]],
      profissao: ['', [Validators.required]],
      nomeDaMae: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      nomeDoPai: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      enderecoSocio: this.fb.group({
        logradouro: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        numero: ['', [Validators.required, Validators.maxLength(7)]],
        complemento: [''],
        bairro: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
        cidade: ['', [Validators.required]],
        uf: ['', [Validators.required]],
        cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      })
    });
  }
}
