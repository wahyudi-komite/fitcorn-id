import { Component, signal, HostListener, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-exit-intent-popup',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exit-intent-popup.component.html',
  styleUrls: []
})
export class ExitIntentPopupComponent {
  themeService = inject(ThemeService);
  isVisible = signal(false);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    if (!this.isBrowser) return;

    // Check if popup was already shown in this session
    const wasShown = sessionStorage.getItem('fitcorn_exit_popup_shown');
    
    // Trigger if mouse leaves top viewport boundary (clientY < 20) and not shown yet
    if (event.clientY < 20 && !wasShown) {
      this.isVisible.set(true);
      sessionStorage.setItem('fitcorn_exit_popup_shown', 'true');
    }
  }

  closePopup() {
    this.isVisible.set(false);
  }
}
