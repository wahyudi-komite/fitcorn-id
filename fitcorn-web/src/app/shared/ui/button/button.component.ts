import { Component, computed, input, output, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  loading = input(false);
  disabled = input(false);
  fullWidth = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  route = input<string | any[] | null | undefined>(undefined);
  customClass = input<string>('');
  onClick = output<void>();

  protected classes = computed(() => {
    const base = 'min-h-[var(--control-height-md)] rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)]';
    const size = this.sizeMap[this.size()];
    const variant = this.variantMap[this.variant()];
    const width = this.fullWidth() ? 'w-full' : '';
    const custom = this.customClass();
    return [base, size, variant, width, custom].filter(Boolean).join(' ');
  });

  private sizeMap: Record<ButtonSize, string> = {
    sm: 'min-h-[var(--control-height-sm)] px-4 py-2 text-sm gap-1.5',
    md: 'min-h-[var(--control-height-md)] px-6 py-3 text-sm gap-2',
    lg: 'min-h-[var(--control-height-lg)] px-8 py-4 text-sm gap-2.5',
  };

  private variantMap: Record<ButtonVariant, string> = {
    primary: 'border border-corn-400 bg-corn-400 text-charcoal-900 shadow-lg hover:-translate-y-0.5 hover:bg-corn-500 hover:border-corn-500 hover:shadow-xl active:scale-[0.98]',
    secondary: 'border border-transparent bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] hover:-translate-y-0.5 hover:border-[var(--color-border-default)] hover:bg-[var(--color-surface-base)]',
    outline: 'border border-[var(--color-border-default)] bg-transparent text-[var(--color-text-primary)] hover:-translate-y-0.5 hover:border-corn-400 hover:bg-corn-50 dark:hover:bg-charcoal-800',
    ghost: 'border border-transparent bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]',
    danger: 'border border-red-500 bg-red-500 text-white shadow-lg hover:-translate-y-0.5 hover:bg-red-600 hover:border-red-600',
  };

  protected handleClick() {
    if (this.disabled() || this.loading()) return;
    const r = this.route();
    if (r) {
      this.router.navigate(Array.isArray(r) ? r : [r]);
    }
    this.onClick.emit();
  }
}
