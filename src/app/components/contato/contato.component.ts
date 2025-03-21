import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Contato {
  nome: string;
  email: string;
  mensagem: string;
}

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent {
  ngOnInit(): void { }
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    
  }
  
  contato: Contato = {
    nome: '',
    email: '',
    mensagem: '',
  }
  
  onSubmit() {
  throw new Error('Method not implemented.');
  }
  
  
}
