import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private router: Router) { }

  navegarParaHome() {
    this.router.navigate(['/home']);
  }

  navegarParaSobre() {
    this.router.navigate(['/sobre']);
  }

  navegarParaContato() {
    this.router.navigate(['/contato']);
  }
}
