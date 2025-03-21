import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../global/service/session.service';
import { EmpresasService } from '../empresas.service';

@Component({
  selector: 'app-empresas-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './empresas-detail.component.html',
  styleUrls: ['./empresas-detail.component.scss']
})
export class EmpresasDetailComponent implements OnInit {
  empresa: any;
  showModal: boolean = false;
  loading: boolean = false;
  mensagemDeErro: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private empresasService: EmpresasService,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    const apelidoId = this.route.snapshot.paramMap.get('id');
    if (apelidoId) {
      this.carregarEmpresaPorId(apelidoId);
    }
  }

  carregarEmpresaPorId(apelidoId: string): void {
    this.loading = true;
    this.mensagemDeErro = '';

    this.empresasService.obterEmpresaPorId(apelidoId).subscribe({
      next: (data) => {
        if (data) {
          this.empresa = data;
        } else {
          console.warn('Empresa não encontrada.');
          this.mensagemDeErro = 'Empresa não encontrada.';
        }
        this.loading = false;
      },
      error: (error) => this.lidarComErro(error, 'empresa')
    });
  }

  voltarPagina(): void {
    this.router.navigate(['/empresas']);
  }

  editarEmpresa(): void {
    if (this.empresa?.apelidoId) {
      this.router.navigate(['/empresas/edit', this.empresa.apelidoId]);
    } else {
      console.warn('ID da empresa não encontrado.');
    }
  }

  confirmarExclusao(): void {
    this.showModal = true;
  }

  cancelarExclusao(): void {
    this.showModal = false;
  }

  deletarEmpresa(): void {
    if (this.empresa?.apelidoId) {
      this.loading = true;
      this.empresasService.removerEmpresa(this.empresa.apelidoId).subscribe({
        next: () => {
          this.showModal = false;
          this.router.navigate(['/empresas']);
        },
        error: (error) => this.lidarComErro(error, 'excluir empresa')
      });
    }
  }

  lidarComErro(error: HttpErrorResponse, endpoint: string) {
    console.error(`Erro ao buscar ${endpoint}:`, error);

    if (error.status === 403) {
      this.sessionService.notificarSessaoExpirada();
    }
  }
}
