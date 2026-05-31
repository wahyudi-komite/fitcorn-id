import { Component, input } from '@angular/core';
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

  protected classes = () => {
    const base = 'rounded-xl border';
    const padding = this.paddingMap[this.padding()];
    const variant = this.variantMap[this.variant()];
    const interactive = this.clickable() ? 'hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99]' : '';
    return [base, padding, variant, interactive].filter(Boolean).join(' ');
  };

  private paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-8',
  };

  private variantMap = {
    default: 'bg-white dark:bg-charcoal-900 border-charcoal-100 dark:border-charcoal-800 shadow-sm',
    glass: 'glassmorphism-light dark:glassmorphism-dark',
    interactive: 'bg-white dark:bg-charcoal-900 border-charcoal-100 dark:border-charcoal-800 shadow-sm hover:shadow-md',
    bordered: 'bg-transparent border-charcoal-200 dark:border-charcoal-700',
  };

  protected onCardClick() {
    if (this.clickable()) {
      // emit event or handle via host
    }
  }
}
