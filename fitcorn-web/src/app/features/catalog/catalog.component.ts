import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { ProductsService } from '../../core/services/products.service';
import { ButtonComponent, ProductCardComponent, ProductCardData, SkeletonComponent, EmptyStateComponent } from '../../shared/ui';
import { GlassmorphismDirective } from '../../shared/directives/glassmorphism.directive';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, ProductCardComponent, SkeletonComponent, EmptyStateComponent, GlassmorphismDirective],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32 font-sans transition-colors duration-300">
      
      <!-- Header Section -->
      <div class="text-center max-w-xl mx-auto mb-16 space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-corn-300 bg-corn-50 dark:bg-corn-400/10 text-corn-700 dark:text-corn-400 font-sans font-semibold text-xs tracking-wider uppercase">
          🍿 Koleksi Premium
        </div>
        <h1 class="text-4xl sm:text-5xl font-display font-extrabold text-charcoal-800 dark:text-white leading-tight">
          Popcorn Premium Buatan Tangan
        </h1>
        <p class="text-charcoal-500 dark:text-charcoal-400 font-medium">
          Camilan yang ditingkatkan menjadi karya seni. Dibuat dalam batch kecil menggunakan jagung non-GMO, bumbu organik bersih, dan gula alami.
        </p>
      </div>

      <!-- Filters & Sort Actions -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-charcoal-200 dark:border-charcoal-800 pb-8">
        
        <!-- Category Toggles -->
        <div class="flex flex-wrap gap-3 w-full md:w-auto">
          @for (cat of categories; track cat.slug) {
            <app-button (onClick)="selectCategory(cat.slug)"
                        variant="outline"
                        [ngClass]="activeCategory() === cat.slug 
                          ? 'bg-corn-400 text-charcoal-900 shadow-md font-bold' 
                          : (themeService.theme() === 'dark' 
                            ? 'text-charcoal-300 hover:text-white' 
                            : 'text-charcoal-600 hover:text-charcoal-900')"
                        appGlassmorphism [appGlassmorphismShadow]="false"
                        class="px-5 py-2.5 text-xs">
              {{ cat.name }}
            </app-button>
          }
        </div>

        <!-- Sort Select -->
        <div class="flex items-center gap-3 w-full md:w-auto justify-end">
          <span class="text-xs font-semibold text-charcoal-400 uppercase tracking-widest">Urutkan:</span>
          <select (change)="onSortChange($event)"
                  [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-800 text-white' : 'border-charcoal-200 text-charcoal-800'"
                  appGlassmorphism [appGlassmorphismShadow]="false"
                  class="px-4 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-corn-400 cursor-pointer">
            <option value="latest">Terbaru</option>
            <option value="popular">Terpopuler</option>
            <option value="price_asc">Harga: Rendah ke Tinggi</option>
            <option value="price_desc">Harga: Tinggi ke Rendah</option>
          </select>
        </div>

      </div>

      <!-- Loading Skeleton Grid -->
      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          @for (i of [1, 2, 3]; track i) {
            <app-skeleton variant="card" />
          }
        </div>
      } @else if (error()) {
        <app-empty-state icon="⚠️" title="Gagal memuat katalog" [message]="error() || ''" actionLabel="Coba Lagi" />
      } @else if (products().length === 0) {
        <app-empty-state icon="🍿" title="Rasa tidak ditemukan" message="Kami tidak dapat menemukan produk dalam kategori ini. Coba sesuaikan filter Anda." />
      } @else {
        <!-- Real Product Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          @for (item of products(); track item.id) {
            <app-product-card [product]="mapProduct(item)" />
          }
        </div>
      }

    </div>
  `,
  styles: []
})
export class CatalogComponent implements OnInit {
  themeService = inject(ThemeService);
  private productsService = inject(ProductsService);

  products = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  activeCategory = signal<string>('all');
  activeSort = signal<'price_asc' | 'price_desc' | 'popular' | 'latest'>('latest');

  categories = [
    { slug: 'all', name: 'Semua Rasa' },
    { slug: 'sweet-creamy', name: 'Manis & Lembut' },
    { slug: 'salty-savory', name: 'Asin & Gurih' },
    { slug: 'spicy-lava', name: 'Pedas' }
  ];

  ngOnInit() {
    this.loadProducts();
  }

  protected mapProduct(p: any): ProductCardData {
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      image: p.images?.[0]?.url || '/assets/popcorn.png',
      category: p.categories?.[0]?.name,
      rating: p.rating,
      soldCount: p.soldCount,
      stock: p.stock,
    };
  }

  loadProducts() {
    this.loading.set(true);
    this.error.set(null);

    const queryParams: any = {
      sortBy: this.activeSort()
    };

    if (this.activeCategory() !== 'all') {
      queryParams.category = this.activeCategory();
    }

    this.productsService.getProducts(queryParams).subscribe({
      next: (res) => {
        this.products.set(res.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.error.set('Tidak dapat mengambil rasa dari server. Periksa koneksi Anda.');
        this.loading.set(false);
      }
    });
  }

  selectCategory(categorySlug: string) {
    if (this.activeCategory() === categorySlug) return;
    this.activeCategory.set(categorySlug);
    this.loadProducts();
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as any;
    this.activeSort.set(value);
    this.loadProducts();
  }
}
