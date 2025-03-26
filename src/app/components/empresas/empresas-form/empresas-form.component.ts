import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CpfValidatorService } from '../../global/service/cpf-validator.service';
import { FormatUtilsService } from '../../global/service/format-utils.service';
import { LocalizacaoService } from '../../global/service/localizacao.service';
import { Empresa } from '../../global/service/models';
import { SessionService } from '../../global/service/session.service';
import { UtilsService } from '../../global/service/utils.service';
import { SociosService } from '../../socios/socios.service';
import { EmpresasService } from '../empresas.service';
import { EmpresaFormService } from './empresas-form.service';

@Component({
  selector: 'app-empresas-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './empresas-form.component.html',
  styleUrls: ['./empresas-form.component.scss'],
})
export class EmpresasFormComponent implements OnInit {
  empresa!: Empresa;
  FormularioDeEmpresa: FormGroup;
  mensagemDeErro: string | null = null;
  mensagemDeErroCep: string | null = null;
  exibirPopup: boolean = false;
  estados: any[] = [];
  municipios: any[] = [];
  loading: boolean = false;
  isEditing: boolean = false;
  mensagemSucesso: string = '';
  exibirModalSucesso: boolean = false;
  exibirPopupConfirmacao: boolean = false;


  constructor(
    private fb: FormBuilder,
    private empresasService: EmpresasService,
    private sociosService: SociosService,
    private router: Router,
    private route: ActivatedRoute,
    private localizacaoService: LocalizacaoService,
    private formUtils: FormatUtilsService,
    private cpfValidatorService: CpfValidatorService,
    private sessionService: SessionService,
    private empresaFormService: EmpresaFormService,
    private empresaUtilsService: UtilsService
  ) { this.FormularioDeEmpresa = this.empresaFormService.criarFormulario(); }

  ngOnInit(): void {
    this.empresa = this.empresaUtilsService.obterEmpresaPadrao();
    this.localizacaoService.obterEstados().subscribe(estados => {
      this.estados = estados;
    });

    this.FormularioDeEmpresa.get('enderecoEmpresa.uf')?.valueChanges.subscribe(uf => {
      if (uf) {
        this.localizacaoService.obterMunicipios(uf).subscribe(municipios => {
          this.municipios = municipios;
        });
      } else {
        this.municipios = [];
      }
    });

    const empresaId = this.route.snapshot.paramMap.get('id');
    if (empresaId) {
      this.isEditing = true;
      this.carregarEmpresaPorId(empresaId);
    }
  }


  carregarEmpresaPorId(empresaId: string): void {
    this.loading = true;
    this.mensagemDeErro = '';
    this.empresasService.obterEmpresaPorId(empresaId).subscribe({
      next: (data) => {
        if (data) {
          this.empresa = data;
          this.FormularioDeEmpresa.patchValue(this.empresa);

          this.atribuirArrayFormularioSocios(this.empresa.socios);
        } else {
          console.warn('Empresa não encontrada.');
          this.mensagemDeErro = 'Empresa não encontrada.';
        }
        this.loading = false;
      },
      error: (error) => this.lidarComErro(error, 'carregar empresa')
    });
  }

  onCpfBlur(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const cpf = input.value;

    if (cpf && cpf.length >= 11) {
      this.buscarSocioPorCpf(cpf, index);
    }
  }

  buscarSocioPorCpf(cpf: string, index: number): void {
    this.sociosService.buscarSocioPorCpf(cpf).subscribe({
      next: (socio) => {
        if (this.empresa.socios && this.empresa.socios[index]) {
          this.empresa.socios[index].nome = socio.nome;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao buscar dados do sócio pelo CPF:', error);
        if (error.status === 404) {
          this.mostrarPopup('CPF não vinculado a nenhum sócio.');
          if (this.empresa.socios && this.empresa.socios[index]) {
            this.empresa.socios[index].nome = '';
          }
        } else {
          this.mostrarPopup('Erro ao buscar sócio.');
          if (this.empresa.socios && this.empresa.socios[index]) {
            this.empresa.socios[index].nome = '';
          }
        }
      }
    });
  }

  atribuirArrayFormularioSocios(socios: any[]) {
    const sociosFormArray = this.FormularioDeEmpresa.get('socios') as FormArray;
    sociosFormArray.clear();

    socios.forEach(socio => {
      sociosFormArray.push(this.fb.group({
        id: [socio.id],
        cpf: [socio.cpf, [Validators.required, this.cpfValidatorService.validacaoDeCpf()]]
      }));
    });
  }

  get socios() {
    return this.FormularioDeEmpresa.get('socios') as FormArray;
  }

  removerSocio(i: number): void {
    const sociosArray = this.FormularioDeEmpresa.get('socios') as FormArray;
    if (i === 0) {
      this.mostrarPopup('Uma empresa deve ter ao menos 1 sócio.');
      return;
    }

    sociosArray.removeAt(i);
    this.empresa.socios.splice(i, 1);
  }

  adicionarSocio(): void {
    const sociosArray = this.FormularioDeEmpresa.get('socios') as FormArray;
    sociosArray.push(this.fb.group({
      id: [0],
      cpf: ['', [Validators.required, this.cpfValidatorService.validacaoDeCpf()]]
    }));

    this.empresa.socios.push(this.empresaUtilsService.obterSocioPadrao());
  }

  aoMudarTipoEmpresa(): void {
    const tipoEmpresa = this.FormularioDeEmpresa.get('tipoEmpresa')?.value;
    if (tipoEmpresa === 'Empresário Individual') {
      const sociosArray = this.FormularioDeEmpresa.get('socios') as FormArray;
      while (sociosArray.length > 1) {
        sociosArray.removeAt(1);
        this.empresa.socios.splice(1, 1);
      }
    }
  }

  get tipoEmpresa(): string {
    return this.FormularioDeEmpresa.get('tipoEmpresa')?.value;
  }

  navegarParaCadastroSocio() {
    this.router.navigate(['//novo-socio']);
  }

  limitarApelido(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 7) {
      input.value = input.value.slice(0, 7);
      this.empresa.apelidoId = Number(input.value);
      this.FormularioDeEmpresa.patchValue({ apelidoId: Number(input.value) });
    } else {
      this.empresa.apelidoId = Number(input.value);
    }
  }

  limitarCapitalSocial(): void {
    const controle = this.FormularioDeEmpresa.get('capitalSocialEmpresa');
    if (controle) {
      let valor = controle.value;
      if (!valor || isNaN(valor)) {
        controle.setValue('', { emitEvent: false });
      } else {
        controle.setValue(this.formUtils.limitarCapital(Number(valor)), { emitEvent: false });
      }
    }
  }

  formatarTelefone(event: any): void {
    const input = event.target as HTMLInputElement;
    const telefone = input.value;
    const telefoneFormatado = this.formUtils.formatarTelefone(telefone);
    this.FormularioDeEmpresa.patchValue({ telefone: telefoneFormatado });
  }

  formatarCEP(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = this.formUtils.formatarCEP(input.value);
  }

  consultarEnderecoPorCep() {
    const cep = this.FormularioDeEmpresa.get('enderecoEmpresa.cep')?.value;
    if (cep && cep.length === 9) {
      this.localizacaoService.consultaCep(cep.replace('-', '')).subscribe({
        next: (res) => {
          if (res.erro === 'true' || res.erro === true) {
            this.mensagemDeErroCep = 'CEP inválido';
            this.FormularioDeEmpresa.patchValue({
              enderecoEmpresa: {
                logradouro: '',
                bairro: '',
                cidade: '',
                uf: ''
              }
            });
          } else {
            this.FormularioDeEmpresa.patchValue({
              enderecoEmpresa: {
                logradouro: res.logradouro,
                bairro: res.bairro,
                cidade: res.localidade,
                uf: res.uf
              }
            });
            this.mensagemDeErroCep = '';
          }
        },
        error: (err) => {
          console.error('Erro ao consultar CEP:', err);
          this.mensagemDeErroCep = 'CEP inválido';
        }
      });
    }
  }


  formatarCNPJ(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cnpj = input.value;
    const cnpjFormatado = this.formUtils.formatarCNPJ(cnpj);
    this.FormularioDeEmpresa.patchValue({ cnpj: cnpjFormatado });
  }

  formatarCPF(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const cpf = input.value;
    const cpfFormatado = this.formUtils.formatarCPF(cpf);

    if (this.empresa.socios && this.empresa.socios[index]) {
      this.empresa.socios[index].cpf = cpfFormatado;
    } else {
      console.error(`Índice ${index} fora dos limites do array empresa.socios.`);
    }
  }

  mostrarPopup(mensagem: string): void {
    this.mensagemDeErro = mensagem;
    this.exibirPopup = true;
  }

  fecharPopup(): void {
    this.exibirPopup = false;
    this.mensagemDeErro = null;
  }

  fecharModalSucesso(): void {
    this.exibirModalSucesso = false;
    this.router.navigate(['/empresas']);
  }

  confirmarNavegacaoCadastroSocio() {
    this.exibirPopupConfirmacao = true;
  }

  fecharPopupConfirmacao() {
    this.exibirPopupConfirmacao = false;
  }

  validarFormulario(): boolean {
    if (this.FormularioDeEmpresa.invalid) {
      this.formUtils.marcarCamposComoDirty(this.FormularioDeEmpresa);
      this.mostrarPopup('Por favor, preencha todos os campos corretamente.');
      return false;
    }
    return true;
  }

  saveEmpresa(): void {
    if (!this.validarFormulario()) {
      return;
    }
    this.loading = true;
    this.mensagemDeErro = '';
    let isNovaEmpresa: boolean;

    const sociosArray = this.FormularioDeEmpresa.get('socios') as FormArray;
    const socios = sociosArray.controls.map((control) => control.value);
    const socioRequests = socios.map((socio) =>
      socio.id && socio.id !== 0
        ? this.sociosService.atualizarSocio(socio.id, socio)
        : this.sociosService.adicionarSocio(socio)
    );

    Promise.all(socioRequests)
      .then(() => {
        const empresaData = this.FormularioDeEmpresa.value;
        this.empresa = { ...this.empresa, ...empresaData };
        isNovaEmpresa = this.router.url.includes('/nova-empresa');

        if (isNovaEmpresa) {
          return this.empresasService.cadastrarEmpresa(this.empresa).toPromise();
        } else {
          return this.empresasService.atualizarEmpresa(this.empresa).toPromise();
        }
      })
      .then(() => {
        this.mensagemSucesso = isNovaEmpresa ? 'Empresa cadastrada com sucesso!' : 'Empresa atualizada com sucesso!';
        this.exibirModalSucesso = true;
      })
      .catch((error) => this.lidarComErro(error, 'salvar empresa'))
      .finally(() => (this.loading = false));
  }

  private lidarComErro(error: HttpErrorResponse, endpoint: string) {
    console.error(`Erro ao buscar ${endpoint}:`, error);

    if (error.status === 403) {
      this.sessionService.notificarSessaoExpirada();
    }
  }
}
