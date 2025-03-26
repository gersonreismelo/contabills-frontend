import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CpfValidatorService } from '../../global/service/cpf-validator.service';
import { FormatUtilsService } from '../../global/service/format-utils.service';
import { LocalizacaoService } from '../../global/service/localizacao.service';
import { Socio } from '../../global/service/models';
import { SessionService } from '../../global/service/session.service';
import { UtilsService } from '../../global/service/utils.service';
import { SociosService } from '../socios.service';
import { SociosFormService } from './socios-form.service';

@Component({
  selector: 'app-socios-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './socios-form.component.html',
  styleUrls: ['./socios-form.component.scss']
})
export class SociosFormComponent implements OnInit {
  formularioDeSocio: FormGroup;
  socio!: Socio;
  mensagemErro: string | null = null;
  mensagemErroCep: string | null = null;
  mensagemDeSucesso: string = '';
  public socioId: number | null = null;
  public loading = false;
  exibirPopup: boolean = false;
  exibirPopupSucesso: boolean = false;
  estados: any[] = [];
  municipios: any[] = [];

  constructor(
    private fb: FormBuilder,
    private sociosService: SociosService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private cpfValidatorService: CpfValidatorService,
    private formUtils: FormatUtilsService,
    private localizacaoService: LocalizacaoService,
    private sociosFormService: SociosFormService,
    private empresaUtilsService: UtilsService
  ) { this.formularioDeSocio = this.sociosFormService.criarFormulario(); }

  ngOnInit(): void {
    this.socio = this.empresaUtilsService.obterSocioPadrao();
    this.localizacaoService.obterEstados().subscribe(estados => {
      this.estados = estados;
    });

    this.formularioDeSocio.get('enderecoSocio.uf')?.valueChanges.subscribe(uf => {
      if (uf) {
        this.localizacaoService.obterMunicipios(uf).subscribe(municipios => {
          this.municipios = municipios;
        });
      } else {
        this.municipios = [];
      }
    });

    this.socioId = Number(this.route.snapshot.params['id']);
    if (this.socioId) {
      this.carregarSocio(this.socioId);
    }
  }

  carregarSocio(id: number): void {
    this.loading = true;
    this.sociosService.obterSocioPorId(id).subscribe({
      next: (dados) => {
        this.socio = dados;
        this.loading = false;
      },
      error: (err) => this.lidarComErro(err, 'carregar dados do sócio')
    });
  }

  formatarCEP(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = this.formUtils.formatarCEP(input.value);
  }

  consultarEnderecoPorCep(): void {
    const cep = this.formularioDeSocio.get('enderecoSocio.cep')?.value;
    if (cep && cep.length === 9) {
      const cepLimpo = cep.replace('-', '');
      this.localizacaoService.consultaCep(cepLimpo).subscribe({
        next: (res) => {
          if (res.erro === 'true' || res.erro === true) {
            this.mensagemErroCep = 'CEP inválido';
            this.formularioDeSocio.patchValue({
              enderecoSocio: {
                logradouro: '',
                bairro: '',
                cidade: '',
                uf: ''
              }
            });
          } else {
            this.formularioDeSocio.patchValue({
              enderecoSocio: {
                logradouro: res.logradouro,
                bairro: res.bairro,
                cidade: res.localidade,
                uf: res.uf
              }
            });
            this.mensagemErroCep = '';
          }
        },
        error: (err) => {
          console.error('Erro ao consultar CEP:', err);
          this.mensagemErroCep = 'CEP inválido';
        }
      });
    }
  }


  formatarCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cpf = input.value;
    const cpfFormatado = this.formUtils.formatarCPF(cpf);
    this.socio.cpf = cpfFormatado;
  }

  validarFormulario(): boolean {
    if (this.formularioDeSocio.invalid) {
      this.formUtils.marcarCamposComoDirty(this.formularioDeSocio);
      this.mostrarPopup('Por favor, preencha todos os campos corretamente.');
      return false;
    }
    return true;
  }

  salvarSocio(): void {
    if (!this.validarFormulario()) {
      return;
    }
    this.loading = true;
    this.mensagemErro = '';

    if (this.socioId) {
      this.atualizarSocio();
    } else {
      this.adicionarSocio();
    }
  }

  atualizarSocio(): void {
    this.sociosService.atualizarSocio(this.socioId!, this.socio).subscribe({
      next: () => {
        this.mensagemDeSucesso = 'Sócio atualizado com sucesso!';
        this.exibirPopupSucesso = true;
      },
      error: (err) => this.lidarComErro(err, 'atualizar o sócio'),
      complete: () => (this.loading = false)
    });
  }

  adicionarSocio(): void {
    this.sociosService.adicionarSocio(this.socio).subscribe({
      next: () => {
        this.mensagemDeSucesso = 'Sócio cadastrado com sucesso!';
        this.exibirPopupSucesso = true;
      },
      error: (err) => this.lidarComErro(err, 'adicionar o sócio'),
      complete: () => (this.loading = false)
    });
  }

  mostrarPopup(mensagem: string): void {
    this.mensagemErro = mensagem;
    this.exibirPopup = true;
  }

  fecharPopup(): void {
    this.exibirPopup = false;
    this.mensagemErro = null;
  }

  fecharPopupSucesso(): void {
    this.exibirPopupSucesso = false;
    this.router.navigate(['/socios']);
  }

  private lidarComErro(error: HttpErrorResponse, endpoint: string) {
    console.error(`Erro ao buscar ${endpoint}:`, error);

    if (error.status === 403) {
      this.sessionService.notificarSessaoExpirada();
    }
  }

}