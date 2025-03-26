import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasService } from '../../empresas/empresas.service';
import { FormatUtilsService } from '../../global/service/format-utils.service';
import { SessionService } from '../../global/service/session.service';
import { ParcelamentosService } from '../parcelamentos.service';

@Component({
  selector: 'app-parcelamentos-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './parcelamentos-form.component.html',
  styleUrls: ['./parcelamentos-form.component.scss']
})
export class ParcelamentosFormComponent implements OnInit {
  FormularioDeParcelamento: FormGroup;
  parcelamento = this.obterParcelamentoPadrao();
  isEditMode = false;
  loading = false;
  mensagemDeErro: string | null = null;
  exibirPopup: boolean = false;
  mensagemSucesso: string = '';
  exibirModalSucesso: boolean = false;

  constructor(
    private parcelamentosService: ParcelamentosService,
    private empresasService: EmpresasService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private formUtils: FormatUtilsService,
  ) {
    this.FormularioDeParcelamento = this.fb.group({
      numeroParcelamento: ['', [Validators.required, Validators.min(1), Validators.max(9999999999999)]],
      tipoParcelamento: ['', [Validators.required]],
      valorParcela: ['', [Validators.required, Validators.min(1), Validators.max(9999999999999)]],
      enviadoMesAtual: [false, [Validators.required]],
      empresa: this.fb.group({
        apelidoId: ['', [Validators.required, Validators.min(1), Validators.max(99999999)]],
      })
    });
  }

  ngOnInit(): void {
    const parcelamentoId = this.route.snapshot.params['id'];
    if (parcelamentoId) {
      this.isEditMode = true;
      this.carregarParcelamento(parcelamentoId);
    }
  }

  carregarParcelamento(id: number): void {
    this.loading = true;
    this.mensagemDeErro = '';

    this.parcelamentosService.obterParcelamentoPorId(id).subscribe({
      next: (data) => {
        if (data) {
          this.FormularioDeParcelamento.patchValue({
            numeroParcelamento: data.numeroParcelamento,
            tipoParcelamento: data.tipoParcelamento,
            valorParcela: data.valorParcela,
            enviadoMesAtual: data.enviadoMesAtual,
            empresa: data.empresa
          });

          this.FormularioDeParcelamento.get('numeroParcelamento')?.disable();
          this.FormularioDeParcelamento.get('empresa.apelidoId')?.disable();
        } else {
          this.mensagemDeErro = 'Parcelamento não encontrado.';
        }
        this.loading = false;
      },
      error: (err) => this.lidarComErro(err, 'carregar parcelamento')
    });
  }

  buscarEmpresa(): void {
    const apelidoId = this.FormularioDeParcelamento.get('empresa.apelidoId')?.value;
    if (apelidoId) {
      this.empresasService.obterEmpresaPorId(apelidoId).subscribe({
        next: (data) => {
          if (data && data.razaoSocial) {
            this.parcelamento.empresa.razaoSocial = data.razaoSocial;
          } else {
            this.parcelamento.empresa.razaoSocial = '';
          }
        },
        error: (err) => {
          console.error('Erro ao buscar empresa:', err);
          this.parcelamento.empresa.razaoSocial = '';
        }
      });
    } else {
      this.parcelamento.empresa.razaoSocial = '';
    }
  }


  validarFormulario(): boolean {
    if (this.FormularioDeParcelamento.invalid) {
      this.formUtils.marcarCamposComoDirty(this.FormularioDeParcelamento);
      this.mostrarPopup('Por favor, preencha todos os campos corretamente.');
      return false;
    }
    return true;
  }

  saveParcelamento(): void {
    if (!this.validarFormulario()) {
      return;
    }


    this.loading = true;
    this.mensagemDeErro = '';

    if (this.isEditMode) {
      this.atualizarParcelamento();
    } else {
      this.adicionarParcelamento();
    }
  }

  atualizarParcelamento(): void {
    const updatedParcelamento = this.obterParcelamentoAtualizado();
    console.log("Enviando para o backend:", updatedParcelamento);

    this.parcelamentosService.atualizarParcelamento(this.parcelamento).subscribe({
      next: () => {
        this.mensagemSucesso = 'Parcelamento atualizado com sucesso!';
        this.exibirModalSucesso = true;
      },
      error: (err) => this.lidarComErro(err, 'atualizar parcelamento'),
      complete: () => (this.loading = false),
    });
  }

  adicionarParcelamento(): void {
    this.parcelamentosService.adicionarParcelamento(this.parcelamento).subscribe({
      next: () => {
        this.mensagemSucesso = 'Parcelamento cadastrado com sucesso!';
        this.exibirModalSucesso = true;
      },
      error: (err) => this.lidarComErro(err, 'adicionar parcelamento'),
      complete: () => (this.loading = false),
    });
  }



  cancelar(): void {
    this.router.navigate(['/parcelamentos']);
  }

  private lidarComErro(error: HttpErrorResponse, endpoint: string) {
    console.error(`Erro ao buscar ${endpoint}:`, error);

    if (error.status === 403) {
      this.sessionService.notificarSessaoExpirada();
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
    this.router.navigate(['/parcelamentos']);
  }

  private obterParcelamentoPadrao() {
    return {
      numeroParcelamento: 0,
      tipoParcelamento: '',
      valorParcela: 0.0,
      enviadoMesAtual: false,
      empresa: {
        apelidoId: 0,
        razaoSocial: '',
        tipoEmpresa: '',
        cnpj: '',
        enderecoEmpresa: {
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          uf: '',
        }
      }
    };
  }

  private obterParcelamentoAtualizado(): Partial<typeof this.parcelamento> {
    return {
      tipoParcelamento: this.parcelamento.tipoParcelamento,
      valorParcela: this.parcelamento.valorParcela,
      enviadoMesAtual: this.parcelamento.enviadoMesAtual,
      empresa: this.parcelamento.empresa,
      numeroParcelamento: this.parcelamento.numeroParcelamento
    };
  }

  limitarEntrada(event: any, max: number) {
    if (event.target.value.length > max.toString().length) {
      event.target.value = event.target.value.slice(0, max.toString().length);
      this.FormularioDeParcelamento.controls[event.target.name].setValue(parseInt(event.target.value, 10));
    }
  }

}
