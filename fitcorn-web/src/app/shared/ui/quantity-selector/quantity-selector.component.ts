import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  template: `
    <div class="inline-flex items-center border border-charcoal-200 dark:border-charcoal-700 rounded-md overflow-hidden">
      <button type="button" (click)="decrement()" [disabled]="quantity() <= min()"
        class="px-3 py-2 text-charcoal-500 dark:text-charcoal-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer text-sm font-bold">
        &minus;
      </button>
      <span class="px-4 py-2 text-sm font-bold text-charcoal-800 dark:text-white min-w-[3rem] text-center select-none border-x border-charcoal-200 dark:border-charcoal-700">
        {{ quantity() }}
      </span>
      <button type="button" (click)="increment()" [disabled]="quantity() >= max()"
        class="px-3 py-2 text-charcoal-500 dark:text-charcoal-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer text-sm font-bold">
        +
      </button>
    </div>
  `,
})
export class QuantitySelectorComponent {
  quantity = input(1);
  min = input(1);
  max = input(99);
  onChange = output<number>();

  protected increment() {
    const next = Math.min(this.quantity() + 1, this.max());
    this.onChange.emit(next);
  }

  protected decrement() {
    const next = Math.max(this.quantity() - 1, this.min());
    this.onChange.emit(next);
  }
}
