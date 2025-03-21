import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CpfValidatorService } from '../../global/service/cpf-validator.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaFormService {
  constructor(private fb: FormBuilder, private cpfValidatorService: CpfValidatorService) { }

  criarFormulario(): FormGroup {
    return this.fb.group({
      apelidoId: ['', [Validators.required, Validators.maxLength(7)]],
      razaoSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      tipoEmpresa: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)]],
      iptu: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?[\s-]?\d{4,5}-\d{4}$/)]],
      capitalSocialEmpresa: ['', [Validators.required, Validators.min(0), Validators.max(1000000000)]],
      possuiProcuracao: [false, Validators.required],
      possuiCertificado: [false, Validators.required],
      enderecoEmpresa: this.fb.group({
        logradouro: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        numero: ['', [Validators.required, Validators.maxLength(7)]],
        complemento: [''],
        bairro: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        cidade: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        uf: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
        cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      }),
      socios: this.fb.array([
        this.fb.group({
          id: [0],
          cpf: ['', [Validators.required, this.cpfValidatorService.validacaoDeCpf()]],
        })
      ]),
    });
  }
}
