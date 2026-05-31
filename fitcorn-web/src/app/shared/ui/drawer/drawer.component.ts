import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

export type DrawerSide = 'left' | 'right';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [NgClass],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex" [class.justify-end]="side() === 'right'">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="close()"></div>
        <div [class]="panelClasses()" class="relative h-full w-full max-w-sm border-l shadow-xl transition-transform duration-300 overflow-y-auto">
          @if (title()) {
            <div class="flex items-center justify-between p-6 border-b border-charcoal-100 dark:border-charcoal-800">
              <h2 class="font-display font-bold text-lg text-charcoal-800 dark:text-white">{{ title() }}</h2>
              <button type="button" (click)="close()"
                class="p-1.5 rounded-md text-charcoal-400 hover:text-charcoal-600 dark:hover:text-charcoal-200 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-colors cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          }
          <div class="p-6">
            <ng-content/>
          </div>
        </div>
      </div>
    }
  `,
})
export class DrawerComponent {
  open = input(false);
  title = input<string>('');
  side = input<DrawerSide>('right');
  onClose = output<void>();

  protected panelClasses = () => {
    const theme = 'bg-white dark:bg-charcoal-900';
    return theme;
  };

  protected close() {
    this.onClose.emit();
  }
}
