import { Component, input } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div [class]="classes()" class="fixed bottom-6 right-6 z-50 max-w-sm flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300">
      <span class="text-lg leading-none flex-shrink-0 mt-0.5">{{ iconMap[variant()] }}</span>
      <div class="flex-1 min-w-0">
        @if (title()) {
          <p class="font-bold text-sm mb-0.5">{{ title() }}</p>
        }
        <p class="text-xs opacity-80">{{ message() }}</p>
      </div>
      <button (click)="dismiss()" class="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
  `,
})
export class ToastComponent {
  variant = input<ToastVariant>('info');
  title = input<string>('');
  message = input<string>('');
  visible = input(false);

  protected iconMap: Record<ToastVariant, string> = {
    success: '\u2713',
    error: '\u2717',
    warning: '\u26A0',
    info: '\u24D8',
  };

  protected classes = () => {
    const base = 'fixed bottom-6 right-6 z-50 max-w-sm flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300';
    const variantMap: Record<ToastVariant, string> = {
      success: 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
      error: 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      warning: 'bg-amber-50 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
      info: 'bg-sky-50 dark:bg-sky-900/40 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200',
    };
    const visibility = this.visible() ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none';
    return [base, variantMap[this.variant()], visibility].join(' ');
  };

  protected dismiss() {}
}
