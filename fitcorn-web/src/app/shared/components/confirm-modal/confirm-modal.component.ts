import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (modalService.confirmState(); as state) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-charcoal-950/60 backdrop-blur-sm" (click)="modalService.close(false)"></div>

        <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
             class="relative w-full max-w-md p-8 rounded-3xl border space-y-6 overflow-hidden">

          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-corn-300 to-corn-500"></div>

          <div class="space-y-3">
            @if (state.config.title) {
              <h3 class="text-xl font-display font-extrabold text-charcoal-800 dark:text-white">
                {{ state.config.title }}
              </h3>
            }
            <p class="text-sm font-medium text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
              {{ state.config.message }}
            </p>
          </div>

          <div class="flex gap-3 pt-2">
            <button (click)="modalService.close(false)"
                    class="flex-1 px-6 py-3 font-sans font-bold text-xs tracking-widest uppercase rounded-full border border-charcoal-200 dark:border-charcoal-700 text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all duration-300 cursor-pointer">
              {{ state.config.cancelLabel || 'Batal' }}
            </button>
            <button (click)="modalService.close(true)"
                    class="flex-1 px-6 py-3 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
              {{ state.config.confirmLabel || 'Konfirmasi' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [],
})
export class ConfirmModalComponent {
  themeService = inject(ThemeService);
  modalService = inject(ModalService);
}
