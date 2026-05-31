import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div *ngIf="isVisible()"
         [ngClass]="themeService.theme() === 'dark' 
           ? 'bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 border-b border-charcoal-850 text-white' 
           : 'bg-gradient-to-r from-corn-500 via-corn-400 to-corn-500 text-charcoal-900'"
         class="relative z-50 text-center py-2.5 px-10 text-xs font-sans font-extrabold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 select-none">
      
      <!-- Promo Content Marquee -->
      <div class="overflow-hidden relative w-full max-w-4xl h-5 flex items-center justify-center">
        <span class="animate-pulse flex items-center gap-2">
          <span>{{ activePromoText() }}</span>
        </span>
      </div>

      <!-- Action Toggle Buttons -->
      <button (click)="nextPromo()" 
              class="hidden sm:inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-black/10 transition-colors cursor-pointer text-[10px] leading-none select-none">
        ▶
      </button>

      <!-- Close Button -->
      <app-button variant="ghost" customClass="w-6 h-6 p-0 absolute right-4 top-1/2 -translate-y-1/2" (onClick)="closeBanner()">✕</app-button>
    </div>
  `,
  styles: []
})
export class PromoBannerComponent {
  themeService = inject(ThemeService);
  isVisible = signal<boolean>(true);

  promos = [
    '🍿 FREE SHIPPING on orders above Rp 100,000 inside Java region!',
    '✨ Use coupon FITCORN10 for 10% off your gourmet popcorn checkout!',
    '🚚 Shipping nationwide using JNE, J&T, SiCepat, AnterAja, and POS Indonesia!',
    '🌟 Made with premium organic non-GMO seed and pure coconut oil!'
  ];

  activeIndex = signal<number>(0);

  activePromoText() {
    return this.promos[this.activeIndex()];
  }

  nextPromo() {
    this.activeIndex.update(idx => (idx + 1) % this.promos.length);
  }

  closeBanner() {
    this.isVisible.set(false);
  }
}
