import { Component, input, output, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriceTagComponent } from '../price-tag/price-tag.component';

export interface ProductCardData {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  soldCount?: number;
  stock?: number;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, PriceTagComponent],
  template: `
    <a [routerLink]="['/produk', product().slug]" class="group block rounded-xl border border-charcoal-100 dark:border-charcoal-800 bg-white dark:bg-charcoal-900 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <!-- Image Container -->
      <div class="aspect-square relative overflow-hidden bg-charcoal-50 dark:bg-charcoal-950">
        <img [src]="product().image" [alt]="product().name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy" />
        @if (discountPercent() > 0) {
          <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-corn-400 text-charcoal-900 text-[10px] font-bold uppercase tracking-wider">
            -{{ discountPercent() }}%
          </span>
        }
        @if (product().stock !== undefined && product().stock! <= 0) {
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span class="px-3 py-1.5 rounded-md bg-white dark:bg-charcoal-900 text-xs font-bold uppercase tracking-wider text-charcoal-800 dark:text-white">Habis</span>
          </div>
        }
      </div>

      <!-- Content -->
      <div class="p-4 space-y-2">
        @if (product().category) {
          <p class="text-[10px] font-bold uppercase tracking-widest text-charcoal-400 dark:text-charcoal-500">{{ product().category }}</p>
        }
        <h3 class="font-sans font-bold text-sm text-charcoal-800 dark:text-white leading-tight group-hover:text-corn-600 transition-colors line-clamp-2">
          {{ product().name }}
        </h3>
        <app-price-tag [price]="product().price" [originalPrice]="product().originalPrice ?? null" size="sm" />
        @if (product().rating || product().soldCount) {
          <div class="flex items-center gap-3 text-[11px] text-charcoal-400 dark:text-charcoal-500 font-medium">
            @if (product().rating) {
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-corn-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                {{ product().rating }}
              </span>
            }
            @if (product().soldCount) {
              <span>{{ product().soldCount }} terjual</span>
            }
          </div>
        }
      </div>
    </a>
  `,
})
export class ProductCardComponent {
  product = input.required<ProductCardData>();

  protected discountPercent = computed(() => {
    const p = this.product();
    if (!p.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  });
}
