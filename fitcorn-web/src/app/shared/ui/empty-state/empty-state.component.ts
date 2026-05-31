import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
      @if (icon()) {
        <div class="text-5xl mb-4">{{ icon() }}</div>
      } @else {
        <div class="w-16 h-16 rounded-full bg-charcoal-100 dark:bg-charcoal-800 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
        </div>
      }
      @if (title()) {
        <h3 class="font-display font-bold text-lg text-charcoal-800 dark:text-white mb-2">{{ title() }}</h3>
      }
      @if (message()) {
        <p class="text-sm text-charcoal-500 dark:text-charcoal-400 max-w-sm">{{ message() }}</p>
      }
      @if (actionLabel()) {
        <button type="button" (click)="onAction()"
          class="mt-6 px-6 py-3 rounded-md bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  icon = input<string>('');
  title = input<string>('');
  message = input<string>('');
  actionLabel = input<string>('');

  protected onAction() {
    // Can emit event if needed
  }
}
