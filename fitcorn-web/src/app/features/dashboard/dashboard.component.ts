import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { ModalService } from '../../shared/services/modal.service';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, LoadingStateComponent, EmptyStateComponent } from '../../shared/ui';
import { GlassmorphismDirective } from '../../shared/directives/glassmorphism.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, LoadingStateComponent, EmptyStateComponent, GlassmorphismDirective],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32 font-sans transition-colors duration-300">
      
      @if (!authService.isAuthenticated()) {
        <!-- Auth Guard for Private Route -->
        <div appGlassmorphism [appGlassmorphismShadow]="false"
             class="p-12 rounded-3xl border text-center space-y-6 shadow-premium max-w-xl mx-auto">
          <span class="text-6xl block">🔒</span>
          <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Akses Ditolak</h3>
          <p class="text-charcoal-500 dark:text-charcoal-400 font-medium max-w-sm mx-auto">
            Silakan masuk untuk mengakses dashboard pribadi, melihat riwayat pesanan, dan mengelola alamat.
          </p>
          <a routerLink="/login" 
             class="inline-block px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-md hover:shadow-lg transition-all duration-300">
            Login
          </a>
        </div>
      } @else {
        <!-- Authenticated Dashboard -->
        <div class="max-w-4xl mx-auto space-y-10">
          
          <!-- Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-charcoal-150 dark:border-charcoal-850 pb-6">
            <div>
              <h1 class="text-4xl font-display font-extrabold text-charcoal-800 dark:text-white leading-tight">
                Akun Saya
              </h1>
              <p class="text-sm font-semibold text-charcoal-400 mt-1">
                Selamat datang kembali, {{ authService.currentUser()?.fullName }}
              </p>
            </div>
            
            <app-button (onClick)="logout()"
                        variant="danger" size="sm">
              Keluar
            </app-button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            
            <!-- Navigation Sidebar -->
            <div appGlassmorphism [appGlassmorphismShadow]="false"
                 class="p-6 rounded-3xl border flex flex-col gap-2 shadow-premium">
                <app-button (onClick)="setActiveTab('overview')"
                            variant="ghost"
                            [ngClass]="activeTab() === 'overview' ? 'bg-corn-400 text-charcoal-900 font-bold' : 'text-charcoal-500 hover:text-corn-500'"
                            class="w-full text-left px-4 py-3">
                  Ringkasan
                </app-button>
                <app-button (onClick)="setActiveTab('orders')"
                            variant="ghost"
                            [ngClass]="activeTab() === 'orders' ? 'bg-corn-400 text-charcoal-900 font-bold' : 'text-charcoal-500 hover:text-corn-500'"
                            class="w-full text-left px-4 py-3">
                  Riwayat Pesanan
                </app-button>
                <app-button (onClick)="setActiveTab('addresses')"
                            variant="ghost"
                            [ngClass]="activeTab() === 'addresses' ? 'bg-corn-400 text-charcoal-900 font-bold' : 'text-charcoal-500 hover:text-corn-500'"
                            class="w-full text-left px-4 py-3">
                  Buku Alamat
                </app-button>
            </div>

            <!-- Content Area -->
            <div class="md:col-span-3 space-y-6">
              
              <!-- Tab 1: Overview -->
              @if (activeTab() === 'overview') {
                <div appGlassmorphism [appGlassmorphismShadow]="false"
                     class="p-8 rounded-3xl border space-y-6 shadow-premium">
                  <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white border-b border-charcoal-150 dark:border-charcoal-900 pb-4">
                    Ringkasan Akun
                  </h3>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-medium">
                    <div>
                      <span class="text-[10px] text-charcoal-400 font-semibold block uppercase tracking-widest mb-1">Nama Lengkap</span>
                      <span class="text-charcoal-850 dark:text-white font-bold text-base">{{ authService.currentUser()?.fullName }}</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-charcoal-400 font-semibold block uppercase tracking-widest mb-1">Alamat Email</span>
                      <span class="text-charcoal-850 dark:text-white font-bold text-base">{{ authService.currentUser()?.email }}</span>
                    </div>
                  </div>
                </div>
              }

              <!-- Tab 2: Orders History -->
              @if (activeTab() === 'orders') {
                <div appGlassmorphism [appGlassmorphismShadow]="false"
                     class="p-8 rounded-3xl border space-y-6 shadow-premium">
                  <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white border-b border-charcoal-150 dark:border-charcoal-900 pb-4">
                    Riwayat Pesanan Saya
                  </h3>

                  @if (ordersLoading()) {
                    <app-loading-state message="Memuat data pesanan..." />
                  } @else if (myOrders().length === 0) {
                    <app-empty-state icon="🍿" title="Tidak Ada Pesanan" message="Belum ada pesanan yang terselesaikan." actionLabel="Pesan Sekarang" (action)="goToCatalog()" />
                  } @else {
                    <div class="space-y-4">
                      @for (ord of myOrders(); track ord.id) {
                        <div class="p-5 rounded-2xl border border-charcoal-200 dark:border-charcoal-850 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-semibold text-charcoal-500 dark:text-charcoal-400">
                          <div>
                            <span class="font-bold text-sm text-charcoal-850 dark:text-white block uppercase tracking-wider mb-1">
                              {{ ord.orderNumber }}
                            </span>
                            <span class="block text-[10px] text-charcoal-400">{{ ord.createdAt | date:'dd MMM yyyy, HH:mm' }}</span>
                            <span class="block text-[10px] text-charcoal-400 mt-1 uppercase">Kurir: {{ ord.courierName }} - {{ ord.courierService }}</span>
                          </div>
                          
                          <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            <div class="text-left sm:text-right">
                              <span class="font-display font-extrabold text-charcoal-800 dark:text-white block text-sm">
                                Rp {{ ord.total.toLocaleString('id-ID') }}
                              </span>
                              <span [ngClass]="ord.status === 'DELIVERED' 
                                      ? 'text-green-500' 
                                      : (ord.status === 'CANCELLED' ? 'text-red-500' : 'text-yellow-500')"
                                    class="text-[9px] font-bold uppercase tracking-widest block mt-0.5">
                                Status: {{ ord.status }}
                              </span>
                            </div>
                            
                            <a [routerLink]="['/pesanan', ord.id]"
                               class="px-4 py-2 bg-charcoal-100 dark:bg-charcoal-900 text-charcoal-700 dark:text-charcoal-350 hover:bg-corn-400 hover:text-charcoal-900 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors duration-300">
                               Lacak
                            </a>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              }

              <!-- Tab 3: Address Book -->
              @if (activeTab() === 'addresses') {
                <div appGlassmorphism [appGlassmorphismShadow]="false"
                     class="p-8 rounded-3xl border space-y-6 shadow-premium">
                    <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white border-b border-charcoal-150 dark:border-charcoal-900 pb-4">
                      Buku Alamat
                    </h3>

                  @if (addressesLoading()) {
                    <app-loading-state message="Memuat alamat..." />
                  } @else if (myAddresses().length === 0) {
                    <app-empty-state title="Belum Ada Alamat" message="Silakan tambahkan alamat pengiriman untuk checkout yang lebih cepat." actionLabel="Buat Alamat Checkout" (action)="goToCheckout()" />
                  } @else {
                    <div class="space-y-4">
                      @for (addr of myAddresses(); track addr.id) {
                        <div class="p-5 rounded-2xl border border-charcoal-200 dark:border-charcoal-850 text-sm font-medium space-y-2 relative">
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
                  }
                </div>
              }

            </div>

          </div>
        </div>
      }

    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  private modalService = inject(ModalService);
  private checkoutService = inject(CheckoutService);
  private router = inject(Router);

  activeTab = signal<'overview' | 'orders' | 'addresses'>('overview');

  // Tab data states
  myOrders = signal<any[]>([]);
  ordersLoading = signal<boolean>(false);

  myAddresses = signal<any[]>([]);
  addressesLoading = signal<boolean>(false);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    this.ordersLoading.set(true);
    this.checkoutService.getMyOrders().subscribe({
      next: (list) => {
        this.myOrders.set(list || []);
        this.ordersLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load user orders list', err);
        this.ordersLoading.set(false);
      }
    });

    this.addressesLoading.set(true);
    this.checkoutService.getSavedAddresses().subscribe({
      next: (list) => {
        this.myAddresses.set(list || []);
        this.addressesLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load user address book', err);
        this.addressesLoading.set(false);
      }
    });
  }

  setActiveTab(tabName: 'overview' | 'orders' | 'addresses') {
    this.activeTab.set(tabName);
  }

  async logout() {
    const confirmed = await this.modalService.confirm({
      title: 'Keluar',
      message: 'Apakah Anda yakin ingin keluar dari Fitcorn?',
      confirmLabel: 'Keluar',
      cancelLabel: 'Batal',
    });
    if (!confirmed) return;
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  goToCatalog() {
    this.router.navigate(['/produk']);
  }
}
