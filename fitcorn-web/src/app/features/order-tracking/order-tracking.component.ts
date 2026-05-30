import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { CheckoutService } from '../../core/services/checkout.service';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32 font-sans transition-colors duration-300">
      <div class="max-w-3xl mx-auto space-y-12">
        
        <!-- Header -->
        <div class="text-center space-y-4">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-corn-100 dark:bg-corn-400/10 text-4xl text-corn-500 mb-2">
            📦
          </div>
          <h1 class="text-4xl font-display font-extrabold text-charcoal-800 dark:text-white">
            Order Status Details
          </h1>
          @if (order()) {
            <p class="text-charcoal-500 dark:text-charcoal-400 font-medium max-w-md mx-auto">
              Fitcorn E-Commerce order code:
              <span class="block font-bold text-charcoal-800 dark:text-white mt-1 text-lg tracking-wider uppercase">
                {{ order().orderNumber }}
              </span>
            </p>
          }
        </div>

        <!-- Loading State -->
        @if (loading()) {
          <div class="flex items-center justify-center py-12 gap-3 animate-pulse">
            <span class="animate-spin text-xl text-corn-500">⌛</span>
            <span class="text-sm font-semibold text-charcoal-400">Loading order status details...</span>
          </div>
        } @else if (error()) {
          <!-- Error State -->
          <div class="text-center py-8">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-950 text-red-500 text-xl mb-4">
              ⚠️
            </div>
            <h3 class="font-display font-extrabold text-lg text-charcoal-800 dark:text-white mb-2">Error Loading Order</h3>
            <p class="text-charcoal-500 dark:text-charcoal-400 font-medium mb-6">{{ error() }}</p>
            <a routerLink="/produk" class="px-6 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300">
              Browse Products
            </a>
          </div>
        } @else {
          <!-- Main Content -->
          
          <!-- Payment Pending Alert -->
          @if (payment() && payment().status === 'PENDING') {
            <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark border-yellow-500/30' : 'glassmorphism-light border-yellow-400/30'"
                 class="p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-premium relative overflow-hidden">
              <div class="absolute top-0 left-0 w-2.5 h-full bg-yellow-400"></div>
              
              <div class="space-y-2 text-center md:text-left pl-2">
                <h4 class="font-display font-extrabold text-lg text-charcoal-800 dark:text-white flex items-center justify-center md:justify-start gap-2">
                  <span>💳</span> Awaiting Payment
                </h4>
                <p class="text-xs text-charcoal-500 dark:text-charcoal-400 font-medium">
                  Please complete your payment of <span class="font-bold text-corn-500">Rp {{ order().total.toLocaleString('id-ID') }}</span> to process shipment.
                </p>
              </div>

              @if (payment().paymentUrl) {
                <a [href]="payment().paymentUrl" target="_blank"
                   class="px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-md hover:shadow-lg transition-all duration-300 shrink-0 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2">
                  Pay with Midtrans
                </a>
              }
            </div>
          }

          <!-- Delivery Tracking Status Timeline -->
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-8 rounded-3xl border space-y-8 shadow-premium">
            <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white border-b border-charcoal-150 dark:border-charcoal-900 pb-4">
              Tracking Progress
            </h3>

            <div class="relative pl-8 border-l border-charcoal-200 dark:border-charcoal-800 space-y-8 text-sm">
              @for (h of trackingHistory(); track h.label) {
                <div class="relative">
                  <!-- Active vs Inactive Point -->
                  <div [ngClass]="h.done 
                         ? 'bg-corn-400 border-white dark:border-charcoal-950 scale-110 shadow-md shadow-corn-500/20' 
                         : 'bg-charcoal-200 dark:bg-charcoal-800 border-charcoal-300 dark:border-charcoal-900'"
                       class="absolute -left-10 top-0.5 w-4 h-4 rounded-full border-4 transition-all duration-300"></div>
                  
                  <div>
                    <h4 [ngClass]="h.done ? 'text-charcoal-800 dark:text-white font-bold' : 'text-charcoal-400 font-semibold'"
                        class="text-sm transition-colors duration-300">
                      {{ h.label }}
                    </h4>
                    @if (h.done && h.time) {
                      <span class="block text-[10px] text-charcoal-455 dark:text-charcoal-500 font-semibold mt-0.5">
                        Updated at: {{ h.time | date:'dd MMM yyyy, HH:mm' }}
                      </span>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Courier Airwaybill -->
            @if (order().trackingNumber) {
              <div class="p-4 rounded-2xl bg-charcoal-100 dark:bg-charcoal-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold">
                <div>
                  <span class="text-charcoal-400 block mb-1">COURIER AIRWAYBILL</span>
                  <span class="text-charcoal-800 dark:text-white font-bold uppercase tracking-wider">
                    {{ order().courierName }} - {{ order().courierService }}
                  </span>
                </div>
                <div>
                  <span class="text-charcoal-400 block mb-1">TRACKING CODE</span>
                  <span class="text-corn-500 text-sm font-extrabold tracking-wider">{{ order().trackingNumber }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Order Summary Items details -->
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-8 rounded-3xl border space-y-6 shadow-premium">
            
            <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white border-b border-charcoal-150 dark:border-charcoal-900 pb-4">
              Order Details
            </h3>

            <!-- Item Rows -->
            <div class="space-y-4">
              @for (item of order().items; track item.id) {
                <div class="flex items-center justify-between gap-4 text-sm font-medium">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-charcoal-150 dark:bg-charcoal-900 flex items-center justify-center text-2xl rounded-xl overflow-hidden shrink-0">
                      @if (item.productImage) {
                        <img [src]="item.productImage" [alt]="item.productName" class="w-full h-full object-cover" />
                      } @else {
                        🍿
                      }
                    </div>
                    <div>
                      <h4 class="font-bold text-charcoal-800 dark:text-white">{{ item.productName }}</h4>
                      <span class="text-[10px] text-corn-500 font-bold uppercase tracking-wider">
                        {{ item.variantName || 'Single Pack (150g)' }} • Qty: {{ item.quantity }}
                      </span>
                    </div>
                  </div>
                  <span class="font-display font-extrabold text-charcoal-800 dark:text-white">
                    Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}
                  </span>
                </div>
              }
            </div>

            <!-- Price specifications list -->
            <div class="border-t border-charcoal-150 dark:border-charcoal-900 pt-6 space-y-3 text-xs font-semibold text-charcoal-500 dark:text-charcoal-400">
              <div class="flex justify-between">
                <span>Items Subtotal</span>
                <span class="text-charcoal-800 dark:text-white font-bold">Rp {{ order().subtotal.toLocaleString('id-ID') }}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping Cost ({{ order().courierName }} - {{ order().courierService }})</span>
                <span class="text-charcoal-800 dark:text-white font-bold">Rp {{ order().shippingCost.toLocaleString('id-ID') }}</span>
              </div>
              <div class="border-t border-charcoal-150 dark:border-charcoal-900 pt-3 flex justify-between text-sm font-display font-extrabold text-charcoal-800 dark:text-white">
                <span>Total Amount Paid</span>
                <span class="text-corn-500 text-base">Rp {{ order().total.toLocaleString('id-ID') }}</span>
              </div>
            </div>

          </div>
        }

      </div>
    </div>
  `,
  styles: []
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  private route = inject(ActivatedRoute);
  private checkoutService = inject(CheckoutService);

  order = signal<any | null>(null);
  payment = signal<any | null>(null);
  trackingHistory = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  private statusIntervalId: any;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id');
      if (orderId) {
        this.loadOrderTracking(orderId);
        
        // Start polling payment status check in background every 10 seconds to auto-approve on simulated success
        this.statusIntervalId = setInterval(() => {
          this.checkPaymentStatusSilent(orderId);
        }, 10000);
      }
    });
  }

  ngOnDestroy() {
    if (this.statusIntervalId) {
      clearInterval(this.statusIntervalId);
    }
  }

  loadOrderTracking(orderId: string) {
    this.loading.set(true);
    this.error.set(null);

    this.checkoutService.getOrderTracking(orderId).subscribe({
      next: (res) => {
        this.order.set(res.order);
        this.trackingHistory.set(res.history || []);
        
        // Fetch payment details
        this.checkoutService.getPaymentStatus(orderId).subscribe({
          next: (pay) => {
            this.payment.set(pay);
            this.loading.set(false);
          },
          error: () => {
            this.payment.set(null);
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Failed to load tracking details', err);
        this.error.set('Order details could not be retrieved. Please check the order link.');
        this.loading.set(false);
      }
    });
  }

  checkPaymentStatusSilent(orderId: string) {
    if (!this.order() || this.order().status !== 'PENDING' && this.order().status !== 'WAITING_PAYMENT') {
      return; // Already paid/processing
    }

    this.checkoutService.getPaymentStatus(orderId).subscribe({
      next: (pay) => {
        this.payment.set(pay);
        // If payment completed, reload whole tracking status
        if (pay && pay.status === 'SUCCESS') {
          this.loadOrderTracking(orderId);
        }
      }
    });
  }
}
