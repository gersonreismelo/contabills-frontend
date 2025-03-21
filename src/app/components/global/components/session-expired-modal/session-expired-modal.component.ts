import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SessionService } from '../../service/session.service';

@Component({
  selector: 'app-session-expired-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-expired-modal.component.html',
  styleUrl: './session-expired-modal.component.scss'
})
export class SessionExpiredModalComponent {
  showModal: boolean = false;

  constructor(private sessionService: SessionService) {
    this.sessionService.sessionExpired$.subscribe(expired => {
      this.showModal = expired;
    });
  }

  fecharERedirecionar() {
    this.sessionService.redirecionarParaLogin();
  }
}
