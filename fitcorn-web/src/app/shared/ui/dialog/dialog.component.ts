import { Component, input, output, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';

export type DialogSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="handleBackdropClick()"></div>
        <div [ngClass]="panelClasses" class="relative w-full border shadow-xl transition-all duration-200">
          @if (title() || closable()) {
            <div class="flex items-start justify-between mb-4">
              @if (title()) {
                <h2 class="font-display font-bold text-lg text-charcoal-800 dark:text-white">{{ title() }}</h2>
              }
              @if (closable()) {
                <button type="button" (click)="handleClose()"
                  class="p-1.5 -mr-1.5 rounded-md text-charcoal-400 hover:text-charcoal-600 dark:hover:text-charcoal-200 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-colors cursor-pointer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              }
            </div>
          }
          <ng-content/>
        </div>
      </div>
    }
  `,
})
export class DialogComponent {
  open = input(false);
  title = input<string>('');
  size = input<DialogSize>('md');
  closable = input(true);
  backdropClose = input(true);
  onClose = output<void>();

  get panelClasses(): string {
    const sizeMap: Record<DialogSize, string> = {
      sm: 'max-w-sm p-5',
      md: 'max-w-md p-6',
      lg: 'max-w-lg p-8',
    };
    return `relative w-full border shadow-xl transition-all duration-200 rounded-xl space-y-4 bg-white dark:bg-charcoal-900 border-charcoal-100 dark:border-charcoal-800 ${sizeMap[this.size()]}`;
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.open() && this.closable()) {
      this.handleClose();
    }
  }

  handleClose() {
    this.onClose.emit();
  }

  handleBackdropClick() {
    if (this.backdropClose()) {
      this.handleClose();
    }
  }
}
