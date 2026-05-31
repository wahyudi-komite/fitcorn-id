import { Component, input } from '@angular/core';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium';
export type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [class]="classes()" class="inline-flex items-center font-bold uppercase tracking-wider">
      @if (dot()) {
        <span [class]="dotClasses()" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
      }
      <ng-content/>
    </span>
  `,
})
export class BadgeComponent {
  variant = input<BadgeVariant>('default');
  size = input<BadgeSize>('sm');
  dot = input(false);

  protected classes = () => {
    const base = 'inline-flex items-center font-bold uppercase tracking-wider rounded-md';
    const size = this.size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
    const variant = this.variantMap[this.variant()];
    return [base, size, variant].join(' ');
  };

  protected dotClasses = () => {
    return this.variant === 'success' ? 'bg-emerald-500' :
      this.variant === 'warning' ? 'bg-amber-500' :
      this.variant === 'danger' ? 'bg-red-500' :
      this.variant === 'info' ? 'bg-blue-500' :
      this.variant === 'premium' ? 'bg-corn-500' : 'bg-charcoal-400';
  };

  private variantMap = {
    default: 'bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    premium: 'bg-corn-100 dark:bg-corn-900/30 text-corn-700 dark:text-corn-300',
  };
}
