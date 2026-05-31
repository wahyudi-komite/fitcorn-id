import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (modalService.confirmState(); as state) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-charcoal-950/60 backdrop-blur-sm" (click)="modalService.close(false)"></div>

        <div appGlassmorphism
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
            <app-button variant="outline" (onClick)="modalService.close(false)">{{ state.config.cancelLabel || 'Batal' }}</app-button>
            <app-button (onClick)="modalService.close(true)">{{ state.config.confirmLabel || 'Konfirmasi' }}</app-button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [],
})
export class ConfirmModalComponent {
  modalService = inject(ModalService);
}
