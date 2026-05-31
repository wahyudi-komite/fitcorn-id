import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  template: `
    <span [class]="classes()" class="inline-flex items-center gap-1 font-semibold transition-all duration-200"
      [class.cursor-pointer.hover:bg-charcoal-200.dark:hover:bg-charcoal-700]="removable() || clickable()">
      <ng-content/>
      @if (removable()) {
        <button type="button" (click)="onRemove()" class="ml-0.5 hover:text-red-500 transition-colors leading-none text-current" aria-label="Remove">
          &times;
        </button>
      }
    </span>
  `,
})
export class ChipComponent {
  variant = input<'default' | 'primary' | 'success' | 'danger'>('default');
  removable = input(false);
  clickable = input(false);

  protected classes = () => {
    const base = 'inline-flex items-center gap-1 font-semibold transition-all duration-200 rounded-md';
    const size = 'px-3 py-1 text-xs';
    const variant = this.variantMap[this.variant()];
    const interactive = this.clickable() || this.removable() ? 'cursor-pointer' : '';
    return [base, size, variant, interactive].join(' ');
  };

  private variantMap = {
    default: 'bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300',
    primary: 'bg-corn-100 dark:bg-corn-900/30 text-corn-700 dark:text-corn-300',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };

  protected onRemove() {
    // Could emit event here
  }
}
