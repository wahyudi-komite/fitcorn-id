import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductsService } from '../../core/services/products.service';
import { AdminService } from './admin.service';
import { ModalService } from '../../shared/services/modal.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { DialogComponent } from '../../shared/ui/dialog/dialog.component';
import { InputComponent } from '../../shared/ui/input/input.component';
import { SelectComponent } from '../../shared/ui/select/select.component';
import { TextareaComponent } from '../../shared/ui/textarea/textarea.component';
import { LoadingStateComponent, TableComponent } from '../../shared/ui';
import type { TableColumn } from '../../shared/ui';
import { GlassmorphismDirective } from '../../shared/directives/glassmorphism.directive';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, DialogComponent, InputComponent, SelectComponent, TextareaComponent, LoadingStateComponent, TableComponent, GlassmorphismDirective],
  template: `
    <div class="min-h-screen font-sans flex flex-col md:flex-row transition-colors duration-300 bg-white dark:bg-charcoal-950">
      
      <!-- 1. Sidebar -->
      <aside [ngClass]="themeService.theme() === 'dark' ? 'bg-charcoal-900 border-charcoal-850' : 'bg-charcoal-50 border-charcoal-100'"
             class="w-full md:w-64 border-r shrink-0 flex flex-col pt-24 pb-8 px-6 space-y-8 z-20 md:sticky md:top-0 md:h-screen no-print">
        
        <div>
          <h2 class="text-xl font-display font-extrabold text-charcoal-800 dark:text-white flex items-center gap-2">
            <span>🛡️</span> Panel Admin
          </h2>
          <p class="text-[10px] text-charcoal-400 font-semibold uppercase tracking-wider mt-1">Kokpit FITCORN</p>
        </div>

        <nav class="flex-1 flex flex-col gap-2 text-sm font-semibold">
          <app-button variant="ghost" customClass="w-full justify-start px-4 py-3 rounded-xl gap-3"
            [class.bg-corn-400/20]="activeTab() === 'dashboard'"
            [class.text-corn-600]="activeTab() === 'dashboard'"
            [class.dark:text-corn-400]="activeTab() === 'dashboard'"
            (onClick)="setTab('dashboard')">
            <span class="text-lg">📊</span>
            <span class="text-xs font-bold uppercase tracking-wider">Dashboard</span>
          </app-button>
          <app-button variant="ghost" customClass="w-full justify-start px-4 py-3 rounded-xl gap-3"
            [class.bg-corn-400/20]="activeTab() === 'products'"
            [class.text-corn-600]="activeTab() === 'products'"
            [class.dark:text-corn-400]="activeTab() === 'products'"
            (onClick)="setTab('products')">
            <span class="text-lg">🛒</span>
            <span class="text-xs font-bold uppercase tracking-wider">Produk</span>
          </app-button>
          <app-button variant="ghost" customClass="w-full justify-start px-4 py-3 rounded-xl gap-3"
            [class.bg-corn-400/20]="activeTab() === 'categories'"
            [class.text-corn-600]="activeTab() === 'categories'"
            [class.dark:text-corn-400]="activeTab() === 'categories'"
            (onClick)="setTab('categories')">
            <span class="text-lg">📁</span>
            <span class="text-xs font-bold uppercase tracking-wider">Kategori</span>
          </app-button>
          <app-button variant="ghost" customClass="w-full justify-start px-4 py-3 rounded-xl gap-3"
            [class.bg-corn-400/20]="activeTab() === 'orders'"
            [class.text-corn-600]="activeTab() === 'orders'"
            [class.dark:text-corn-400]="activeTab() === 'orders'"
            (onClick)="setTab('orders')">
            <span class="text-lg">📦</span>
            <span class="text-xs font-bold uppercase tracking-wider">Pesanan</span>
          </app-button>
          <app-button variant="ghost" customClass="w-full justify-start px-4 py-3 rounded-xl gap-3"
            [class.bg-corn-400/20]="activeTab() === 'customers'"
            [class.text-corn-600]="activeTab() === 'customers'"
            [class.dark:text-corn-400]="activeTab() === 'customers'"
            (onClick)="setTab('customers')">
            <span class="text-lg">👥</span>
            <span class="text-xs font-bold uppercase tracking-wider">Pelanggan</span>
          </app-button>
          <app-button variant="ghost" customClass="w-full justify-start px-4 py-3 rounded-xl gap-3"
            [class.bg-corn-400/20]="activeTab() === 'settings'"
            [class.text-corn-600]="activeTab() === 'settings'"
            [class.dark:text-corn-400]="activeTab() === 'settings'"
            (onClick)="setTab('settings')">
            <span class="text-lg">⚙️</span>
            <span class="text-xs font-bold uppercase tracking-wider">Pengaturan</span>
          </app-button>
          <app-button variant="ghost" customClass="w-full justify-start px-4 py-3 rounded-xl gap-3"
            [class.bg-corn-400/20]="activeTab() === 'banners'"
            [class.text-corn-600]="activeTab() === 'banners'"
            [class.dark:text-corn-400]="activeTab() === 'banners'"
            (onClick)="setTab('banners')">
            <span class="text-lg">🖼</span>
            <span class="text-xs font-bold uppercase tracking-wider">Banner</span>
          </app-button>
          <app-button variant="ghost" customClass="w-full justify-start px-4 py-3 rounded-xl gap-3"
            [class.bg-corn-400/20]="activeTab() === 'instagram'"
            [class.text-corn-600]="activeTab() === 'instagram'"
            [class.dark:text-corn-400]="activeTab() === 'instagram'"
            (onClick)="setTab('instagram')">
            <span class="text-lg">📸</span>
            <span class="text-xs font-bold uppercase tracking-wider">Instagram</span>
          </app-button>
          <app-button variant="ghost" customClass="w-full justify-start px-4 py-3 rounded-xl gap-3"
            [class.bg-corn-400/20]="activeTab() === 'coupons'"
            [class.text-corn-600]="activeTab() === 'coupons'"
            [class.dark:text-corn-400]="activeTab() === 'coupons'"
            (onClick)="setTab('coupons')">
            <span class="text-lg">🎫</span>
            <span class="text-xs font-bold uppercase tracking-wider">Kupon</span>
          </app-button>
        </nav>

        <!-- Sidebar Footer Admin Info -->
        <div class="pt-6 border-t border-charcoal-200 dark:border-charcoal-800 flex items-center justify-between text-xs text-charcoal-400 font-bold uppercase tracking-wider">
          <span>Admin</span>
          <app-button variant="ghost" customClass="w-full justify-start" (onClick)="authService.logout()">
            <span class="text-lg">🚪</span>
            <span class="text-xs font-bold uppercase tracking-wider">Keluar</span>
          </app-button>
        </div>
      </aside>

      <!-- 2. Main Content Area -->
      <main class="flex-1 p-6 md:p-10 pt-24 md:pt-28 overflow-y-auto">
        
        @if (loading()) {
          <app-loading-state message="Memuat data panel admin..." />
        } @else {
          
          <!-- TAB 1: DASHBOARD -->
          @if (activeTab() === 'dashboard') {
            <div class="space-y-10 animate-fade-in">
              <!-- Summary Counters Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Revenue Card -->
                <div appGlassmorphism [appGlassmorphismShadow]="false"
                     class="p-6 rounded-xl border shadow-premium space-y-2 relative overflow-hidden h-32 flex flex-col justify-center">
                  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-corn-400 to-yellow-500"></div>
                  <span class="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider block">Total Pendapatan</span>
                  <span class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white block">
                    Rp {{ stats()?.summary?.totalRevenue?.toLocaleString('id-ID') || 0 }}
                  </span>
                </div>
                <!-- Orders Card -->
                <div appGlassmorphism [appGlassmorphismShadow]="false"
                     class="p-6 rounded-xl border shadow-premium space-y-2 relative overflow-hidden h-32 flex flex-col justify-center">
                  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                  <span class="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider block">Total Pesanan</span>
                  <span class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white block">
                    {{ stats()?.summary?.totalOrders || 0 }}
                  </span>
                </div>
                <!-- Customers Card -->
                <div appGlassmorphism [appGlassmorphismShadow]="false"
                     class="p-6 rounded-xl border shadow-premium space-y-2 relative overflow-hidden h-32 flex flex-col justify-center">
                  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  <span class="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider block">Total Pelanggan</span>
                  <span class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white block">
                    {{ stats()?.summary?.totalCustomers || 0 }}
                  </span>
                </div>
                <!-- Products Card -->
                <div appGlassmorphism [appGlassmorphismShadow]="false"
                     class="p-6 rounded-xl border shadow-premium space-y-2 relative overflow-hidden h-32 flex flex-col justify-center">
                  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                  <span class="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider block">Total Produk</span>
                  <span class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white block">
                    {{ stats()?.summary?.totalProducts || 0 }}
                  </span>
                </div>
              </div>

              <!-- CSS Grid Bar Charts Sales Analytics -->
              <div appGlassmorphism [appGlassmorphismShadow]="false"
                   class="p-8 rounded-xl border shadow-premium space-y-6">
                <h3 class="font-display font-extrabold text-lg text-charcoal-800 dark:text-white">Riwayat Penjualan Harian (30 Hari)</h3>
                
                <div class="h-48 flex items-end justify-between gap-1 sm:gap-2 pt-6 border-b border-charcoal-200 dark:border-charcoal-850 px-2 overflow-x-auto">
                  @for (day of stats()?.salesAnalytics; track day.date) {
                    <div class="flex-1 flex flex-col items-center group relative min-w-[12px] h-full justify-end cursor-pointer">
                      <!-- Responsive Bar Fill -->
                      <div [style.height.%]="getBarHeightPercentage(day.revenue)"
                           class="w-full rounded-t-md bg-corn-400 hover:bg-corn-500 transition-all duration-300 shadow-sm shadow-corn-500/10"></div>
                      
                      <!-- Hover Tooltip -->
                      <span class="absolute bottom-full mb-2 bg-charcoal-900 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 shrink-0 whitespace-nowrap">
                        {{ day.date | date:'dd MMM' }}: Rp {{ day.revenue.toLocaleString('id-ID') }}
                      </span>
                    </div>
                  }
                </div>
                <div class="flex justify-between text-[10px] text-charcoal-455 font-bold uppercase tracking-widest px-2">
                  <span>30 Hari Lalu</span>
                  <span>Hari Ini</span>
                </div>
              </div>

              <!-- Top Products & Recent Orders Grid -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left: Top Selling -->
                <div appGlassmorphism [appGlassmorphismShadow]="false"
                     class="p-6 rounded-xl border shadow-premium space-y-6">
                  <h3 class="font-display font-extrabold text-lg text-charcoal-800 dark:text-white">5 Produk Terlaris</h3>
                  <div class="space-y-4">
                    @for (prod of stats()?.topProducts; track prod.id) {
                      <div class="flex items-center justify-between text-sm font-medium">
                        <div class="flex items-center gap-3">
                          <img [src]="prod.images?.[0]?.url || '/assets/popcorn.png'" [alt]="prod.name" class="w-10 h-10 object-cover rounded-xl bg-charcoal-150 dark:bg-charcoal-900" />
                          <div>
                            <h4 class="font-bold text-charcoal-800 dark:text-white">{{ prod.name }}</h4>
                            <span class="text-[10px] text-corn-500 font-bold uppercase tracking-wider">Terjual: {{ prod.soldCount }} Bungkus</span>
                          </div>
                        </div>
                        <span class="font-extrabold text-charcoal-800 dark:text-white">Rp {{ prod.price.toLocaleString('id-ID') }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Right: Recent Orders -->
                <div appGlassmorphism [appGlassmorphismShadow]="false"
                     class="p-6 rounded-xl border shadow-premium space-y-6">
                  <h3 class="font-display font-extrabold text-lg text-charcoal-800 dark:text-white">Pesanan Terbaru</h3>
                  <div class="space-y-4">
                    @for (ord of stats()?.recentOrders; track ord.id) {
                      <div class="flex items-center justify-between text-sm font-medium border-b border-charcoal-100 dark:border-charcoal-900 pb-3 last:border-none">
                        <div>
                          <span class="font-bold text-charcoal-800 dark:text-white block uppercase tracking-wider text-xs">{{ ord.orderNumber }}</span>
                          <span class="text-[10px] text-charcoal-400 font-semibold block mt-0.5">{{ ord.createdAt | date:'dd MMM yyyy, HH:mm' }} • {{ ord.user?.fullName }}</span>
                        </div>
                        <div class="text-right">
                          <span class="font-extrabold text-charcoal-850 dark:text-white block">Rp {{ ord.total.toLocaleString('id-ID') }}</span>
                          <span class="inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mt-1"
                                [class.bg-green-100]="ord.status === 'paid' || ord.status === 'delivered'"
                                [class.text-green-700]="ord.status === 'paid' || ord.status === 'delivered'"
                                [class.bg-yellow-100]="ord.status === 'pending' || ord.status === 'waiting_payment'"
                                [class.text-yellow-700]="ord.status === 'pending' || ord.status === 'waiting_payment'">
                            {{ ord.status }}
                          </span>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- TAB 2: PRODUCTS CRUD -->
          @if (activeTab() === 'products') {
            <div class="space-y-6 animate-fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Katalog Produk</h3>
                  <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Kelola daftar produk, varian, stok, dan unggah gambar</p>
                </div>
                <app-button (onClick)="openProductModal()">+ Tambah Produk Baru</app-button>
              </div>

              <!-- Product List View -->
              <div appGlassmorphism [appGlassmorphismShadow]="false"
                   class="rounded-xl border shadow-premium overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900 bg-charcoal-50 dark:bg-charcoal-900/50">
                        <th class="text-left py-4 px-6">Gambar</th>
                        <th class="text-left py-4 px-6">Nama Produk</th>
                        <th class="text-left py-4 px-6">Harga</th>
                        <th class="text-left py-4 px-6">Stok</th>
                        <th class="text-left py-4 px-6">Unggulan</th>
                        <th class="text-left py-4 px-6">Status</th>
                        <th class="text-right py-4 px-6">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (p of products(); track p.id) {
                        <tr class="border-b border-charcoal-100 dark:border-charcoal-900 hover:bg-charcoal-50 dark:hover:bg-charcoal-900/20 transition-all font-medium">
                          <td class="py-4 px-6">
                            <img [src]="p.images?.[0]?.url || '/assets/popcorn.png'" [alt]="p.name" class="w-12 h-12 object-cover rounded-xl bg-charcoal-100 dark:bg-charcoal-800" />
                          </td>
                          <td class="py-4 px-6 font-bold text-charcoal-800 dark:text-white">{{ p.name }}</td>
                          <td class="py-4 px-6">Rp {{ p.price.toLocaleString('id-ID') }}</td>
                          <td class="py-4 px-6">
                            <span [ngClass]="(p.inventory?.quantity || 0) < 10 ? 'text-red-500 font-extrabold' : 'text-charcoal-600 dark:text-charcoal-300'">
                              {{ p.inventory?.quantity || 0 }} Packs
                            </span>
                          </td>
                          <td class="py-4 px-6">
                            <span *ngIf="p.isFeatured" class="text-yellow-500 text-lg">⭐</span>
                            <span *ngIf="!p.isFeatured" class="text-charcoal-300 dark:text-charcoal-700">-</span>
                          </td>
                          <td class="py-4 px-6">
                            <span class="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                                  [class.bg-green-100]="p.isActive" [class.text-green-700]="p.isActive"
                                  [class.bg-red-100]="!p.isActive" [class.text-red-700]="!p.isActive">
                              {{ p.isActive ? 'Aktif' : 'Nonaktif' }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right space-x-2">
                            <app-button variant="ghost" (onClick)="openProductModal(p)">Edit</app-button>
                            <app-button variant="danger" (onClick)="deleteProduct(p)">Hapus</app-button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          <!-- TAB 3: CATEGORIES -->
          @if (activeTab() === 'categories') {
            <div class="space-y-6 animate-fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Kategori Produk</h3>
                  <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Kelola koleksi dan pengelompokan</p>
                </div>
                <app-button (onClick)="openCategoryModal()">+ Tambah Kategori Baru</app-button>
              </div>

              <!-- Categories Listing Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @for (c of categories(); track c.id) {
                  <div appGlassmorphism [appGlassmorphismShadow]="false"
                       class="p-6 rounded-xl border shadow-premium flex flex-col justify-between h-48 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-corn-400"></div>
                    <div class="space-y-2">
                      <h4 class="text-lg font-display font-extrabold text-charcoal-800 dark:text-white">{{ c.name }}</h4>
                      <span class="block text-[10px] text-corn-500 font-extrabold uppercase tracking-widest">slug: {{ c.slug }}</span>
                      <p class="text-xs text-charcoal-400 font-medium leading-relaxed mt-1">{{ c.description || 'Tidak ada deskripsi' }}</p>
                    </div>
                    <div class="flex justify-end gap-3 pt-4 border-t border-charcoal-100 dark:border-charcoal-900">
                      <app-button variant="ghost" (onClick)="openCategoryModal(c)">Edit</app-button>
                      <app-button variant="danger" (onClick)="deleteCategory(c.id)">Hapus</app-button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- TAB 4: ORDERS -->
          @if (activeTab() === 'orders') {
            <div class="space-y-6 animate-fade-in">
              <div>
                <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Kokpit Pesanan</h3>
                <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Lacak transaksi, perbarui status, dan input resi</p>
              </div>

              <!-- Orders Cockpit Grid -->
              <div appGlassmorphism [appGlassmorphismShadow]="false"
                   class="rounded-xl border shadow-premium overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900 bg-charcoal-50 dark:bg-charcoal-900/50">
                        <th class="text-left py-4 px-6">No. Invoice</th>
                        <th class="text-left py-4 px-6">Pelanggan</th>
                        <th class="text-left py-4 px-6">Total Pesanan</th>
                        <th class="text-left py-4 px-6">Resi / Kurir</th>
                        <th class="text-left py-4 px-6">Status Pesanan</th>
                        <th class="text-right py-4 px-6">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (o of orders(); track o.id) {
                        <tr class="border-b border-charcoal-100 dark:border-charcoal-900 hover:bg-charcoal-50 dark:hover:bg-charcoal-900/20 transition-all font-medium">
                          <td class="py-4 px-6 font-bold text-charcoal-800 dark:text-white uppercase tracking-wider text-xs">{{ o.orderNumber }}</td>
                          <td class="py-4 px-6">{{ o.user?.fullName }}</td>
                          <td class="py-4 px-6 font-bold">Rp {{ o.total.toLocaleString('id-ID') }}</td>
                          <td class="py-4 px-6">
                            @if (o.trackingNumber) {
                              <span class="px-2.5 py-0.5 rounded bg-charcoal-200 dark:bg-charcoal-800 text-[10px] font-bold uppercase tracking-wider text-charcoal-600 dark:text-charcoal-400">
                                {{ o.courierName }} - {{ o.trackingNumber }}
                              </span>
                            } @else {
                              <span class="text-xs text-charcoal-400 italic">Belum ada resi</span>
                            }
                          </td>
                          <td class="py-4 px-6">
                            <span class="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                                  [class.bg-green-100]="o.status === 'paid' || o.status === 'delivered'"
                                  [class.text-green-700]="o.status === 'paid' || o.status === 'delivered'"
                                  [class.bg-yellow-100]="o.status === 'pending' || o.status === 'waiting_payment'"
                                  [class.text-yellow-700]="o.status === 'pending' || o.status === 'waiting_payment'">
                              {{ o.status }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right space-x-2 shrink-0">
                            <!-- Update Status Trigger -->
                            <app-select [(ngModel)]="o.status" (ngModelChange)="updateOrderStatus(o.id, $event)">
                              <option value="pending">Menunggu</option>
                              <option value="waiting_payment">Menunggu Pembayaran</option>
                              <option value="paid">Dibayar</option>
                              <option value="processing">Diproses</option>
                              <option value="shipped">Dikirim</option>
                              <option value="delivered">Terkirim</option>
                              <option value="cancelled">Dibatalkan</option>
                            </app-select>

                            <app-button variant="ghost" (onClick)="openResiModal(o)">Resi</app-button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          <!-- TAB 5: CUSTOMERS -->
          @if (activeTab() === 'customers') {
            <div class="space-y-6 animate-fade-in">
              <div>
                <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Pelanggan</h3>
                <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Direktori pelanggan dan status blokir</p>
              </div>

              <div appGlassmorphism [appGlassmorphismShadow]="false"
                   class="rounded-xl border shadow-premium overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900 bg-charcoal-50 dark:bg-charcoal-900/50">
                        <th class="text-left py-4 px-6">Nama</th>
                        <th class="text-left py-4 px-6">Email</th>
                        <th class="text-left py-4 px-6">No. Telepon</th>
                        <th class="text-left py-4 px-6">Tanggal Daftar</th>
                        <th class="text-left py-4 px-6">Status</th>
                        <th class="text-right py-4 px-6">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (cust of customers(); track cust.id) {
                        <tr class="border-b border-charcoal-100 dark:border-charcoal-900 hover:bg-charcoal-50 dark:hover:bg-charcoal-900/20 transition-all font-medium">
                          <td class="py-4 px-6 font-bold text-charcoal-800 dark:text-white">{{ cust.fullName }}</td>
                          <td class="py-4 px-6 text-charcoal-500">{{ cust.email }}</td>
                          <td class="py-4 px-6 text-charcoal-500">{{ cust.phone || '-' }}</td>
                          <td class="py-4 px-6">{{ cust.createdAt | date:'dd MMM yyyy, HH:mm' }}</td>
                          <td class="py-4 px-6">
                            <span class="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                                  [class.bg-green-100]="cust.isActive" [class.text-green-700]="cust.isActive"
                                  [class.bg-red-100]="!cust.isActive" [class.text-red-700]="!cust.isActive">
                              {{ cust.isActive ? 'Aktif' : 'Diblokir' }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right">
                            <app-button [variant]="cust.isActive ? 'danger' : 'primary'" (onClick)="toggleCustomerStatus(cust)">
                              {{ cust.isActive ? 'Blokir Pengguna' : 'Aktifkan Pengguna' }}
                            </app-button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          <!-- TAB 6: SETTINGS -->
          @if (activeTab() === 'settings') {
            <div class="space-y-6 animate-fade-in max-w-2xl">
              <div>
                <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Pengaturan Bisnis</h3>
                <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Konfigurasi parameter sistem secara global</p>
              </div>

              <div appGlassmorphism [appGlassmorphismShadow]="false"
                   class="p-8 rounded-xl border shadow-premium space-y-6">
                
                <form (submit)="saveSettings()" class="space-y-6 text-sm font-medium">
                  @for (s of settings(); track s.id) {
                    <app-input [label]="s.key" type="text" [(ngModel)]="settingsPayload[s.key]" [name]="s.key" [required]="true" />
                  }

                  <div class="pt-4 flex justify-end">
                    <app-button type="submit">Simpan Semua Pengaturan</app-button>
                  </div>
                </form>
              </div>
            </div>
          }

          <!-- TAB 7: BANNERS -->
          @if (activeTab() === 'banners') {
            <div class="space-y-6 animate-fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Banner Pemasaran</h3>
                  <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Kelola banner hero carousel dan penempatan slide</p>
                </div>
                <app-button (onClick)="openBannerModal()">+ Tambah Banner Baru</app-button>
              </div>

              <div appGlassmorphism [appGlassmorphismShadow]="false"
                   class="rounded-xl border shadow-premium overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900 bg-charcoal-50 dark:bg-charcoal-900/50">
                        <th class="text-left py-4 px-6">Gambar</th>
                        <th class="text-left py-4 px-6">Judul & Subjudul</th>
                        <th class="text-left py-4 px-6">URL Tautan</th>
                        <th class="text-left py-4 px-6">Urutan</th>
                        <th class="text-left py-4 px-6">Status</th>
                        <th class="text-right py-4 px-6">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (b of banners(); track b.id) {
                        <tr class="border-b border-charcoal-100 dark:border-charcoal-900 hover:bg-charcoal-50 dark:hover:bg-charcoal-900/20 transition-all font-medium">
                          <td class="py-4 px-6">
                            <img [src]="b.imageUrl || b.image_url" [alt]="b.title" class="w-20 h-10 object-cover rounded-xl bg-charcoal-100 dark:bg-charcoal-800" />
                          </td>
                          <td class="py-4 px-6">
                            <div class="font-bold text-charcoal-800 dark:text-white">{{ b.title }}</div>
                            <div class="text-[10px] text-charcoal-400 font-semibold">{{ b.subtitle || '-' }}</div>
                          </td>
                          <td class="py-4 px-6 text-charcoal-500 font-mono text-xs">{{ b.linkUrl || b.link_url || '-' }}</td>
                          <td class="py-4 px-6">{{ b.sortOrder || b.sort_order || 0 }}</td>
                          <td class="py-4 px-6">
                            <span class="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                                  [class.bg-green-100]="b.isActive" [class.text-green-700]="b.isActive"
                                  [class.bg-red-100]="!b.isActive" [class.text-red-700]="!b.isActive">
                              {{ b.isActive ? 'Aktif' : 'Nonaktif' }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right space-x-2">
                            <app-button variant="ghost" (onClick)="openBannerModal(b)">Edit</app-button>
                            <app-button variant="danger" (onClick)="deleteBanner(b.id)">Hapus</app-button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

          <!-- TAB 8: INSTAGRAM GALLERY -->
          @if (activeTab() === 'instagram') {
            <div class="space-y-6 animate-fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Galeri Feed Instagram</h3>
                  <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Kelola kartu galeri Instagram kustom tanpa API</p>
                </div>
                <app-button (onClick)="openInstagramModal()">+ Tambah Kartu Instagram</app-button>
              </div>

              <!-- Instagram Cards responsive modern grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                @for (post of instagramPosts(); track post.id) {
                  <div [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850' : 'border-charcoal-150'"
                       appGlassmorphism [appGlassmorphismShadow]="false"
                       class="rounded-xl border shadow-premium overflow-hidden flex flex-col justify-between h-96 relative group">
                    
                    <div class="relative overflow-hidden aspect-square h-48 bg-charcoal-100 dark:bg-charcoal-900">
                      <img [src]="post.imageUrl || post.image_url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                        #{{ post.sortOrder || post.sort_order || 0 }}
                      </span>
                    </div>

                    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div class="space-y-1">
                        <div class="text-[10px] text-corn-500 font-extrabold uppercase tracking-widest">Keterangan & Detail</div>
                        <p class="text-xs text-charcoal-600 dark:text-charcoal-350 line-clamp-3 font-medium leading-relaxed">
                          {{ post.caption || 'Tidak ada keterangan' }}
                        </p>
                        <a [href]="post.postUrl || post.post_url" target="_blank" class="block text-[10px] font-mono text-blue-500 hover:underline truncate mt-1">
                          🔗 Link: {{ post.postUrl || post.post_url }}
                        </a>
                      </div>

                      <div class="flex items-center justify-between pt-3 border-t border-charcoal-100 dark:border-charcoal-900 text-xs">
                        <span class="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                              [class.bg-green-100]="post.isActive" [class.text-green-700]="post.isActive"
                              [class.bg-red-100]="!post.isActive" [class.text-red-700]="!post.isActive">
                          {{ post.isActive ? 'Aktif' : 'Tersembunyi' }}
                        </span>
                        
                        <div class="flex gap-2">
                          <app-button variant="ghost" (onClick)="openInstagramModal(post)">Edit</app-button>
                          <app-button variant="danger" (onClick)="deleteInstagramPost(post.id)">Hapus</app-button>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- TAB 9: COUPONS -->
          @if (activeTab() === 'coupons') {
            <div class="space-y-6 animate-fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Kupon Diskon</h3>
                  <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Kelola kode promosi, batas, dan limit kupon</p>
                </div>
                <app-button (onClick)="openCouponModal()">+ Tambah Kupon Baru</app-button>
              </div>

              <div appGlassmorphism [appGlassmorphismShadow]="false"
                   class="rounded-xl border shadow-premium overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900 bg-charcoal-50 dark:bg-charcoal-900/50">
                        <th class="text-left py-4 px-6">Kode Kupon</th>
                        <th class="text-left py-4 px-6">Tipe</th>
                        <th class="text-left py-4 px-6">Nilai Diskon</th>
                        <th class="text-left py-4 px-6">Min. Pembelian</th>
                        <th class="text-left py-4 px-6">Penggunaan / Batas</th>
                        <th class="text-left py-4 px-6">Status</th>
                        <th class="text-right py-4 px-6">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (c of coupons(); track c.id) {
                        <tr class="border-b border-charcoal-100 dark:border-charcoal-900 hover:bg-charcoal-50 dark:hover:bg-charcoal-900/20 transition-all font-medium">
                          <td class="py-4 px-6 font-mono font-bold text-charcoal-800 dark:text-white uppercase tracking-wider">{{ c.code }}</td>
                          <td class="py-4 px-6 capitalize">{{ c.type }}</td>
                          <td class="py-4 px-6 font-extrabold text-charcoal-850 dark:text-white">
                            {{ c.type === 'percentage' ? c.value + '%' : 'Rp ' + formatIdr(c.value) }}
                          </td>
                          <td class="py-4 px-6">Rp {{ formatIdr(c.minPurchase || c.min_purchase || 0) }}</td>
                          <td class="py-4 px-6">
                            {{ c.usedCount || c.used_count || 0 }} / {{ c.usageLimit || c.usage_limit || '∞' }}
                          </td>
                          <td class="py-4 px-6">
                            <span class="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                                  [class.bg-green-100]="c.isActive" [class.text-green-700]="c.isActive"
                                  [class.bg-red-100]="!c.isActive" [class.text-red-700]="!c.isActive">
                              {{ c.isActive ? 'Aktif' : 'Nonaktif' }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right space-x-2">
                            <app-button variant="ghost" (onClick)="openCouponModal(c)">Edit</app-button>
                            <app-button variant="danger" (onClick)="deleteCoupon(c.id)">Hapus</app-button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }

        }
      </main>

      <!-- Resi Airwaybill Input Modal -->
      <app-dialog [open]="resiModalVisible()" title="Input Resi" (onClose)="closeResiModal()">
        <div class="space-y-4 text-sm font-medium">
          <app-input label="Nama Kurir" placeholder="cth. JNE" [(ngModel)]="resiData.courierName" />
          <app-input label="Layanan Kurir" placeholder="cth. REG" [(ngModel)]="resiData.courierService" />
          <app-input label="No. Resi" placeholder="cth. JT123456789" [(ngModel)]="resiData.trackingNumber" />
        </div>
        <div class="flex items-center gap-4 justify-between pt-2">
          <app-button variant="outline" (onClick)="closeResiModal()">Batal</app-button>
          <app-button (onClick)="saveResi()">Simpan Resi</app-button>
        </div>
      </app-dialog>

      <!-- CATEGORY ADD/EDIT MODAL -->
      <app-dialog [open]="categoryModalVisible()" [title]="categoryData.id ? 'Edit Kategori' : 'Tambah Kategori Baru'" (onClose)="closeCategoryModal()">
        <div class="space-y-4 text-sm font-medium">
          <app-input label="Nama Kategori" placeholder="cth. Spicy Lava" [(ngModel)]="categoryData.name" />
          <app-textarea label="Deskripsi" placeholder="Deskripsi singkat..." [(ngModel)]="categoryData.description" [rows]="2" />
        </div>
        <div class="flex items-center gap-4 justify-between pt-2">
          <app-button variant="outline" (onClick)="closeCategoryModal()">Batal</app-button>
          <app-button (onClick)="saveCategory()">Simpan</app-button>
        </div>
      </app-dialog>

      <!-- PRODUCT ADD/EDIT MODAL -->
      <app-dialog [open]="productModalVisible()" [title]="productData.id ? 'Edit Produk' : 'Tambah Produk Baru'" size="lg" (onClose)="closeProductModal()">
        <div class="space-y-4 text-xs font-semibold">
          <div class="grid grid-cols-2 gap-4">
            <app-input label="Nama Produk" placeholder="cth. Honey Butter" [(ngModel)]="productData.name" />
            <app-input label="Harga (Rp)" type="number" placeholder="25000" [(ngModel)]="productData.price" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <app-input label="Jumlah Stok" type="number" placeholder="100" [(ngModel)]="productData.quantity" />
            <div class="flex items-center gap-4 pt-8">
              <label class="flex items-center gap-2 text-xs font-semibold text-charcoal-800 dark:text-white cursor-pointer select-none">
                <input type="checkbox" [(ngModel)]="productData.isFeatured" class="w-4 h-4 accent-corn-400" />
                Unggulan
              </label>
              <label class="flex items-center gap-2 text-xs font-semibold text-charcoal-800 dark:text-white cursor-pointer select-none">
                <input type="checkbox" [(ngModel)]="productData.isActive" class="w-4 h-4 accent-corn-400" />
                Aktif
              </label>
            </div>
          </div>

          <app-textarea label="Deskripsi" placeholder="Detail produk, catatan, properti bahan..." [(ngModel)]="productData.description" [rows]="3" />

          <!-- Image File Upload section -->
          <div>
            <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Unggah Gambar Produk</label>
            <input type="file" (change)="onImageFileSelected($event)" accept="image/*"
                   [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                   class="w-full px-5 py-3 rounded-md border bg-transparent focus:outline-none focus:border-corn-400 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-corn-400 file:text-charcoal-900 hover:file:bg-corn-500 cursor-pointer" />
            @if (imageUploadProgress()) {
              <span class="block text-[10px] text-corn-500 font-bold mt-2 animate-pulse">⌛ Sedang mengunggah gambar...</span>
            }
          </div>
        </div>

        <div class="flex items-center gap-4 justify-between pt-2">
          <app-button variant="outline" (onClick)="closeProductModal()">Batal</app-button>
          <app-button (onClick)="saveProduct()" [disabled]="imageUploadProgress()">Simpan</app-button>
        </div>
      </app-dialog>

      <!-- BANNER ADD/EDIT MODAL -->
      <app-dialog [open]="bannerModalVisible()" [title]="bannerData.id ? 'Edit Banner' : 'Tambah Banner Baru'" (onClose)="closeBannerModal()">
        <div class="space-y-4 text-xs font-semibold">
          <app-input label="Judul Banner" placeholder="cth. Premium Popcorn" [(ngModel)]="bannerData.title" />
          <app-input label="Subjudul" placeholder="cth. Gratis ongkir dalam Jawa!" [(ngModel)]="bannerData.subtitle" />
          <app-input label="URL Gambar Banner" placeholder="cth. https://images.unsplash.com/..." [(ngModel)]="bannerData.imageUrl" />
          <app-input label="URL Gambar Mobile (Opsional)" placeholder="cth. https://images.unsplash.com/..." [(ngModel)]="bannerData.mobileImageUrl" />
          <app-input label="URL Tautan" placeholder="cth. /produk/honey-butter" [(ngModel)]="bannerData.linkUrl" />
          <div class="grid grid-cols-2 gap-4">
            <app-input label="Urutan" type="number" placeholder="0" [(ngModel)]="bannerData.sortOrder" />
            <div class="flex items-center gap-2 pt-8 select-none">
              <label class="flex items-center gap-2 text-xs font-semibold text-charcoal-800 dark:text-white cursor-pointer">
                <input type="checkbox" [(ngModel)]="bannerData.isActive" class="w-4 h-4 accent-corn-400" />
                Banner Aktif
              </label>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 justify-between pt-2">
          <app-button variant="outline" (onClick)="closeBannerModal()">Batal</app-button>
          <app-button (onClick)="saveBanner()">Simpan</app-button>
        </div>
      </app-dialog>

      <!-- INSTAGRAM CARD ADD/EDIT MODAL -->
      <app-dialog [open]="instagramModalVisible()" [title]="instagramData.id ? 'Edit Kartu Instagram' : 'Tambah Kartu Instagram'" (onClose)="closeInstagramModal()">
        <div class="space-y-4 text-xs font-semibold">
          <app-input label="URL Foto Instagram" placeholder="cth. https://images.unsplash.com/..." [(ngModel)]="instagramData.imageUrl" />
          <app-input label="URL Postingan Instagram (Redirect)" placeholder="cth. https://www.instagram.com/p/..." [(ngModel)]="instagramData.postUrl" />
          <app-textarea label="Caption Text" placeholder="Detail, tag merek..." [(ngModel)]="instagramData.caption" [rows]="3" />
          <div class="grid grid-cols-2 gap-4">
            <app-input label="Urutan" type="number" placeholder="0" [(ngModel)]="instagramData.sortOrder" />
            <div class="flex items-center gap-2 pt-8 select-none">
              <label class="flex items-center gap-2 text-xs font-semibold text-charcoal-800 dark:text-white cursor-pointer">
                <input type="checkbox" [(ngModel)]="instagramData.isActive" class="w-4 h-4 accent-corn-400" />
                Tampil di Feed
              </label>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 justify-between pt-2">
          <app-button variant="outline" (onClick)="closeInstagramModal()">Batal</app-button>
          <app-button (onClick)="saveInstagramPost()">Simpan</app-button>
        </div>
      </app-dialog>

      <!-- COUPON ADD/EDIT MODAL -->
      <app-dialog [open]="couponModalVisible()" [title]="couponData.id ? 'Edit Kupon' : 'Tambah Kupon Baru'" (onClose)="closeCouponModal()">
        <div class="space-y-4 text-xs font-semibold">
          <div class="grid grid-cols-2 gap-4">
            <app-input label="Kode Kupon" placeholder="FITCORN10" [(ngModel)]="couponData.code" />
            <app-select label="Tipe Diskon" [(ngModel)]="couponData.type">
              <option value="percentage">Persentase (%)</option>
              <option value="fixed">Nominal Tetap (Rp)</option>
            </app-select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <app-input label="Nilai Diskon" type="number" placeholder="10" [(ngModel)]="couponData.value" />
            <app-input label="Min. Pembelian (Rp)" type="number" placeholder="0" [(ngModel)]="couponData.minPurchase" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <app-input label="Maks. Diskon (Rp)" type="number" placeholder="Batas opsional" [(ngModel)]="couponData.maxDiscount" />
            <app-input label="Batas Penggunaan" type="number" placeholder="Maks. penebusan opsional" [(ngModel)]="couponData.usageLimit" />
          </div>

          <div class="flex items-center gap-2 pt-4 select-none">
            <label class="flex items-center gap-2 text-xs font-semibold text-charcoal-800 dark:text-white cursor-pointer">
              <input type="checkbox" [(ngModel)]="couponData.isActive" class="w-4 h-4 accent-corn-400" />
              Kupon Aktif
            </label>
          </div>
        </div>

        <div class="flex items-center gap-4 justify-between pt-2">
          <app-button variant="outline" (onClick)="closeCouponModal()">Batal</app-button>
          <app-button (onClick)="saveCoupon()">Simpan</app-button>
        </div>
      </app-dialog>

    </div>
  `,
  styles: []
})
export class AdminComponent implements OnInit {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  private adminService = inject(AdminService);
  private productsService = inject(ProductsService);
  private modalService = inject(ModalService);

  activeTab = signal<'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'settings' | 'banners' | 'instagram' | 'coupons'>('dashboard');
  loading = signal<boolean>(true);

  // States Datasets
  stats = signal<any | null>(null);
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  orders = signal<any[]>([]);
  customers = signal<any[]>([]);
  settings = signal<any[]>([]);
  banners = signal<any[]>([]);
  instagramPosts = signal<any[]>([]);
  coupons = signal<any[]>([]);

  // Modals States
  resiModalVisible = signal(false);
  resiData = { orderId: '', courierName: '', courierService: '', trackingNumber: '' };

  categoryModalVisible = signal(false);
  categoryData = { id: 0, name: '', description: '' };

  productModalVisible = signal(false);
  productData = { id: '', name: '', price: 25000, quantity: 100, description: '', isFeatured: false, isActive: true };
  selectedImageFile: File | null = null;
  imageUploadProgress = signal(false);

  bannerModalVisible = signal(false);
  bannerData = { id: 0, title: '', subtitle: '', imageUrl: '', mobileImageUrl: '', linkUrl: '', sortOrder: 0, isActive: true };

  instagramModalVisible = signal(false);
  instagramData = { id: 0, imageUrl: '', caption: '', postUrl: '', sortOrder: 0, isActive: true };

  couponModalVisible = signal(false);
  couponData = { id: 0, code: '', type: 'percentage', value: 10, minPurchase: 0, maxDiscount: null as number | null, usageLimit: null as number | null, isActive: true };

  // Bulk Settings Save Payload
  settingsPayload: { [key: string]: string } = {};

  // Table column configs (for reference when using <app-table>)
  protected productColumns: TableColumn[] = [
    { key: 'name', label: 'Nama Produk', sortable: true },
    { key: 'category', label: 'Kategori' },
    { key: 'price', label: 'Harga', align: 'right' },
    { key: 'stock', label: 'Stok', align: 'center' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Aksi', align: 'center' },
  ];

  protected orderColumns: TableColumn[] = [
    { key: 'orderNumber', label: 'Invoice', sortable: true },
    { key: 'customer', label: 'Pelanggan' },
    { key: 'total', label: 'Total', align: 'right' },
    { key: 'status', label: 'Status' },
    { key: 'resi', label: 'Resi' },
    { key: 'date', label: 'Tanggal', sortable: true },
    { key: 'actions', label: 'Aksi', align: 'center' },
  ];

  protected customerColumns: TableColumn[] = [
    { key: 'fullName', label: 'Nama', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Telepon' },
    { key: 'status', label: 'Status' },
    { key: 'registered', label: 'Terdaftar', sortable: true },
    { key: 'actions', label: 'Aksi', align: 'center' },
  ];

  protected bannerColumns: TableColumn[] = [
    { key: 'image', label: 'Gambar' },
    { key: 'title', label: 'Judul' },
    { key: 'link', label: 'Tautan' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Aksi', align: 'center' },
  ];

  protected couponColumns: TableColumn[] = [
    { key: 'code', label: 'Kode', sortable: true },
    { key: 'discount', label: 'Diskon', align: 'right' },
    { key: 'minPurchase', label: 'Min. Pembelian', align: 'right' },
    { key: 'usage', label: 'Penggunaan', align: 'center' },
    { key: 'expires', label: 'Berakhir', sortable: true },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Aksi', align: 'center' },
  ];

  ngOnInit() {
    this.loadActiveTabDataset();
  }

  setTab(tab: 'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'settings' | 'banners' | 'instagram' | 'coupons') {
    this.activeTab.set(tab);
    this.loadActiveTabDataset();
  }

  loadActiveTabDataset() {
    this.loading.set(true);
    const tab = this.activeTab();

    if (tab === 'dashboard') {
      this.adminService.getDashboardStats().subscribe({
        next: (res) => {
          this.stats.set(res);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (tab === 'products') {
      this.productsService.getAdminProducts({ page: 1, limit: 100 }).subscribe({
        next: (res) => {
          this.products.set(res.data || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (tab === 'categories') {
      this.adminService.getCategories().subscribe({
        next: (res) => {
          this.categories.set(res || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (tab === 'orders') {
      this.adminService.getOrders().subscribe({
        next: (res) => {
          this.orders.set(res || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (tab === 'customers') {
      this.adminService.getCustomers({ limit: 100 }).subscribe({
        next: (res) => {
          this.customers.set(res.data || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (tab === 'settings') {
      this.adminService.getSettings().subscribe({
        next: (res) => {
          this.settings.set(res || []);
          // Populate bulk settings input model values
          this.settingsPayload = {};
          (res || []).forEach(s => {
            this.settingsPayload[s.key] = s.value;
          });
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (tab === 'banners') {
      this.adminService.getBanners().subscribe({
        next: (res) => {
          this.banners.set(res || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (tab === 'instagram') {
      this.adminService.getInstagramPosts().subscribe({
        next: (res) => {
          this.instagramPosts.set(res || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (tab === 'coupons') {
      this.adminService.getCoupons().subscribe({
        next: (res) => {
          this.coupons.set(res || []);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  formatIdr(value: any): string {
    const num = Number(value);
    return isNaN(num) ? '0' : num.toLocaleString('id-ID');
  }

  getBarHeightPercentage(revenue: number): number {
    if (!this.stats()?.salesAnalytics) return 0;
    const maxRevenue = Math.max(...this.stats().salesAnalytics.map((day: any) => day.revenue), 1);
    return (revenue / maxRevenue) * 100;
  }


  // ============ RESI AIRWAYBILL MODAL ============
  openResiModal(order: any) {
    this.resiData = {
      orderId: order.id,
      courierName: order.courierName || '',
      courierService: order.courierService || '',
      trackingNumber: order.trackingNumber || ''
    };
    this.resiModalVisible.set(true);
  }

  closeResiModal() {
    this.resiModalVisible.set(false);
  }

  saveResi() {
    if (!this.resiData.courierName || !this.resiData.trackingNumber) {
      alert('Nama kurir dan nomor resi wajib diisi.');
      return;
    }

    this.adminService.inputTrackingNumber(this.resiData.orderId, this.resiData).subscribe({
      next: () => {
        this.resiModalVisible.set(false);
        this.loadActiveTabDataset(); // Reload orders list
      },
      error: (err) => console.error('Failed to save resi airwaybill', err)
    });
  }

  updateOrderStatus(orderId: string, status: string) {
    this.adminService.updateOrderStatus(orderId, status).subscribe({
      next: () => this.loadActiveTabDataset(),
      error: (err) => console.error('Failed to update status', err)
    });
  }

  // ============ CATEGORY ADD/EDIT MODAL ============
  openCategoryModal(cat?: any) {
    if (cat) {
      this.categoryData = { id: cat.id, name: cat.name, description: cat.description || '' };
    } else {
      this.categoryData = { id: 0, name: '', description: '' };
    }
    this.categoryModalVisible.set(true);
  }

  closeCategoryModal() {
    this.categoryModalVisible.set(false);
  }

  saveCategory() {
    if (!this.categoryData.name) return;

    if (this.categoryData.id) {
      this.adminService.updateCategory(this.categoryData.id, this.categoryData).subscribe({
        next: () => {
          this.categoryModalVisible.set(false);
          this.loadActiveTabDataset();
        }
      });
    } else {
      this.adminService.createCategory(this.categoryData).subscribe({
        next: () => {
          this.categoryModalVisible.set(false);
          this.loadActiveTabDataset();
        }
      });
    }
  }

  deleteCategory(id: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    this.adminService.deleteCategory(id).subscribe({
      next: () => this.loadActiveTabDataset()
    });
  }

  // ============ CUSTOMERS STATUS ============
  toggleCustomerStatus(cust: any) {
    const nextStatus = !cust.isActive;
    this.adminService.updateCustomerStatus(cust.id, nextStatus).subscribe({
      next: () => this.loadActiveTabDataset(),
      error: (err) => console.error('Failed to change customer status', err)
    });
  }

  // ============ SYSTEM SETTINGS BULK SAVE ============
  saveSettings() {
    this.adminService.updateSettings(this.settingsPayload).subscribe({
      next: () => alert('Semua pengaturan berhasil disimpan!'),
      error: (err) => console.error('Failed to bulk save settings', err)
    });
  }

  // ============ PRODUCTS CRUD MODAL & IMAGE UPLOAD ============
  openProductModal(prod?: any) {
    this.selectedImageFile = null;
    if (prod) {
      this.productData = {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: prod.inventory?.quantity || 0,
        description: prod.description || '',
        isFeatured: prod.isFeatured || false,
        isActive: prod.isActive !== false
      };
    } else {
      this.productData = {
        id: '',
        name: '',
        price: 25000,
        quantity: 100,
        description: '',
        isFeatured: false,
        isActive: true
      };
    }
    this.productModalVisible.set(true);
  }

  closeProductModal() {
    this.productModalVisible.set(false);
  }

  onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  saveProduct() {
    if (!this.productData.name || !this.productData.price) return;

    this.imageUploadProgress.set(false);

    if (this.productData.id) {
      // Edit Product
      this.productsService.updateProduct(this.productData.id, this.productData).subscribe({
        next: (savedProd) => {
          if (this.selectedImageFile) {
            this.uploadImage(savedProd.id);
          } else {
            this.productModalVisible.set(false);
            this.loadActiveTabDataset();
          }
        }
      });
    } else {
      // Add Product
      this.productsService.createProduct(this.productData).subscribe({
        next: (savedProd) => {
          if (this.selectedImageFile) {
            this.uploadImage(savedProd.id);
          } else {
            this.productModalVisible.set(false);
            this.loadActiveTabDataset();
          }
        }
      });
    }
  }

  uploadImage(productId: string) {
    if (!this.selectedImageFile) return;

    this.imageUploadProgress.set(true);
    this.adminService.uploadProductImage(productId, this.selectedImageFile).subscribe({
      next: () => {
        this.imageUploadProgress.set(false);
        this.productModalVisible.set(false);
        this.loadActiveTabDataset();
      },
      error: (err) => {
        console.error('Failed to upload image', err);
        this.imageUploadProgress.set(false);
        this.productModalVisible.set(false);
        this.loadActiveTabDataset();
      }
    });
  }

  deleteProduct(prod: any) {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${prod.name}"?`)) return;
    this.productsService.deleteProduct(prod.id).subscribe({
      next: () => this.loadActiveTabDataset()
    });
  }

  // ============ BANNERS CRUD ============
  openBannerModal(banner?: any) {
    if (banner) {
      this.bannerData = {
        id: banner.id,
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        imageUrl: banner.imageUrl || banner.image_url || '',
        mobileImageUrl: banner.mobileImageUrl || banner.mobile_image_url || '',
        linkUrl: banner.linkUrl || banner.link_url || '',
        sortOrder: banner.sortOrder || banner.sort_order || 0,
        isActive: banner.isActive !== false
      };
    } else {
      this.bannerData = { id: 0, title: '', subtitle: '', imageUrl: '', mobileImageUrl: '', linkUrl: '', sortOrder: 0, isActive: true };
    }
    this.bannerModalVisible.set(true);
  }

  closeBannerModal() {
    this.bannerModalVisible.set(false);
  }

  saveBanner() {
    if (!this.bannerData.title || !this.bannerData.imageUrl) {
      alert('Judul dan URL gambar wajib diisi.');
      return;
    }

    const payload = {
      title: this.bannerData.title,
      subtitle: this.bannerData.subtitle,
      image_url: this.bannerData.imageUrl,
      imageUrl: this.bannerData.imageUrl,
      mobile_image_url: this.bannerData.mobileImageUrl || null,
      mobileImageUrl: this.bannerData.mobileImageUrl || null,
      link_url: this.bannerData.linkUrl || null,
      linkUrl: this.bannerData.linkUrl || null,
      sort_order: this.bannerData.sortOrder,
      sortOrder: this.bannerData.sortOrder,
      is_active: this.bannerData.isActive,
      isActive: this.bannerData.isActive
    };

    if (this.bannerData.id) {
      this.adminService.updateBanner(this.bannerData.id, payload).subscribe({
        next: () => {
          this.bannerModalVisible.set(false);
          this.loadActiveTabDataset();
        },
        error: (err) => console.error('Failed to update banner', err)
      });
    } else {
      this.adminService.createBanner(payload).subscribe({
        next: () => {
          this.bannerModalVisible.set(false);
          this.loadActiveTabDataset();
        },
        error: (err) => console.error('Failed to create banner', err)
      });
    }
  }

  deleteBanner(id: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus banner ini?')) return;
    this.adminService.deleteBanner(id).subscribe({
      next: () => this.loadActiveTabDataset(),
      error: (err) => console.error('Failed to delete banner', err)
    });
  }

  // ============ INSTAGRAM GALLERY CRUD ============
  openInstagramModal(post?: any) {
    if (post) {
      this.instagramData = {
        id: post.id,
        imageUrl: post.imageUrl || post.image_url || '',
        caption: post.caption || '',
        postUrl: post.postUrl || post.post_url || '',
        sortOrder: post.sortOrder || post.sort_order || 0,
        isActive: post.isActive !== false
      };
    } else {
      this.instagramData = { id: 0, imageUrl: '', caption: '', postUrl: '', sortOrder: 0, isActive: true };
    }
    this.instagramModalVisible.set(true);
  }

  closeInstagramModal() {
    this.instagramModalVisible.set(false);
  }

  saveInstagramPost() {
    if (!this.instagramData.imageUrl || !this.instagramData.postUrl) {
      alert('URL gambar dan URL postingan wajib diisi.');
      return;
    }

    const payload = {
      image_url: this.instagramData.imageUrl,
      imageUrl: this.instagramData.imageUrl,
      caption: this.instagramData.caption || null,
      post_url: this.instagramData.postUrl,
      postUrl: this.instagramData.postUrl,
      sort_order: this.instagramData.sortOrder,
      sortOrder: this.instagramData.sortOrder,
      is_active: this.instagramData.isActive,
      isActive: this.instagramData.isActive
    };

    if (this.instagramData.id) {
      this.adminService.updateInstagramPost(this.instagramData.id, payload).subscribe({
        next: () => {
          this.instagramModalVisible.set(false);
          this.loadActiveTabDataset();
        },
        error: (err) => console.error('Failed to update Instagram post', err)
      });
    } else {
      this.adminService.createInstagramPost(payload).subscribe({
        next: () => {
          this.instagramModalVisible.set(false);
          this.loadActiveTabDataset();
        },
        error: (err) => console.error('Failed to create Instagram post', err)
      });
    }
  }

  deleteInstagramPost(id: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus postingan Instagram ini?')) return;
    this.adminService.deleteInstagramPost(id).subscribe({
      next: () => this.loadActiveTabDataset(),
      error: (err) => console.error('Failed to delete Instagram post', err)
    });
  }

  // ============ COUPONS CRUD ============
  openCouponModal(coupon?: any) {
    if (coupon) {
      this.couponData = {
        id: coupon.id,
        code: coupon.code || '',
        type: coupon.type || 'percentage',
        value: coupon.value ? Number(coupon.value) : 10,
        minPurchase: coupon.minPurchase ? Number(coupon.minPurchase) : 0,
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
        usageLimit: coupon.usageLimit ? Number(coupon.usageLimit) : null,
        isActive: coupon.isActive !== false
      };
    } else {
      this.couponData = { id: 0, code: '', type: 'percentage', value: 10, minPurchase: 0, maxDiscount: null, usageLimit: null, isActive: true };
    }
    this.couponModalVisible.set(true);
  }

  closeCouponModal() {
    this.couponModalVisible.set(false);
  }

  saveCoupon() {
    if (!this.couponData.code || !this.couponData.value) {
      alert('Kode kupon dan nilai diskon wajib diisi.');
      return;
    }

    const payload = {
      code: this.couponData.code.toUpperCase(),
      type: this.couponData.type,
      value: this.couponData.value,
      min_purchase: this.couponData.minPurchase || 0,
      minPurchase: this.couponData.minPurchase || 0,
      max_discount: this.couponData.maxDiscount || null,
      maxDiscount: this.couponData.maxDiscount || null,
      usage_limit: this.couponData.usageLimit || null,
      usageLimit: this.couponData.usageLimit || null,
      is_active: this.couponData.isActive,
      isActive: this.couponData.isActive
    };

    if (this.couponData.id) {
      this.adminService.updateCoupon(this.couponData.id, payload).subscribe({
        next: () => {
          this.couponModalVisible.set(false);
          this.loadActiveTabDataset();
        },
        error: (err) => console.error('Failed to update coupon', err)
      });
    } else {
      this.adminService.createCoupon(payload).subscribe({
        next: () => {
          this.couponModalVisible.set(false);
          this.loadActiveTabDataset();
        },
        error: (err) => console.error('Failed to create coupon', err)
      });
    }
  }

  deleteCoupon(id: number) {
    if (!confirm('Apakah Anda yakin ingin menghapus kupon ini?')) return;
    this.adminService.deleteCoupon(id).subscribe({
      next: () => this.loadActiveTabDataset(),
      error: (err) => console.error('Failed to delete coupon', err)
    });
  }
}
