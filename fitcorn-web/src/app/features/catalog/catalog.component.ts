import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { ProductsService } from '../../core/services/products.service';
import { ButtonComponent, ProductCardComponent, ProductCardData, SkeletonComponent, EmptyStateComponent, InputComponent } from '../../shared/ui';
import { GlassmorphismDirective } from '../../shared/directives/glassmorphism.directive';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonComponent,
    ProductCardComponent,
    SkeletonComponent,
    EmptyStateComponent,
    InputComponent,
    GlassmorphismDirective
  ],
  template: `
    <div class="relative overflow-hidden min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(252,211,77,0.2),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.05),_transparent_28%),linear-gradient(180deg,_var(--color-charcoal-50)_0%,_#fffdf6_38%,_white_100%)] text-charcoal-800 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.06),_transparent_24%),linear-gradient(180deg,_var(--color-charcoal-950)_0%,_var(--color-charcoal-900)_100%)] dark:text-white">
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32 font-sans relative z-10">
        
        <!-- Header Section -->
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-5">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-corn-300 bg-corn-50 dark:bg-corn-400/10 text-corn-700 dark:text-corn-400 font-sans font-semibold text-xs tracking-wider uppercase shadow-sm">
            🍿 Koleksi Premium
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-charcoal-800 dark:text-white leading-[0.95] tracking-tight">
            Popcorn premium buatan tangan
          </h1>
          <p class="text-charcoal-500 dark:text-charcoal-350 font-medium max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Camilan yang ditingkatkan menjadi karya seni. Dibuat dalam batch kecil menggunakan biji jagung pilihan non-GMO, bumbu organik bersih, dan rasa berlapis.
          </p>
        </div>

        <!-- Filters, Search & Sort Panel -->
        <div appGlassmorphism class="rounded-[2rem] border p-6 mb-16 shadow-lg flex flex-col gap-6">
          <div class="grid gap-6 md:grid-cols-[1fr_auto]">
            
            <!-- Real-time Search Field -->
            <div class="w-full">
              <app-input
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange()"
                placeholder="Cari rasa popcorn premium favorit Anda..."
                name="searchQuery"
                class="block w-full"
              ></app-input>
            </div>

            <!-- Sort Selector -->
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-xs font-bold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-widest">Urutkan:</span>
              <select (change)="onSortChange($event)"
                      [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-800 bg-charcoal-950 text-white' : 'border-charcoal-200 bg-white text-charcoal-800'"
                      class="px-5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-corn-500 focus:ring-4 focus:ring-corn-400/10 cursor-pointer transition-all duration-200">
                <option value="latest">Terbaru</option>
                <option value="popular">Terpopuler</option>
                <option value="price_asc">Harga: Rendah ➔ Tinggi</option>
                <option value="price_desc">Harga: Tinggi ➔ Rendah</option>
              </select>
            </div>
          </div>

          <div class="h-px bg-charcoal-100 dark:bg-white/5"></div>

          <!-- Category Toggles -->
          <div class="flex flex-wrap gap-2.5">
            @for (cat of categories; track cat.slug) {
              <app-button (onClick)="selectCategory(cat.slug)"
                          [variant]="activeCategory() === cat.slug ? 'primary' : 'outline'"
                          customClass="rounded-full px-5 py-2 text-xs">
                {{ cat.name }}
              </app-button>
            }
          </div>
        </div>

        <!-- Loading Skeleton Grid -->
        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            @for (i of [1, 2, 3, 4]; track i) {
              <app-skeleton variant="card" />
            }
          </div>
        } @else if (error()) {
          <app-empty-state icon="⚠️" title="Gagal memuat katalog" [message]="error() || ''" actionLabel="Coba Lagi" />
        } @else if (products().length === 0) {
          <app-empty-state icon="🍿" title="Rasa tidak ditemukan" message="Kami tidak dapat menemukan produk yang sesuai dengan pencarian Anda. Coba ganti kata kunci atau kategori filter." />
        } @else {
          <!-- Real Product Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            @for (item of products(); track item.id) {
              <app-product-card [product]="mapProduct(item)" />
            }
          </div>
        }

      </div>
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
  searchQuery = signal<string>('');

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

    if (this.searchQuery()) {
      queryParams.search = this.searchQuery();
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

  onSearchChange() {
    this.loadProducts();
  }
}
