import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormatUtilsService } from '../global/service/format-utils.service';

@Injectable({
    providedIn: 'root'
})
export class CadastroFormService {
    constructor(private fb: FormBuilder, private formatUtilsService: FormatUtilsService) { }

    criarFormulario(): FormGroup {
        return this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(39)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(99)]],
            senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(29)]],
            confirmarSenha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(29)]],
            data: ['', [Validators.required, this.formatUtilsService.dataNoPassadoValidator]],
            telefone: ['', [Validators.required, Validators.pattern(/^\(?\d{2}\)?[\s-]?\d{4,5}-\d{4}$/)]],
            foto: [null]
        }, { validators: this.formatUtilsService.senhasCoincidem });
    }
}