import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../global/service/auth.service';
import { UsuarioService } from '../usuario/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  exibirPopup: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(99)]],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(29)]]
    });
  }

  validarFormulario(): boolean {
    if (this.loginForm.invalid) {
      this.marcarCamposComoDirty();
      this.mostrarPopup('Por favor, preencha todos os campos corretamente.');
      return false;
    }
    return true;
  }

  marcarCamposComoDirty(): void {
    Object.keys(this.loginForm.controls).forEach(campo => {
      const controle = this.loginForm.get(campo);
      if (controle) {
        controle.markAsDirty();
        controle.updateValueAndValidity();
      }
    });
  }

  mostrarPopup(mensagem: string): void {
    this.errorMessage = mensagem;
    this.exibirPopup = true;
  }

  fecharPopup(): void {
    this.exibirPopup = false;
    this.errorMessage = null;
  }

  login(): void {
    if (!this.validarFormulario()) {
      return;
    }

    const formData = this.loginForm.value;

    this.usuarioService.login(formData).subscribe(
      response => {
        console.log('Resposta do login:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userEmail', formData.email);
          this.authService.registrarUsuarioLogado('User');
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        } else {
          this.mostrarPopup('Credenciais inválidas. Verifique seu email e senha.');
        }
      },
      error => {
        console.error('Erro ao fazer login:', error);
        this.mostrarPopup('Erro ao tentar fazer login. Verifique suas credenciais.');
      }
    );
  }


  navegarParaCadastro(): void {
    this.router.navigate(['/register']);
  }
}