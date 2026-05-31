import { Component, input, computed } from '@angular/core';
import { CurrencyIdrPipe } from '../../pipes/currency-idr.pipe';

@Component({
  selector: 'app-price-tag',
  standalone: true,
  imports: [CurrencyIdrPipe],
  template: `
    <div class="flex items-baseline gap-2">
      @if (originalPrice() && originalPrice()! > price()) {
        <span class="text-sm text-charcoal-400 dark:text-charcoal-500 line-through font-medium">{{ originalPrice() | currencyIdr }}</span>
        <span class="text-lg font-display font-extrabold text-corn-500">{{ price() | currencyIdr }}</span>
        @if (showDiscount()) {
          <span class="text-[10px] font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-md">
            -{{ discountPercent() }}%
          </span>
        }
      } @else {
        <span class="text-lg font-display font-extrabold text-corn-500">{{ price() | currencyIdr }}</span>
      }
    </div>
  `,
})
export class PriceTagComponent {
  price = input.required<number>();
  originalPrice = input<number | null>(null);
  size = input<'sm' | 'md' | 'lg'>('md');
  showDiscount = input(true);

  protected discountPercent = computed(() => {
    const orig = this.originalPrice();
    const curr = this.price();
    if (!orig || !curr || orig <= curr) return 0;
    return Math.round(((orig - curr) / orig) * 100);
  });
}
