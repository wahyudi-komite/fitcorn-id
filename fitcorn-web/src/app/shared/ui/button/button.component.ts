import { Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button [disabled]="disabled() || loading()" [type]="type()" [ngClass]="classes()" (click)="handleClick()"
      class="inline-flex items-center justify-center font-sans font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50">
      @if (loading()) {
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      }
      <ng-content/>
    </button>
  `,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  loading = input(false);
  disabled = input(false);
  fullWidth = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  onClick = output<void>();

  protected classes = computed(() => {
    const base = 'rounded-md';
    const size = this.sizeMap[this.size()];
    const variant = this.variantMap[this.variant()];
    const width = this.fullWidth() ? 'w-full' : '';
    return [base, size, variant, width].filter(Boolean).join(' ');
  });

  private sizeMap: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-[10px] gap-1.5',
    md: 'px-6 py-3 text-xs gap-2',
    lg: 'px-8 py-4 text-xs gap-2',
  };

  private variantMap: Record<ButtonVariant, string> = {
    primary: 'bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-lg hover:shadow-xl active:scale-[0.98]',
    secondary: 'bg-charcoal-100 dark:bg-charcoal-800 hover:bg-charcoal-200 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-charcoal-200',
    outline: 'border border-charcoal-200 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800',
    ghost: 'text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-charcoal-100 dark:hover:bg-charcoal-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg',
  };

  private handleClick() {
    if (!this.disabled() && !this.loading()) {
      this.onClick.emit();
    }
  }
}
