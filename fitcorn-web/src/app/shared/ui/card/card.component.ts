import { Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

export type CardVariant = 'default' | 'glass' | 'interactive' | 'bordered';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass],
  template: `
    <div [ngClass]="classes()" [class.cursor-pointer]="clickable()" (click)="onCardClick()" class="transition-all duration-200">
      @if (title() || subtitle()) {
        <div class="mb-4">
          @if (title()) {
            <h3 class="font-display font-bold text-lg text-charcoal-800 dark:text-white">{{ title() }}</h3>
          }
          @if (subtitle()) {
            <p class="text-sm text-charcoal-500 dark:text-charcoal-400 mt-0.5">{{ subtitle() }}</p>
          }
        </div>
      }
      <ng-content/>
    </div>
  `,
})
export class CardComponent {
  variant = input<CardVariant>('default');
  padding = input<CardPadding>('md');
  clickable = input(false);
  title = input<string>('');
  subtitle = input<string>('');
  onClick = output<void>();

  protected classes = computed(() => {
    const base = 'ds-card';
    const padding = this.paddingMap[this.padding()];
    const variant = this.variantMap[this.variant()];
    const interactive = this.clickable() ? 'hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)]' : '';
    return [base, padding, variant, interactive].filter(Boolean).join(' ');
  });

  private paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-8',
  };

  private variantMap = {
    default: 'bg-[var(--color-surface-elevated)] border-[var(--color-border-muted)] shadow-sm',
    glass: 'glassmorphism-light dark:glassmorphism-dark',
    interactive: 'bg-[var(--color-surface-elevated)] border-[var(--color-border-muted)] shadow-sm hover:shadow-md',
    bordered: 'bg-transparent border-[var(--color-border-default)] shadow-none',
  };

  protected onCardClick() {
    if (this.clickable()) {
      this.onClick.emit();
    }
  }
}
