import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32 font-sans transition-colors duration-300">
      
      <!-- Back Link -->
      <div class="mb-8">
        <a routerLink="/produk" class="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-400 hover:text-corn-500 transition-colors">
          ← Kembali ke Katalog
        </a>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start animate-pulse">
          <div class="aspect-square rounded-3xl bg-charcoal-200 dark:bg-charcoal-800"></div>
          <div class="space-y-6">
            <div class="h-6 bg-charcoal-200 dark:bg-charcoal-800 rounded w-1/4"></div>
            <div class="h-10 bg-charcoal-200 dark:bg-charcoal-800 rounded w-3/4"></div>
            <div class="h-6 bg-charcoal-200 dark:bg-charcoal-800 rounded w-1/3"></div>
            <div class="h-32 bg-charcoal-200 dark:bg-charcoal-800 rounded"></div>
            <div class="h-12 bg-charcoal-200 dark:bg-charcoal-800 rounded-full w-full"></div>
          </div>
        </div>
      } @else if (error()) {
        <!-- Error State -->
        <div class="text-center py-16">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 text-red-500 text-2xl mb-4">
            ⚠️
          </div>
          <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white mb-2">Produk Tidak Ditemukan</h3>
          <p class="text-charcoal-500 dark:text-charcoal-400 font-medium mb-6">{{ error() }}</p>
          <a routerLink="/produk" class="px-6 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300">
            Kembali ke Katalog
          </a>
        </div>
      } @else if (product()) {
        <!-- Content State -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <!-- Image Showcase -->
          <div class="relative group">
            <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                 class="aspect-square rounded-3xl overflow-hidden flex items-center justify-center border shadow-premium">
              @if (product().images && product().images.length > 0) {
                <img [src]="product().images[0].url" [alt]="product().images[0].altText || product().name" 
                     class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" />
              } @else {
                <span class="text-9xl">🍿</span>
              }
            </div>
            
            @if (product().isFeatured) {
              <span class="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-corn-400 text-charcoal-900 text-xs font-sans font-bold uppercase tracking-wider shadow-md">
                Terlaris
              </span>
            }
          </div>
 
          <!-- Product Details -->
          <div class="space-y-8">
            
            <!-- Metadata & Titles -->
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-corn-500 uppercase tracking-widest">
                   {{ product().categories?.[0]?.name || 'Popcorn Premium' }}
                </span>
                <span class="text-xs text-charcoal-300 font-semibold">•</span>
                <span class="text-xs font-bold text-charcoal-400 uppercase tracking-widest">
                  SKU: {{ selectedVariant()?.sku || product().sku }}
                </span>
              </div>
              <h1 class="text-4xl sm:text-5xl font-display font-extrabold text-charcoal-800 dark:text-white leading-tight">
                {{ product().name }}
              </h1>
              <p class="text-3xl font-display font-extrabold text-corn-500">
                Rp {{ (selectedVariant()?.price || product().price).toLocaleString('id-ID') }}
              </p>
            </div>
 
            <!-- Description -->
            <div class="space-y-4">
              <h4 class="text-xs font-semibold text-charcoal-400 uppercase tracking-widest">Resep</h4>
              <p class="text-base text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium">
                {{ product().description }}
              </p>
            </div>
 
            <!-- Variant Selection -->
            @if (product().variants && product().variants.length > 0) {
              <div class="space-y-4">
                <h4 class="text-xs font-semibold text-charcoal-400 uppercase tracking-widest">Pilih Ukuran Kemasan</h4>
                <div class="grid grid-cols-2 gap-4">
                  @for (v of product().variants; track v.id) {
                    <button (click)="selectVariant(v)"
                            [ngClass]="selectedVariant()?.id === v.id
                              ? 'border-corn-400 bg-corn-400/5 text-charcoal-800 dark:text-white font-bold'
                              : (themeService.theme() === 'dark' ? 'border-charcoal-850 hover:border-charcoal-700 text-charcoal-300' : 'border-charcoal-200 hover:border-charcoal-350 text-charcoal-600')"
                            class="px-5 py-4 rounded-2xl border text-left text-sm transition-all duration-300 cursor-pointer flex flex-col justify-between h-20">
                      <span class="block truncate font-semibold">{{ v.name }}</span>
                      <span class="text-corn-500 font-extrabold mt-1">Rp {{ v.price.toLocaleString('id-ID') }}</span>
                    </button>
                  }
                </div>
              </div>
            }
 
            <!-- Add to Cart Action -->
            <div class="border-t border-charcoal-200 dark:border-charcoal-800 pt-8 space-y-4">
              <div class="flex items-center gap-6">
                
                <!-- Quantity Selector -->
                <div class="flex items-center border border-charcoal-200 dark:border-charcoal-800 rounded-md overflow-hidden bg-transparent">
                  <button (click)="decrementQty()" 
                          class="px-5 py-3 hover:bg-charcoal-100 dark:hover:bg-charcoal-900 text-charcoal-500 dark:text-charcoal-400 font-bold transition-colors cursor-pointer select-none">
                    -
                  </button>
                  <span class="px-5 py-3 font-semibold text-charcoal-800 dark:text-white w-12 text-center select-none">
                    {{ quantity() }}
                  </span>
                  <button (click)="incrementQty()" 
                          class="px-5 py-3 hover:bg-charcoal-100 dark:hover:bg-charcoal-900 text-charcoal-500 dark:text-charcoal-400 font-bold transition-colors cursor-pointer select-none">
                    +
                  </button>
                </div>
 
                <!-- Add Button -->
                <button (click)="addToCart()"
                        [disabled]="addingToCart()"
                        class="flex-1 px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 disabled:bg-corn-400/50 disabled:cursor-not-allowed text-charcoal-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2">
                  @if (addingToCart()) {
                    <span class="animate-spin text-sm">⌛</span> Menambahkan...
                  } @else {
                    <span>🛒</span> Tambah ke Keranjang
                  }
                </button>
              </div>
 
              <!-- Cart Feedback Msg -->
              @if (feedbackMsg()) {
                <div class="p-3.5 rounded-2xl text-xs font-semibold text-center border bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 animate-pulse-gentle">
                  {{ feedbackMsg() }}
                </div>
              }
            </div>
 
            <!-- Product details specifications grid -->
            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-charcoal-200 dark:border-charcoal-800">
              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'" class="p-4 rounded-2xl border">
                <span class="text-[10px] text-charcoal-400 font-semibold block mb-1 uppercase tracking-widest">Berat Bersih</span>
                <span class="font-bold text-charcoal-800 dark:text-white">
                  {{ selectedVariant()?.weight || product().weight }} gram
                </span>
              </div>
              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'" class="p-4 rounded-2xl border">
                <span class="text-[10px] text-charcoal-400 font-semibold block mb-1 uppercase tracking-widest">Masa Simpan</span>
                <span class="font-bold text-charcoal-800 dark:text-white">6 Bulan</span>
              </div>
            </div>
 
          </div>
        </div>
 
        <!-- Related Products Showcase -->
        @if (relatedProducts().length > 0) {
          <div class="mt-24 border-t border-charcoal-200 dark:border-charcoal-800 pt-16 space-y-8">
            <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">
              Rasa Terkait yang Anda Suka
            </h3>
 
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              @for (item of relatedProducts(); track item.id) {
                <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark border-charcoal-800' : 'glassmorphism-light border-charcoal-200'"
                     class="rounded-3xl p-5 border flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
                  <div>
                    <div class="aspect-square rounded-2xl bg-charcoal-100 dark:bg-charcoal-900 overflow-hidden flex items-center justify-center mb-4 relative">
                      @if (item.images && item.images.length > 0) {
                        <img [src]="item.images[0].url" [alt]="item.images[0].altText || item.name" class="w-full h-full object-cover" />
                      } @else {
                        <span class="text-4xl">🍿</span>
                      }
                    </div>
                    <h4 class="font-display font-extrabold text-base text-charcoal-800 dark:text-white line-clamp-1">
                      <a [routerLink]="['/produk', item.slug]" (click)="onRelatedClick(item.slug)">{{ item.name }}</a>
                    </h4>
                    <p class="text-xs text-corn-500 font-bold mt-1">
                      Rp {{ item.price.toLocaleString('id-ID') }}
                    </p>
                  </div>
                  <a [routerLink]="['/produk', item.slug]" (click)="onRelatedClick(item.slug)"
                     class="mt-4 text-center py-2 text-xs font-bold bg-charcoal-100 dark:bg-charcoal-900 text-charcoal-700 dark:text-charcoal-300 rounded-full hover:bg-corn-400 hover:text-charcoal-900 transition-colors">
                    Lihat detail
                  </a>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: []
})
export class ProductDetailComponent implements OnInit {
  themeService = inject(ThemeService);
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private analyticsService = inject(AnalyticsService);
 
  product = signal<any | null>(null);
  relatedProducts = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
 
  selectedVariant = signal<any | null>(null);
  quantity = signal<number>(1);
  addingToCart = signal<boolean>(false);
  feedbackMsg = signal<string>('');
 
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProductDetails(slug);
      }
    });
  }
 
  loadProductDetails(slug: string) {
    this.loading.set(true);
    this.error.set(null);
    this.quantity.set(1);
 
    this.productsService.getProductBySlug(slug).subscribe({
      next: (prod) => {
        this.product.set(prod);
        if (prod.variants && prod.variants.length > 0) {
          this.selectedVariant.set(prod.variants[0]);
        } else {
          this.selectedVariant.set(null);
        }
        this.loading.set(false);
        this.loadRelatedProducts(slug);
      },
      error: (err) => {
        console.error('Failed to load product details', err);
        this.error.set('Detail rasa tidak ditemukan atau gagal dimuat.');
        this.loading.set(false);
      }
    });
  }
 
  loadRelatedProducts(slug: string) {
    this.productsService.getRelatedProducts(slug).subscribe({
      next: (list) => this.relatedProducts.set(list || []),
      error: () => this.relatedProducts.set([])
    });
  }
 
  onRelatedClick(slug: string) {
    this.loadProductDetails(slug);
  }
 
  selectVariant(v: any) {
    this.selectedVariant.set(v);
  }
 
  incrementQty() {
    this.quantity.update(q => q + 1);
  }
 
  decrementQty() {
    this.quantity.update(q => q > 1 ? q - 1 : 1);
  }
 
  addToCart() {
    const prod = this.product();
    if (!prod) return;
 
    this.addingToCart.set(true);
    this.feedbackMsg.set('');
 
    const variantId = this.selectedVariant()?.id;
 
    this.cartService.addItem(prod.id, this.quantity(), variantId).subscribe({
      next: () => {
        this.addingToCart.set(false);
        this.feedbackMsg.set(`Berhasil menambahkan ${this.quantity()} bungkus ke keranjang Anda!`);
        
        // Track GA4/FB Pixel/TikTok AddToCart event
        this.analyticsService.trackAddToCart(prod, this.quantity());

        // Clear message after 3 seconds
        setTimeout(() => {
          this.feedbackMsg.set('');
        }, 3000);
      },
      error: (err) => {
        console.error('Failed to add to cart', err);
        this.addingToCart.set(false);
        this.feedbackMsg.set('Gagal menambahkan. Silakan coba lagi.');
      }
    });
  }
}
