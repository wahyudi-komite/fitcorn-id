import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { FloatingButtonsComponent } from './shared/components/floating-buttons/floating-buttons.component';
import { ExitIntentPopupComponent } from './shared/components/exit-intent-popup/exit-intent-popup.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    FloatingButtonsComponent,
    ExitIntentPopupComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  themeService = inject(ThemeService);
}
