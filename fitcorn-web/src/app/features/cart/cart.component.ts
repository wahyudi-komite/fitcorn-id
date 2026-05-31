import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ModalService } from '../../shared/services/modal.service';
import { ThemeService } from '../../core/services/theme.service';
import { ButtonComponent } from '../../shared/ui';
import { GlassmorphismDirective } from '../../shared/directives/glassmorphism.directive';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, GlassmorphismDirective],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32 font-sans transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-12">
          <h1 class="text-4xl font-display font-extrabold text-charcoal-800 dark:text-white">
            Keranjang Belanja
          </h1>
          @if (cartService.cart()?.items?.length > 0) {
            <app-button (onClick)="clearCart()" 
                        [disabled]="actionLoading()"
                        variant="danger" size="sm">
              Kosongkan Semua Item
            </app-button>
          }
        </div>

        @if (cartService.itemsCount() === 0) {
          <!-- Empty Cart State -->
          <div appGlassmorphism [appGlassmorphismShadow]="false"
               class="rounded-3xl border p-16 text-center space-y-6 shadow-premium">
            <div class="text-7xl">🍿</div>
            <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Keranjang Anda kosong</h3>
            <p class="text-charcoal-500 dark:text-charcoal-400 font-medium max-w-sm mx-auto">
              Sepertinya Anda belum menambahkan rasa popcorn premium favorit ke keranjang. Ayo cari beberapa!
            </p>
            <a routerLink="/produk" 
               class="inline-block px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              Jelajaji Rasa
            </a>
          </div>
        } @else {
          <!-- Cart Items Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            <!-- Items Column -->
            <div class="lg:col-span-2 space-y-6 animate-pulse-gentle-disabled">
              @for (item of cartService.cart()?.items; track item.id) {
                <div [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850' : 'border-charcoal-200'"
             appGlassmorphism [appGlassmorphismShadow]="false"
                     class="p-6 rounded-3xl border flex flex-col sm:flex-row items-center gap-6 shadow-premium hover:shadow-md transition-all duration-300 relative group">
                  
                  <!-- Delete Button Top Right -->
                  <app-button (onClick)="removeItem(item.id)" 
                              [disabled]="actionLoading()"
                              variant="ghost" size="sm"
                              class="absolute top-4 right-4 p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </app-button>

                  <!-- Image -->
                  <div class="w-24 h-24 sm:w-20 sm:h-20 rounded-2xl bg-charcoal-100 dark:bg-charcoal-900 flex items-center justify-center text-4xl overflow-hidden shrink-0">
                    @if (item.product?.images?.[0]?.url) {
                      <img [src]="item.product.images[0].url" [alt]="item.product.name" class="w-full h-full object-cover" />
                    } @else {
                      🍿
                    }
                  </div>

                  <!-- Details -->
                  <div class="flex-1 w-full text-center sm:text-left space-y-3 sm:space-y-0">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 class="font-display font-extrabold text-lg text-charcoal-800 dark:text-white hover:text-corn-500 transition-colors">
                          <a [routerLink]="['/produk', item.product?.slug]">{{ item.product?.name }}</a>
                        </h3>
                        <span class="inline-block text-[10px] font-bold text-corn-500 uppercase tracking-wider mt-0.5">
                          {{ item.variant ? item.variant.name : 'Single Pack (150g)' }}
                        </span>
                      </div>
                      
                      <!-- Price calculation -->
                      <div class="text-right sm:pr-8">
                        <span class="font-display font-extrabold text-charcoal-800 dark:text-white text-base">
                          Rp {{ ((item.variant ? item.variant.price : item.product?.price) * item.quantity).toLocaleString('id-ID') }}
                        </span>
                        <span class="block text-[10px] font-semibold text-charcoal-400 mt-0.5">
                          Rp {{ (item.variant ? item.variant.price : item.product?.price).toLocaleString('id-ID') }} /item
                        </span>
                      </div>
                    </div>

                    <!-- Quantity Control -->
                    <div class="flex items-center justify-center sm:justify-start gap-4 mt-4 pt-4 border-t border-charcoal-100 dark:border-charcoal-900/50">
                      <div class="flex items-center border border-charcoal-200 dark:border-charcoal-800 rounded-md overflow-hidden shrink-0 bg-transparent">
                        <app-button (onClick)="updateQuantity(item.id, item.quantity - 1)" 
                                    [disabled]="actionLoading() || item.quantity <= 1"
                                    variant="ghost" size="sm">
                          -
                        </app-button>
                        <span class="px-3 py-1.5 font-semibold text-charcoal-800 dark:text-white w-10 text-center select-none text-xs">
                          {{ item.quantity }}
                        </span>
                        <app-button (onClick)="updateQuantity(item.id, item.quantity + 1)" 
                                    [disabled]="actionLoading()"
                                    variant="ghost" size="sm">
                          +
                        </app-button>
                      </div>
                      <span class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest">
                        Berat: {{ ((item.variant ? item.variant.weight : item.product?.weight) * item.quantity) }}g
                      </span>
                    </div>

                  </div>
                </div>
              }
            </div>

            <!-- Summary Column -->
            <div appGlassmorphism
                 class="p-8 rounded-3xl border space-y-6 lg:sticky lg:top-28">
              <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white">
                Ringkasan Pesanan
              </h3>
              
              <div class="space-y-4 text-sm font-medium">
                <div class="flex justify-between text-charcoal-500 dark:text-charcoal-400">
                  <span>Total Item</span>
                  <span>{{ cartService.itemsCount() }} Kemasan</span>
                </div>
                <div class="flex justify-between text-charcoal-500 dark:text-charcoal-400">
                  <span>Total Berat</span>
                  <span>{{ (cartService.totalWeight() / 1000).toFixed(2) }} kg</span>
                </div>
                <div class="flex justify-between text-charcoal-500 dark:text-charcoal-400">
                  <span>Subtotal</span>
                  <span>Rp {{ cartService.subtotal().toLocaleString('id-ID') }}</span>
                </div>
                <div class="flex justify-between text-charcoal-500 dark:text-charcoal-400">
                  <span>Estimasi Pengiriman</span>
                  <span class="text-xs text-charcoal-400 font-bold uppercase tracking-wider">Dihitung nanti</span>
                </div>
                <div class="border-t border-charcoal-200 dark:border-charcoal-800 pt-4 flex justify-between text-lg font-display font-extrabold text-charcoal-800 dark:text-white">
                  <span>Subtotal</span>
                  <span>Rp {{ cartService.subtotal().toLocaleString('id-ID') }}</span>
                </div>
              </div>

              <div class="pt-4 space-y-3">
                <a routerLink="/checkout" 
                   class="block text-center w-full px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer">
                  Lanjut ke Checkout
                </a>
                <a routerLink="/produk" 
                   class="block text-center w-full px-8 py-3.5 font-sans font-bold text-xs tracking-widest uppercase rounded-full border border-charcoal-200 dark:border-charcoal-850 hover:bg-charcoal-100 dark:hover:bg-charcoal-900 text-charcoal-600 dark:text-charcoal-300 transition-all duration-300 cursor-pointer">
                  Lanjutkan Belanja
                </a>
              </div>
            </div>

          </div>
        }

      </div>
    </div>
  `,
  styles: []
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  themeService = inject(ThemeService);
  private modalService = inject(ModalService);

  actionLoading = signal<boolean>(false);

  ngOnInit() {
    this.cartService.loadCart();
  }

  updateQuantity(itemId: number, qty: number) {
    if (qty < 1) return;
    this.actionLoading.set(true);
    this.cartService.updateQuantity(itemId, qty).subscribe({
      next: () => this.actionLoading.set(false),
      error: () => this.actionLoading.set(false)
    });
  }

  removeItem(itemId: number) {
    this.actionLoading.set(true);
    this.cartService.removeItem(itemId).subscribe({
      next: () => this.actionLoading.set(false),
      error: () => this.actionLoading.set(false)
    });
  }

  async clearCart() {
    const confirmed = await this.modalService.confirm({
      title: 'Kosongkan Keranjang',
      message: 'Apakah Anda yakin ingin mengosongkan keranjang belanja?',
      confirmLabel: 'Kosongkan',
      cancelLabel: 'Batal',
    });
    if (!confirmed) return;
    this.actionLoading.set(true);
    this.cartService.clearCart().subscribe({
      next: () => this.actionLoading.set(false),
      error: () => this.actionLoading.set(false)
    });
  }
}
