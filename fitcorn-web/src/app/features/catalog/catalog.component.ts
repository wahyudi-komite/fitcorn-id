import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
            <button (click)="selectCategory(cat.slug)"
                    [ngClass]="activeCategory() === cat.slug 
                      ? 'bg-corn-400 text-charcoal-900 shadow-md font-bold' 
                      : (themeService.theme() === 'dark' 
                        ? 'glassmorphism-dark text-charcoal-300 hover:text-white border-charcoal-800' 
                        : 'glassmorphism-light text-charcoal-600 hover:text-charcoal-900 border-charcoal-200')"
                    class="px-5 py-2.5 rounded-full border text-xs uppercase tracking-wider font-sans transition-all duration-300 cursor-pointer">
              {{ cat.name }}
            </button>
          }
        </div>

        <!-- Sort Select -->
        <div class="flex items-center gap-3 w-full md:w-auto justify-end">
          <span class="text-xs font-semibold text-charcoal-400 uppercase tracking-widest">Urutkan:</span>
          <select (change)="onSortChange($event)"
                  [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark border-charcoal-800 text-white' : 'glassmorphism-light border-charcoal-200 text-charcoal-800'"
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
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-pulse">
          @for (i of [1, 2, 3]; track i) {
            <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark border-charcoal-800' : 'glassmorphism-light border-charcoal-200'"
                 class="rounded-3xl p-6 border h-[420px] flex flex-col justify-between">
              <div class="space-y-6">
                <div class="aspect-square rounded-2xl bg-charcoal-200 dark:bg-charcoal-800 w-full"></div>
                <div class="h-6 bg-charcoal-200 dark:bg-charcoal-800 rounded w-2/3"></div>
                <div class="h-4 bg-charcoal-200 dark:bg-charcoal-800 rounded w-1/2"></div>
              </div>
              <div class="flex justify-between items-center mt-6">
                <div class="h-6 bg-charcoal-200 dark:bg-charcoal-800 rounded w-1/3"></div>
                <div class="h-10 bg-charcoal-200 dark:bg-charcoal-800 rounded-full w-24"></div>
              </div>
            </div>
          }
        </div>
      } @else if (error()) {
        <!-- Error State -->
        <div class="text-center py-16">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 text-red-500 text-2xl mb-4">
            ⚠️
          </div>
          <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white mb-2">Gagal memuat katalog</h3>
          <p class="text-charcoal-500 dark:text-charcoal-400 font-medium mb-6">{{ error() }}</p>
          <button (click)="loadProducts()" class="px-6 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-300">
            Coba Lagi
          </button>
        </div>
      } @else if (products().length === 0) {
        <!-- Empty State -->
        <div class="text-center py-16">
          <div class="text-6xl mb-6">🍿</div>
          <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white mb-2">Rasa tidak ditemukan</h3>
          <p class="text-charcoal-500 dark:text-charcoal-400 font-medium max-w-sm mx-auto">
            Kami tidak dapat menemukan produk dalam kategori ini. Coba sesuaikan filter Anda.
          </p>
        </div>
      } @else {
        <!-- Real Product Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          @for (item of products(); track item.id) {
            <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark border-charcoal-800 hover:border-corn-500/50' : 'glassmorphism-light border-charcoal-200 hover:border-corn-400/50'"
                 class="rounded-3xl p-6 border transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between shadow-premium hover:shadow-2xl">
              
              <div>
                <!-- Image Wrapper -->
                <div class="aspect-square rounded-2xl bg-charcoal-100 dark:bg-charcoal-900 overflow-hidden flex items-center justify-center mb-6 relative group">
                  @if (item.images && item.images.length > 0) {
                    <img [src]="item.images[0].url" [alt]="item.images[0].altText || item.name" 
                         class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  } @else {
                    <span class="text-6xl">🍿</span>
                  }
                  
                  @if (item.isFeatured) {
                    <span class="absolute top-4 left-4 px-3 py-1 rounded-full bg-corn-400 text-charcoal-900 text-[10px] font-sans font-bold uppercase tracking-wider">
                      Unggulan
                    </span>
                  }
                </div>

                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="text-[10px] font-bold text-corn-500 uppercase tracking-widest">
                    {{ item.categories?.[0]?.name || 'Rasa Klasik' }}
                  </span>
                  <span class="text-[10px] font-semibold text-charcoal-400">
                    {{ item.weight }} gram
                  </span>
                </div>

                <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white mb-2 hover:text-corn-500 transition-colors">
                  <a [routerLink]="['/produk', item.slug]">{{ item.name }}</a>
                </h3>

                <p class="text-sm text-charcoal-500 dark:text-charcoal-400 mb-6 font-medium line-clamp-2 leading-relaxed">
                  {{ item.shortDescription || item.description }}
                </p>
              </div>
              
              <div class="flex items-center justify-between mt-auto pt-4 border-t border-charcoal-100 dark:border-charcoal-900">
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-charcoal-400 uppercase tracking-wider">Harga</span>
                  <span class="text-lg font-display font-extrabold text-corn-500">
                    Rp {{ item.price.toLocaleString('id-ID') }}
                  </span>
                </div>
                <a [routerLink]="['/produk', item.slug]" 
                   class="px-5 py-3 font-sans font-bold text-xs uppercase tracking-widest rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                  Lihat Detail
                </a>
              </div>

            </div>
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
