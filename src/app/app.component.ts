import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/global/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/global/components/header/header.component';
import { SessionExpiredModalComponent } from "./components/global/components/session-expired-modal/session-expired-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterOutlet, HeaderComponent, FooterComponent, SessionExpiredModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'contabills-front';
}
