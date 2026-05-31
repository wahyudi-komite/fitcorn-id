import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { ModalService } from '../../shared/services/modal.service';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ButtonComponent } from '../../shared/ui';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32 font-sans transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        
        <!-- Header -->
        <h1 class="text-4xl font-display font-extrabold text-charcoal-800 dark:text-white mb-8">
Checkout Pesanan
        </h1>

        @if (!authService.isAuthenticated()) {
          <!-- Authentication Guard UI -->
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-12 rounded-3xl border text-center space-y-6 shadow-premium max-w-xl mx-auto">
            <span class="text-6xl block">🔒</span>
            <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Diperlukan Checkout Aman</h3>
            <p class="text-charcoal-500 dark:text-charcoal-400 font-medium max-w-sm mx-auto">
              Silakan masuk atau daftar untuk menyelesaikan pesanan popcorn premium Anda dan melacak pengiriman.
            </p>
            <div class="flex flex-wrap gap-4 justify-center pt-2">
              <a routerLink="/login" 
                 class="px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-md hover:shadow-lg transition-all duration-300">
                Login
              </a>
              <a routerLink="/daftar" 
                 class="px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full border border-charcoal-200 dark:border-charcoal-850 text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-800 transition-all duration-300">
                Daftar
              </a>
            </div>
          </div>
        } @else if (cartService.itemsCount() === 0 && !checkoutSuccess()) {
          <!-- Empty Cart Redirect -->
          <div class="text-center py-16">
            <span class="text-6xl block mb-6">🍿</span>
            <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white mb-2">Tidak ada item untuk checkout</h3>
            <p class="text-charcoal-500 dark:text-charcoal-400 font-medium max-w-sm mx-auto mb-6">
              Keranjang belanja Anda saat ini kosong. Tambahkan popcorn premium sebelum checkout.
            </p>
            <a routerLink="/produk" class="px-6 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300">
              Ke Katalog
            </a>
          </div>
        } @else {
          <!-- Checkout Process -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            <!-- Forms Details -->
            <div class="lg:col-span-2 space-y-8">
              
              <!-- Address Section -->
              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                   class="p-8 rounded-3xl border space-y-6 shadow-premium">
                
                <div class="flex items-center justify-between">
                  <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white">
                    Alamat Pengiriman
                  </h3>
                  @if (savedAddresses().length > 0 && !addNewAddressMode()) {
                    <app-button (onClick)="toggleNewAddress(true)" 
                                variant="ghost" size="sm">
                      + Tambah Alamat Baru
                    </app-button>
                  }
                </div>

                @if (savedAddresses().length > 0 && !addNewAddressMode()) {
                  <!-- Address List -->
                  <div class="space-y-4">
                    @for (addr of savedAddresses(); track addr.id) {
                      <div (click)="selectAddress(addr)"
                           [ngClass]="selectedAddress()?.id === addr.id
                             ? 'border-corn-400 bg-corn-400/5'
                             : (themeService.theme() === 'dark' ? 'border-charcoal-850 hover:border-charcoal-700' : 'border-charcoal-200 hover:border-charcoal-350')"
                           class="p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-sm font-medium space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-charcoal-800 dark:text-white">{{ addr.fullName }}</span>
                          @if (addr.isDefault) {
                            <span class="px-2 py-0.5 text-[9px] font-bold rounded bg-charcoal-200 dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-400 uppercase">Utama</span>
                          }
                        </div>
                        <p class="text-charcoal-500 dark:text-charcoal-400 text-xs">{{ addr.phone }}</p>
                        <p class="text-charcoal-500 dark:text-charcoal-400 leading-relaxed text-xs">{{ addr.fullAddress }}, {{ addr.city }}, {{ addr.province }} - {{ addr.postalCode }}</p>
                      </div>
                    }
                  </div>
                } @else {
                  <!-- Add New Address Form -->
                  <form (submit)="saveAddress()" class="space-y-4 text-sm font-medium">
                    <div class="grid grid-cols-2 gap-4">
                      <input type="text" [(ngModel)]="newAddress.fullName" name="fullName" placeholder="Nama Lengkap Penerima" required
                             [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                             class="w-full px-5 py-3 rounded-md border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
                      
                      <input type="text" [(ngModel)]="newAddress.phone" name="phone" placeholder="Nomor Telepon" required
                             [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                             class="w-full px-5 py-3 rounded-md border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <!-- Province -->
                      <select (change)="onProvinceChange($event)" [(ngModel)]="selectedProvinceId" name="provinceSelect" required
                              [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white bg-charcoal-950' : 'border-charcoal-200 text-charcoal-800 bg-white'"
                              class="w-full px-5 py-3 rounded-md border focus:outline-none focus:border-corn-400 cursor-pointer">
                        <option value="">Pilih Provinsi</option>
                        @for (p of provinces(); track p.province_id) {
                          <option [value]="p.province_id">{{ p.province }}</option>
                        }
                      </select>

                      <!-- City -->
                      <select (change)="onCityChange($event)" [(ngModel)]="selectedCityId" name="citySelect" required [disabled]="!selectedProvinceId"
                              [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white bg-charcoal-950' : 'border-charcoal-200 text-charcoal-800 bg-white'"
                              class="w-full px-5 py-3 rounded-md border focus:outline-none focus:border-corn-400 cursor-pointer disabled:opacity-50">
                        <option value="">Pilih Kota</option>
                        @for (c of cities(); track c.city_id) {
                          <option [value]="c.city_id">{{ c.type }} {{ c.city_name }}</option>
                        }
                      </select>
                    </div>

                    <div class="grid grid-cols-3 gap-4">
                      <input type="text" [(ngModel)]="newAddress.district" name="district" placeholder="Kecamatan" required
                             [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                             class="w-full px-5 py-3 rounded-md border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
                      <input type="text" [(ngModel)]="newAddress.village" name="village" placeholder="Kelurahan" required
                             [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                             class="w-full px-5 py-3 rounded-md border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
                      <input type="text" [(ngModel)]="newAddress.postalCode" name="postalCode" placeholder="Kode Pos" required
                             [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                             class="w-full px-5 py-3 rounded-md border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
                    </div>

                    <textarea [(ngModel)]="newAddress.fullAddress" name="fullAddress" placeholder="Detail Alamat Jalan (RT/RW, Nomor Rumah)" rows="3" required
                              [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                              class="w-full px-5 py-3 rounded-md border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400"></textarea>

                    <div class="flex items-center gap-4 justify-between pt-2">
                      @if (savedAddresses().length > 0) {
                        <app-button (onClick)="toggleNewAddress(false)" 
                                    variant="outline" size="sm">
                          Batal
                        </app-button>
                      }
                      <app-button type="submit" [disabled]="addressLoading()" size="lg" [loading]="addressLoading()">
                        Simpan Alamat
                      </app-button>
                    </div>
                  </form>
                }

              </div>

              <!-- Courier Section -->
              @if (selectedAddress()) {
                <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                     class="p-8 rounded-3xl border space-y-6 shadow-premium">
                  
                  <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white">
                    Pilihan Kurir Pengiriman
                  </h3>

                  @if (shippingLoading()) {
                    <div class="flex items-center justify-center py-8 gap-3 animate-pulse">
                      <span class="animate-spin text-xl text-corn-500">⌛</span>
                      <span class="text-sm font-semibold text-charcoal-400">Menghitung tarif pengiriman...</span>
                    </div>
                  } @else if (courierOptions().length === 0) {
                    <div class="text-center py-6 text-sm text-charcoal-400 font-semibold">
                      Tidak dapat mengambil tarif pengiriman. Pastikan alamat tujuan benar.
                    </div>
                  } @else {
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      @for (c of courierOptions(); track c.name + c.service) {
                        <app-button (onClick)="selectCourier(c)"
                                    variant="outline"
                                    [ngClass]="selectedCourier()?.name === c.name && selectedCourier()?.service === c.service
                                      ? 'border-corn-400 bg-corn-400/5 text-charcoal-800 dark:text-white font-bold'
                                      : (themeService.theme() === 'dark' ? 'border-charcoal-850 hover:border-charcoal-700 text-charcoal-300' : 'border-charcoal-200 hover:border-charcoal-350 text-charcoal-600')"
                                    class="p-5 text-left flex items-center justify-between h-20 w-full">
                          <div>
                            <span class="block font-bold text-xs text-corn-500 uppercase tracking-widest">{{ c.name }}</span>
                            <span class="block font-extrabold text-charcoal-800 dark:text-white mt-1">{{ c.service }} Layanan</span>
                            <span class="block text-[10px] text-charcoal-400 font-semibold mt-0.5">Estimasi Tiba: {{ c.etd }} Hari</span>
                          </div>
                          <span class="text-base font-display font-extrabold text-charcoal-850 dark:text-white">
                            Rp {{ c.cost.toLocaleString('id-ID') }}
                          </span>
                        </app-button>
                      }
                    </div>
                  }

                </div>
              }

            </div>

            <!-- Checkout Order Summary -->
            <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
                 class="p-8 rounded-3xl border space-y-6 lg:sticky lg:top-28">
              <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white">
                Ringkasan Pembayaran
              </h3>

              <div class="space-y-4 text-sm font-medium">
                <div class="flex justify-between text-charcoal-500 dark:text-charcoal-400">
                  <span>Item Keranjang</span>
                  <span>{{ cartService.itemsCount() }} Kemasan</span>
                </div>
                <div class="flex justify-between text-charcoal-500 dark:text-charcoal-400">
                  <span>Subtotal Keranjang</span>
                  <span>Rp {{ cartService.subtotal().toLocaleString('id-ID') }}</span>
                </div>
                <div class="flex justify-between text-charcoal-500 dark:text-charcoal-400">
                  <span>Biaya Pengiriman</span>
                  <span>Rp {{ (selectedCourier()?.cost || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div class="border-t border-charcoal-200 dark:border-charcoal-800 pt-4 flex justify-between text-lg font-display font-extrabold text-charcoal-800 dark:text-white">
                  <span>Total Keseluruhan</span>
                  <span>Rp {{ (cartService.subtotal() + (selectedCourier()?.cost || 0)).toLocaleString('id-ID') }}</span>
                </div>
              </div>

              <!-- Notes -->
              <div class="space-y-2 pt-2">
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block">Catatan Pengiriman</label>
                <input type="text" [(ngModel)]="orderNotes" name="orderNotes" placeholder="cth. Titip di lobi, warna pagar"
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-4 py-2.5 text-xs rounded-md border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
              </div>

              <div class="pt-4 space-y-3">
                <app-button (onClick)="placeOrder()"
                            [disabled]="orderLoading() || !selectedAddress() || !selectedCourier()"
                            [fullWidth]="true" size="lg" [loading]="orderLoading()">
                  <span>💳</span> Pesan & Bayar
                </app-button>
                
                @if (errorMsg()) {
                  <div class="p-3 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    {{ errorMsg() }}
                  </div>
                }
              </div>
            </div>

          </div>
        }

      </div>
    </div>
  `,
  styles: []
})
export class CheckoutComponent implements OnInit {
  themeService = inject(ThemeService);
  cartService = inject(CartService);
  authService = inject(AuthService);
  private modalService = inject(ModalService);
  private checkoutService = inject(CheckoutService);
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);

  savedAddresses = signal<any[]>([]);
  selectedAddress = signal<any | null>(null);
  addNewAddressMode = signal<boolean>(false);
  addressLoading = signal<boolean>(false);

  // Provinces & Cities Loading
  provinces = signal<any[]>([]);
  cities = signal<any[]>([]);
  selectedProvinceId = '';
  selectedCityId = '';

  newAddress = {
    fullName: '',
    phone: '',
    province: '',
    provinceId: '',
    city: '',
    cityId: '',
    district: '',
    village: '',
    postalCode: '',
    fullAddress: '',
    isDefault: true
  };

  // Shipping Couriers calculation
  shippingLoading = signal<boolean>(false);
  courierOptions = signal<any[]>([]);
  selectedCourier = signal<any | null>(null);

  orderNotes = '';
  orderLoading = signal<boolean>(false);
  checkoutSuccess = signal<boolean>(false);
  errorMsg = signal<string>('');

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadAddresses();
      this.loadProvinces();
    }
  }

  loadAddresses() {
    this.checkoutService.getSavedAddresses().subscribe({
      next: (list) => {
        this.savedAddresses.set(list || []);
        if (list && list.length > 0) {
          const defaultAddr = list.find((a: any) => a.isDefault) || list[0];
          this.selectAddress(defaultAddr);
          this.addNewAddressMode.set(false);
        } else {
          this.addNewAddressMode.set(true);
        }
      },
      error: () => this.savedAddresses.set([])
    });
  }

  loadProvinces() {
    this.checkoutService.getProvinces().subscribe({
      next: (res) => this.provinces.set(res || []),
      error: () => this.provinces.set([])
    });
  }

  onProvinceChange(event: Event) {
    const provinceId = (event.target as HTMLSelectElement).value;
    this.selectedProvinceId = provinceId;
    this.selectedCityId = '';
    this.cities.set([]);

    if (provinceId) {
      const provObj = this.provinces().find(p => p.province_id === provinceId);
      this.newAddress.province = provObj?.province || '';
      this.newAddress.provinceId = provinceId;

      this.checkoutService.getCities(provinceId).subscribe({
        next: (res) => this.cities.set(res || []),
        error: () => this.cities.set([])
      });
    }
  }

  onCityChange(event: Event) {
    const cityId = (event.target as HTMLSelectElement).value;
    this.selectedCityId = cityId;

    if (cityId) {
      const cityObj = this.cities().find(c => c.city_id === cityId);
      this.newAddress.city = `${cityObj?.type} ${cityObj?.city_name}` || '';
      this.newAddress.cityId = cityId;
    }
  }

  toggleNewAddress(mode: boolean) {
    this.addNewAddressMode.set(mode);
    if (mode) {
      this.selectedAddress.set(null);
      this.selectedCourier.set(null);
      this.courierOptions.set([]);
    } else {
      if (this.savedAddresses().length > 0) {
        this.selectAddress(this.savedAddresses()[0]);
      }
    }
  }

  saveAddress() {
    this.addressLoading.set(true);
    this.checkoutService.saveAddress(this.newAddress).subscribe({
      next: (saved) => {
        this.addressLoading.set(false);
        this.loadAddresses(); // Reload addresses which will auto-select the newly added address
      },
      error: (err) => {
        console.error('Failed to save address', err);
        this.modalService.confirm({
          title: 'Kesalahan',
          message: 'Tidak dapat menyimpan alamat. Periksa input parameter.',
          confirmLabel: 'OK',
          cancelLabel: '',
        });
        this.addressLoading.set(false);
      }
    });
  }

  selectAddress(addr: any) {
    this.selectedAddress.set(addr);
    this.selectedCourier.set(null);
    this.courierOptions.set([]);
    this.calculateShipping(addr.cityId);
  }

  calculateShipping(cityId: string) {
    this.shippingLoading.set(true);
    const weight = this.cartService.totalWeight() || 150; // default weight snapshot

    this.checkoutService.calculateRates(cityId, weight).subscribe({
      next: (rates) => {
        this.courierOptions.set(rates || []);
        if (rates && rates.length > 0) {
          this.selectCourier(rates[0]); // auto select first option
        }
        this.shippingLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to calculate shipping rates', err);
        this.shippingLoading.set(false);
      }
    });
  }

  selectCourier(c: any) {
    this.selectedCourier.set(c);
  }

  placeOrder() {
    const address = this.selectedAddress();
    const courier = this.selectedCourier();
    if (!address || !courier) return;

    this.orderLoading.set(true);
    this.errorMsg.set('');

    const payload = {
      addressId: address.id,
      courierName: courier.name,
      courierService: courier.service,
      shippingCost: courier.cost,
      notes: this.orderNotes
    };

    this.checkoutService.createOrder(payload).subscribe({
      next: (order) => {
        // Trigger GA4/FB/TikTok Purchase tracking event
        this.analyticsService.trackPurchase(order);

        // Trigger payment generation
        this.checkoutService.createPayment(order.id, 'midtrans').subscribe({
          next: (payment) => {
            this.orderLoading.set(false);
            this.checkoutSuccess.set(true);
            this.cartService.clearCart().subscribe(); // clear frontend cart cache
            
            // Redirect to order details where they can pay or track
            this.router.navigate(['/pesanan', order.id]);
          },
          error: (err) => {
            console.error('Failed to initialize payment', err);
            // Even if payment generation fails, order is placed successfully
            this.orderLoading.set(false);
            this.router.navigate(['/pesanan', order.id]);
          }
        });
      },
      error: (err) => {
        console.error('Failed to place order', err);
        this.errorMsg.set(err.error?.message || 'Gagal memesan. Periksa stok katalog.');
        this.orderLoading.set(false);
      }
    });
  }
}
