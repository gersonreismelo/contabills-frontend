import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormatUtilsService } from '../global/service/format-utils.service';
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioFormService } from './cadastro-form.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  formularioDeCadastro: FormGroup;
  mensagemDeErro: string | null = null;
  exibirPopup: boolean = false;
  exibirPopupSucesso: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private formatUtilsService: FormatUtilsService,
    private cadastroFormService: UsuarioFormService,
    private router: Router
  ) {
    this.formularioDeCadastro = this.cadastroFormService.criarFormulario();
  }

  aoInserirTelefone(event: any): void {
    const input = event.target.value;
    const formatted = this.formatUtilsService.formatarTelefone(input);
    this.formularioDeCadastro.get('telefone')?.setValue(formatted, { emitEvent: false });
  }

  mostrarPopup(mensagem: string): void {
    this.mensagemDeErro = mensagem;
    this.exibirPopup = true;
  }

  fecharPopup(): void {
    this.exibirPopup = false;
    this.mensagemDeErro = null;
  }

  fecharPopupSucesso(): void {
    this.exibirPopupSucesso = false;
    this.router.navigate(['/login']);
  }

  validarFormulario(): boolean {
    if (this.formularioDeCadastro.invalid) {
      this.formatUtilsService.marcarCamposComoDirty(this.formularioDeCadastro);
      this.mensagemDeErro = 'Por favor, preencha todos os campos corretamente.';
      this.exibirPopup = true;
      return false;
    }
    return true;
  }

  cadastrar(): void {
    if (!this.validarFormulario()) {
      return;
    }

    const formData = this.formularioDeCadastro.value;
    this.usuarioService.cadastrar(formData).subscribe(
      () => {
        this.exibirPopupSucesso = true;
      },
      error => this.mostrarPopup('Erro ao cadastrar usuário!')
    );
  }

  navegarParaLogin(): void {
    this.router.navigate(['/login']);
  }
}