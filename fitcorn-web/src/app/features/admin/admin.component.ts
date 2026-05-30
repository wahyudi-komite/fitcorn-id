import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductsService } from '../../core/services/products.service';
import { AdminService } from './admin.service';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen font-sans flex flex-col md:flex-row transition-colors duration-300 bg-white dark:bg-charcoal-950">
      
      <!-- 1. Sidebar -->
      <aside [ngClass]="themeService.theme() === 'dark' ? 'bg-charcoal-900 border-charcoal-850' : 'bg-charcoal-50 border-charcoal-100'"
             class="w-full md:w-64 border-r shrink-0 flex flex-col pt-24 pb-8 px-6 space-y-8 z-20 md:sticky md:top-0 md:h-screen no-print">
        
        <div>
          <h2 class="text-xl font-display font-extrabold text-charcoal-800 dark:text-white flex items-center gap-2">
            <span>🛡️</span> Admin Panel
          </h2>
          <p class="text-[10px] text-charcoal-400 font-semibold uppercase tracking-wider mt-1">FITCORN Cockpit</p>
        </div>

        <nav class="flex-1 flex flex-col gap-2 text-sm font-semibold">
          <button (click)="setTab('dashboard')"
                  [ngClass]="activeTab() === 'dashboard' ? 'bg-corn-400 text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-corn-500 hover:bg-corn-50 dark:hover:bg-charcoal-800'"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 cursor-pointer">
            <span>📊</span> Dashboard
          </button>
          <button (click)="setTab('products')"
                  [ngClass]="activeTab() === 'products' ? 'bg-corn-400 text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-corn-500 hover:bg-corn-50 dark:hover:bg-charcoal-800'"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 cursor-pointer">
            <span>🍿</span> Products CRUD
          </button>
          <button (click)="setTab('categories')"
                  [ngClass]="activeTab() === 'categories' ? 'bg-corn-400 text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-corn-500 hover:bg-corn-50 dark:hover:bg-charcoal-800'"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 cursor-pointer">
            <span>🏷️</span> Categories
          </button>
          <button (click)="setTab('orders')"
                  [ngClass]="activeTab() === 'orders' ? 'bg-corn-400 text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-corn-500 hover:bg-corn-50 dark:hover:bg-charcoal-800'"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 cursor-pointer">
            <span>📦</span> Orders Management
          </button>
          <button (click)="setTab('customers')"
                  [ngClass]="activeTab() === 'customers' ? 'bg-corn-400 text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-corn-500 hover:bg-corn-50 dark:hover:bg-charcoal-800'"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 cursor-pointer">
            <span>👥</span> Customers
          </button>
          <button (click)="setTab('settings')"
                  [ngClass]="activeTab() === 'settings' ? 'bg-corn-400 text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-corn-500 hover:bg-corn-50 dark:hover:bg-charcoal-800'"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 cursor-pointer">
            <span>⚙️</span> Settings
          </button>
          <button (click)="setTab('banners')"
                  [ngClass]="activeTab() === 'banners' ? 'bg-corn-400 text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-corn-500 hover:bg-corn-50 dark:hover:bg-charcoal-800'"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 cursor-pointer">
            <span>🖼️</span> Banners
          </button>
          <button (click)="setTab('instagram')"
                  [ngClass]="activeTab() === 'instagram' ? 'bg-corn-400 text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-corn-500 hover:bg-corn-50 dark:hover:bg-charcoal-800'"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 cursor-pointer">
            <span>📸</span> Instagram Feed
          </button>
          <button (click)="setTab('coupons')"
                  [ngClass]="activeTab() === 'coupons' ? 'bg-corn-400 text-charcoal-900 shadow-sm' : 'text-charcoal-500 hover:text-corn-500 hover:bg-corn-50 dark:hover:bg-charcoal-800'"
                  class="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-left transition-all duration-200 cursor-pointer">
            <span>🎫</span> Coupons
          </button>
        </nav>

        <!-- Sidebar Footer Admin Info -->
        <div class="pt-6 border-t border-charcoal-200 dark:border-charcoal-800 flex items-center justify-between text-xs text-charcoal-400 font-bold uppercase tracking-wider">
          <span>Admin</span>
          <button (click)="authService.logout()" class="text-red-500 hover:underline cursor-pointer">Log Out</button>
        </div>
      </aside>

      <!-- 2. Main Content Area -->
      <main class="flex-1 p-6 md:p-10 pt-24 md:pt-28 overflow-y-auto">
        
        @if (loading()) {
          <div class="flex items-center justify-center py-24 gap-3 animate-pulse">
            <span class="animate-spin text-xl text-corn-500">⌛</span>
            <span class="text-sm font-semibold text-charcoal-400">Loading admin panel datasets...</span>
          </div>
        } @else {
          
          <!-- TAB 1: DASHBOARD -->
          @if (activeTab() === 'dashboard') {
            <div class="space-y-10 animate-fade-in">
              <!-- Summary Counters Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Revenue Card -->
                <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                     class="p-6 rounded-3xl border shadow-premium space-y-2 relative overflow-hidden h-32 flex flex-col justify-center">
                  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-corn-400 to-yellow-500"></div>
                  <span class="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider block">Total Revenue</span>
                  <span class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white block">
                    Rp {{ stats()?.summary?.totalRevenue?.toLocaleString('id-ID') || 0 }}
                  </span>
                </div>
                <!-- Orders Card -->
                <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                     class="p-6 rounded-3xl border shadow-premium space-y-2 relative overflow-hidden h-32 flex flex-col justify-center">
                  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                  <span class="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider block">Total Orders</span>
                  <span class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white block">
                    {{ stats()?.summary?.totalOrders || 0 }}
                  </span>
                </div>
                <!-- Customers Card -->
                <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                     class="p-6 rounded-3xl border shadow-premium space-y-2 relative overflow-hidden h-32 flex flex-col justify-center">
                  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  <span class="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider block">Registered Customers</span>
                  <span class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white block">
                    {{ stats()?.summary?.totalCustomers || 0 }}
                  </span>
                </div>
                <!-- Products Card -->
                <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                     class="p-6 rounded-3xl border shadow-premium space-y-2 relative overflow-hidden h-32 flex flex-col justify-center">
                  <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                  <span class="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider block">Active Popcorn Flavors</span>
                  <span class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white block">
                    {{ stats()?.summary?.totalProducts || 0 }}
                  </span>
                </div>
              </div>

              <!-- CSS Grid Bar Charts Sales Analytics -->
              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                   class="p-8 rounded-3xl border shadow-premium space-y-6">
                <h3 class="font-display font-extrabold text-lg text-charcoal-800 dark:text-white">Daily Sales History (30 Days)</h3>
                
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
                  <span>30 Days Ago</span>
                  <span>Today</span>
                </div>
              </div>

              <!-- Top Products & Recent Orders Grid -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left: Top Selling -->
                <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                     class="p-6 rounded-3xl border shadow-premium space-y-6">
                  <h3 class="font-display font-extrabold text-lg text-charcoal-800 dark:text-white">Top 5 Selling Products</h3>
                  <div class="space-y-4">
                    @for (prod of stats()?.topProducts; track prod.id) {
                      <div class="flex items-center justify-between text-sm font-medium">
                        <div class="flex items-center gap-3">
                          <img [src]="prod.images?.[0]?.url || '/assets/popcorn.png'" [alt]="prod.name" class="w-10 h-10 object-cover rounded-xl bg-charcoal-150 dark:bg-charcoal-900" />
                          <div>
                            <h4 class="font-bold text-charcoal-800 dark:text-white">{{ prod.name }}</h4>
                            <span class="text-[10px] text-corn-500 font-bold uppercase tracking-wider">Sold: {{ prod.soldCount }} Packs</span>
                          </div>
                        </div>
                        <span class="font-extrabold text-charcoal-800 dark:text-white">Rp {{ prod.price.toLocaleString('id-ID') }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Right: Recent Orders -->
                <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                     class="p-6 rounded-3xl border shadow-premium space-y-6">
                  <h3 class="font-display font-extrabold text-lg text-charcoal-800 dark:text-white">Recent Orders</h3>
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
                  <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Product Catalog</h3>
                  <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">CRUD popcorn listings, variants, stock, and upload images</p>
                </div>
                <button (click)="openProductModal()" class="px-6 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider rounded-full shadow cursor-pointer">
                  + Add New Popcorn
                </button>
              </div>

              <!-- Product List View -->
              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                   class="rounded-3xl border shadow-premium overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900 bg-charcoal-50 dark:bg-charcoal-900/50">
                        <th class="text-left py-4 px-6">Image</th>
                        <th class="text-left py-4 px-6">Flavor Name</th>
                        <th class="text-left py-4 px-6">Primary Price</th>
                        <th class="text-left py-4 px-6">Inventory Stock</th>
                        <th class="text-left py-4 px-6">Featured</th>
                        <th class="text-left py-4 px-6">Status</th>
                        <th class="text-right py-4 px-6">Actions</th>
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
                            <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                                  [class.bg-green-100]="p.isActive" [class.text-green-700]="p.isActive"
                                  [class.bg-red-100]="!p.isActive" [class.text-red-700]="!p.isActive">
                              {{ p.isActive ? 'Active' : 'Inactive' }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right space-x-2">
                            <button (click)="openProductModal(p)" class="px-3.5 py-1.5 rounded-full bg-corn-400/20 text-corn-700 dark:text-corn-300 text-xs font-bold uppercase tracking-wider hover:bg-corn-400/40 cursor-pointer">Edit</button>
                            <button (click)="deleteProduct(p)" class="px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-500/40 cursor-pointer">Delete</button>
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
                  <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Product Categories</h3>
                  <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Manage collections and groupings</p>
                </div>
                <button (click)="openCategoryModal()" class="px-6 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider rounded-full shadow cursor-pointer">
                  + Add New Category
                </button>
              </div>

              <!-- Categories Listing Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @for (c of categories(); track c.id) {
                  <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                       class="p-6 rounded-3xl border shadow-premium flex flex-col justify-between h-48 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-corn-400"></div>
                    <div class="space-y-2">
                      <h4 class="text-lg font-display font-extrabold text-charcoal-800 dark:text-white">{{ c.name }}</h4>
                      <span class="block text-[10px] text-corn-500 font-extrabold uppercase tracking-widest">slug: {{ c.slug }}</span>
                      <p class="text-xs text-charcoal-400 font-medium leading-relaxed mt-1">{{ c.description || 'No description provided' }}</p>
                    </div>
                    <div class="flex justify-end gap-3 pt-4 border-t border-charcoal-100 dark:border-charcoal-900">
                      <button (click)="openCategoryModal(c)" class="text-xs font-bold text-corn-500 hover:underline cursor-pointer uppercase">Edit</button>
                      <button (click)="deleteCategory(c.id)" class="text-xs font-bold text-red-500 hover:underline cursor-pointer uppercase">Delete</button>
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
                <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Orders Cockpit</h3>
                <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Track transactions, update status, and write airwaybill (resi)</p>
              </div>

              <!-- Orders Cockpit Grid -->
              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                   class="rounded-3xl border shadow-premium overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900 bg-charcoal-50 dark:bg-charcoal-900/50">
                        <th class="text-left py-4 px-6">Invoice Number</th>
                        <th class="text-left py-4 px-6">Customer</th>
                        <th class="text-left py-4 px-6">Order Total</th>
                        <th class="text-left py-4 px-6">Resi / Courier</th>
                        <th class="text-left py-4 px-6">Order Status</th>
                        <th class="text-right py-4 px-6">Cockpit Actions</th>
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
                              <span class="text-xs text-charcoal-400 italic">No airwaybill resi</span>
                            }
                          </td>
                          <td class="py-4 px-6">
                            <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                                  [class.bg-green-100]="o.status === 'paid' || o.status === 'delivered'"
                                  [class.text-green-700]="o.status === 'paid' || o.status === 'delivered'"
                                  [class.bg-yellow-100]="o.status === 'pending' || o.status === 'waiting_payment'"
                                  [class.text-yellow-700]="o.status === 'pending' || o.status === 'waiting_payment'">
                              {{ o.status }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right space-x-2 shrink-0">
                            <!-- Update Status Trigger -->
                            <select (change)="updateOrderStatus(o.id, $event)" [value]="o.status"
                                    [ngClass]="themeService.theme() === 'dark' ? 'bg-charcoal-950 border-charcoal-850 text-white' : 'bg-white border-charcoal-200 text-charcoal-800'"
                                    class="px-2 py-1 rounded border text-xs focus:outline-none cursor-pointer inline-block w-28 mr-2">
                              <option value="pending">Pending</option>
                              <option value="waiting_payment">Waiting Payment</option>
                              <option value="paid">Paid</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            <button (click)="openResiModal(o)" class="px-3.5 py-1.5 rounded-full bg-corn-400/20 text-corn-700 dark:text-corn-300 text-[10px] font-bold uppercase tracking-wider hover:bg-corn-400/40 cursor-pointer">Resi</button>
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
                <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Customers</h3>
                <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Customer directories and status blockers</p>
              </div>

              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                   class="rounded-3xl border shadow-premium overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900 bg-charcoal-50 dark:bg-charcoal-900/50">
                        <th class="text-left py-4 px-6">Name</th>
                        <th class="text-left py-4 px-6">Email</th>
                        <th class="text-left py-4 px-6">Phone Number</th>
                        <th class="text-left py-4 px-6">Registration Date</th>
                        <th class="text-left py-4 px-6">Blocker Status</th>
                        <th class="text-right py-4 px-6">Actions</th>
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
                            <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                                  [class.bg-green-100]="cust.isActive" [class.text-green-700]="cust.isActive"
                                  [class.bg-red-100]="!cust.isActive" [class.text-red-700]="!cust.isActive">
                              {{ cust.isActive ? 'Active' : 'Blocked' }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right">
                            <button (click)="toggleCustomerStatus(cust)"
                                    [ngClass]="cust.isActive ? 'bg-red-500/20 text-red-600 hover:bg-red-500/40' : 'bg-green-500/20 text-green-600 hover:bg-green-500/40'"
                                    class="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer">
                              {{ cust.isActive ? 'Block User' : 'Activate User' }}
                            </button>
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
                <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Business Settings</h3>
                <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Configure system parameters globally</p>
              </div>

              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                   class="p-8 rounded-3xl border shadow-premium space-y-6">
                
                <form (submit)="saveSettings()" class="space-y-6 text-sm font-medium">
                  @for (s of settings(); track s.id) {
                    <div>
                      <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">{{ s.key }}</label>
                      <input type="text" [(ngModel)]="settingsPayload[s.key]" [name]="s.key" required
                             [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                             class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
                    </div>
                  }

                  <div class="pt-4 flex justify-end">
                    <button type="submit" class="px-8 py-4 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-sans font-bold text-xs tracking-widest uppercase rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer">
                      Save All Settings
                    </button>
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
                  <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Marketing Banners</h3>
                  <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Manage carousel hero banners and slide placements</p>
                </div>
                <button (click)="openBannerModal()" class="px-6 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider rounded-full shadow cursor-pointer">
                  + Add New Banner
                </button>
              </div>

              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                   class="rounded-3xl border shadow-premium overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900 bg-charcoal-50 dark:bg-charcoal-900/50">
                        <th class="text-left py-4 px-6">Image</th>
                        <th class="text-left py-4 px-6">Title & Subtitle</th>
                        <th class="text-left py-4 px-6">Link URL</th>
                        <th class="text-left py-4 px-6">Sort Order</th>
                        <th class="text-left py-4 px-6">Status</th>
                        <th class="text-right py-4 px-6">Actions</th>
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
                            <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                                  [class.bg-green-100]="b.isActive" [class.text-green-700]="b.isActive"
                                  [class.bg-red-100]="!b.isActive" [class.text-red-700]="!b.isActive">
                              {{ b.isActive ? 'Active' : 'Inactive' }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right space-x-2">
                            <button (click)="openBannerModal(b)" class="px-3.5 py-1.5 rounded-full bg-corn-400/20 text-corn-700 dark:text-corn-300 text-xs font-bold uppercase tracking-wider hover:bg-corn-400/40 cursor-pointer">Edit</button>
                            <button (click)="deleteBanner(b.id)" class="px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-500/40 cursor-pointer">Delete</button>
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
                  <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Instagram Feed Gallery</h3>
                  <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Manage custom brand Instagram gallery cards without APIs</p>
                </div>
                <button (click)="openInstagramModal()" class="px-6 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider rounded-full shadow cursor-pointer">
                  + Add Instagram Card
                </button>
              </div>

              <!-- Instagram Cards responsive modern grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                @for (post of instagramPosts(); track post.id) {
                  <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark border-charcoal-850' : 'glassmorphism-light border-charcoal-150'"
                       class="rounded-3xl border shadow-premium overflow-hidden flex flex-col justify-between h-96 relative group">
                    
                    <div class="relative overflow-hidden aspect-square h-48 bg-charcoal-100 dark:bg-charcoal-900">
                      <img [src]="post.imageUrl || post.image_url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                        #{{ post.sortOrder || post.sort_order || 0 }}
                      </span>
                    </div>

                    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div class="space-y-1">
                        <div class="text-[10px] text-corn-500 font-extrabold uppercase tracking-widest">Caption & Details</div>
                        <p class="text-xs text-charcoal-600 dark:text-charcoal-350 line-clamp-3 font-medium leading-relaxed">
                          {{ post.caption || 'No caption entered' }}
                        </p>
                        <a [href]="post.postUrl || post.post_url" target="_blank" class="block text-[10px] font-mono text-blue-500 hover:underline truncate mt-1">
                          🔗 Link: {{ post.postUrl || post.post_url }}
                        </a>
                      </div>

                      <div class="flex items-center justify-between pt-3 border-t border-charcoal-100 dark:border-charcoal-900 text-xs">
                        <span class="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                              [class.bg-green-100]="post.isActive" [class.text-green-700]="post.isActive"
                              [class.bg-red-100]="!post.isActive" [class.text-red-700]="!post.isActive">
                          {{ post.isActive ? 'Active' : 'Hidden' }}
                        </span>
                        
                        <div class="flex gap-2">
                          <button (click)="openInstagramModal(post)" class="text-xs font-bold text-corn-500 hover:underline cursor-pointer uppercase">Edit</button>
                          <button (click)="deleteInstagramPost(post.id)" class="text-xs font-bold text-red-500 hover:underline cursor-pointer uppercase">Delete</button>
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
                  <h3 class="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">Discount Coupons</h3>
                  <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-0.5">Manage promotional codes, limits, and coupon limits</p>
                </div>
                <button (click)="openCouponModal()" class="px-6 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider rounded-full shadow cursor-pointer">
                  + Add New Coupon
                </button>
              </div>

              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                   class="rounded-3xl border shadow-premium overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900 bg-charcoal-50 dark:bg-charcoal-900/50">
                        <th class="text-left py-4 px-6">Coupon Code</th>
                        <th class="text-left py-4 px-6">Type</th>
                        <th class="text-left py-4 px-6">Discount Value</th>
                        <th class="text-left py-4 px-6">Min Purchase</th>
                        <th class="text-left py-4 px-6">Usage Count / Limit</th>
                        <th class="text-left py-4 px-6">Status</th>
                        <th class="text-right py-4 px-6">Actions</th>
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
                            <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                                  [class.bg-green-100]="c.isActive" [class.text-green-700]="c.isActive"
                                  [class.bg-red-100]="!c.isActive" [class.text-red-700]="!c.isActive">
                              {{ c.isActive ? 'Active' : 'Inactive' }}
                            </span>
                          </td>
                          <td class="py-4 px-6 text-right space-x-2">
                            <button (click)="openCouponModal(c)" class="px-3.5 py-1.5 rounded-full bg-corn-400/20 text-corn-700 dark:text-corn-300 text-xs font-bold uppercase tracking-wider hover:bg-corn-400/40 cursor-pointer">Edit</button>
                            <button (click)="deleteCoupon(c.id)" class="px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-500/40 cursor-pointer">Delete</button>
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
      @if (resiModalVisible()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
               class="w-full max-w-md p-8 rounded-3xl border space-y-6 shadow-premium relative">
            <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white">Input Airwaybill Resi</h3>
            
            <div class="space-y-4 text-sm font-medium">
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Courier Name</label>
                <input type="text" [(ngModel)]="resiData.courierName" placeholder="e.g. JNE"
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Courier Service</label>
                <input type="text" [(ngModel)]="resiData.courierService" placeholder="e.g. REG"
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Resi Tracking Number</label>
                <input type="text" [(ngModel)]="resiData.trackingNumber" placeholder="e.g. JT123456789"
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
            </div>

            <div class="flex items-center gap-4 justify-between pt-2">
              <button (click)="closeResiModal()" class="px-6 py-2.5 rounded-full border border-charcoal-200 text-charcoal-500 hover:text-charcoal-800 font-bold transition-all text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
              <button (click)="saveResi()" class="px-8 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer">Save Resi</button>
            </div>
          </div>
        </div>
      }

      <!-- CATEGORY ADD/EDIT MODAL -->
      @if (categoryModalVisible()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
               class="w-full max-w-md p-8 rounded-3xl border space-y-6 shadow-premium relative">
            <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white">
              {{ categoryData.id ? 'Edit Category' : 'Add New Category' }}
            </h3>
            
            <div class="space-y-4 text-sm font-medium">
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Category Name</label>
                <input type="text" [(ngModel)]="categoryData.name" placeholder="e.g. Spicy Lava"
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Description</label>
                <textarea [(ngModel)]="categoryData.description" placeholder="Short description..." rows="2"
                          [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                          class="w-full px-5 py-3 rounded-2xl border bg-transparent focus:outline-none focus:border-corn-400"></textarea>
              </div>
            </div>

            <div class="flex items-center gap-4 justify-between pt-2">
              <button (click)="closeCategoryModal()" class="px-6 py-2.5 rounded-full border border-charcoal-200 text-charcoal-500 hover:text-charcoal-800 font-bold transition-all text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
              <button (click)="saveCategory()" class="px-8 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      }

      <!-- PRODUCT ADD/EDIT MODAL -->
      @if (productModalVisible()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
               class="w-full max-w-lg p-8 rounded-3xl border space-y-6 shadow-premium relative my-8">
            <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white">
              {{ productData.id ? 'Edit Popcorn Flavor' : 'Add New Popcorn Flavor' }}
            </h3>
            
            <div class="space-y-4 text-xs font-semibold">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Flavor Name</label>
                  <input type="text" [(ngModel)]="productData.name" placeholder="e.g. Honey Butter"
                         [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                         class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Price (Rp)</label>
                  <input type="number" [(ngModel)]="productData.price" placeholder="25000"
                         [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                         class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Inventory Quantity</label>
                  <input type="number" [(ngModel)]="productData.quantity" placeholder="100"
                         [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                         class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
                </div>
                <div class="flex items-center gap-4 pt-8">
                  <label class="flex items-center gap-2 text-xs font-semibold text-charcoal-800 dark:text-white cursor-pointer select-none">
                    <input type="checkbox" [(ngModel)]="productData.isFeatured" class="w-4 h-4 accent-corn-400" />
                    Featured Flavor
                  </label>
                  <label class="flex items-center gap-2 text-xs font-semibold text-charcoal-800 dark:text-white cursor-pointer select-none">
                    <input type="checkbox" [(ngModel)]="productData.isActive" class="w-4 h-4 accent-corn-400" />
                    Active Catalog
                  </label>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Description</label>
                <textarea [(ngModel)]="productData.description" placeholder="Flavor details, notes, organic seed properties..." rows="3"
                          [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                          class="w-full px-5 py-3 rounded-2xl border bg-transparent focus:outline-none focus:border-corn-400"></textarea>
              </div>

              <!-- Image File Upload section -->
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Upload Flavor Image</label>
                <input type="file" (change)="onImageFileSelected($event)" accept="image/*"
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-corn-400 file:text-charcoal-900 hover:file:bg-corn-500 cursor-pointer" />
                @if (imageUploadProgress()) {
                  <span class="block text-[10px] text-corn-500 font-bold mt-2 animate-pulse">⌛ Image upload in progress...</span>
                }
              </div>
            </div>

            <div class="flex items-center gap-4 justify-between pt-2">
              <button (click)="closeProductModal()" class="px-6 py-2.5 rounded-full border border-charcoal-200 text-charcoal-500 hover:text-charcoal-800 font-bold transition-all text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
              <button (click)="saveProduct()" [disabled]="imageUploadProgress()" class="px-8 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      }

      <!-- BANNER ADD/EDIT MODAL -->
      @if (bannerModalVisible()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
               class="w-full max-w-md p-8 rounded-3xl border space-y-6 shadow-premium relative my-8">
            <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white">
              {{ bannerData.id ? 'Edit Banner' : 'Add New Banner' }}
            </h3>
            
            <div class="space-y-4 text-xs font-semibold">
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Banner Title</label>
                <input type="text" [(ngModel)]="bannerData.title" placeholder="e.g. Premium Popcorn"
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Subtitle</label>
                <input type="text" [(ngModel)]="bannerData.subtitle" placeholder="e.g. Free shipping inside Java!"
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Banner Image URL</label>
                <input type="text" [(ngModel)]="bannerData.imageUrl" placeholder="e.g. https://images.unsplash.com/..."
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Mobile Image URL (Optional)</label>
                <input type="text" [(ngModel)]="bannerData.mobileImageUrl" placeholder="e.g. https://images.unsplash.com/..."
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Target Link URL</label>
                <input type="text" [(ngModel)]="bannerData.linkUrl" placeholder="e.g. /produk/honey-butter"
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Sort Order</label>
                  <input type="number" [(ngModel)]="bannerData.sortOrder" placeholder="0"
                         [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                         class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
                </div>
                <div class="flex items-center gap-2 pt-8 select-none">
                  <label class="flex items-center gap-2 text-xs font-semibold text-charcoal-800 dark:text-white cursor-pointer">
                    <input type="checkbox" [(ngModel)]="bannerData.isActive" class="w-4 h-4 accent-corn-400" />
                    Active Banner
                  </label>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 justify-between pt-2">
              <button (click)="closeBannerModal()" class="px-6 py-2.5 rounded-full border border-charcoal-200 text-charcoal-500 hover:text-charcoal-800 font-bold transition-all text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
              <button (click)="saveBanner()" class="px-8 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      }

      <!-- INSTAGRAM CARD ADD/EDIT MODAL -->
      @if (instagramModalVisible()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
               class="w-full max-w-md p-8 rounded-3xl border space-y-6 shadow-premium relative my-8">
            <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white">
              {{ instagramData.id ? 'Edit Instagram Card' : 'Add Instagram Card' }}
            </h3>
            
            <div class="space-y-4 text-xs font-semibold">
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Instagram Photo URL</label>
                <input type="text" [(ngModel)]="instagramData.imageUrl" placeholder="e.g. https://images.unsplash.com/..."
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Instagram Post URL (Redirect)</label>
                <input type="text" [(ngModel)]="instagramData.postUrl" placeholder="e.g. https://www.instagram.com/p/..."
                       [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                       class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Caption Text</label>
                <textarea [(ngModel)]="instagramData.caption" placeholder="Popcorn taste test details, brand tags..." rows="3"
                          [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                          class="w-full px-5 py-3 rounded-2xl border bg-transparent focus:outline-none focus:border-corn-400"></textarea>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Sort Order</label>
                  <input type="number" [(ngModel)]="instagramData.sortOrder" placeholder="0"
                         [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                         class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
                </div>
                <div class="flex items-center gap-2 pt-8 select-none">
                  <label class="flex items-center gap-2 text-xs font-semibold text-charcoal-800 dark:text-white cursor-pointer">
                    <input type="checkbox" [(ngModel)]="instagramData.isActive" class="w-4 h-4 accent-corn-400" />
                    Visible in Feed
                  </label>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 justify-between pt-2">
              <button (click)="closeInstagramModal()" class="px-6 py-2.5 rounded-full border border-charcoal-200 text-charcoal-500 hover:text-charcoal-800 font-bold transition-all text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
              <button (click)="saveInstagramPost()" class="px-8 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      }

      <!-- COUPON ADD/EDIT MODAL -->
      @if (couponModalVisible()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
               class="w-full max-w-md p-8 rounded-3xl border space-y-6 shadow-premium relative my-8">
            <h3 class="font-display font-extrabold text-xl text-charcoal-800 dark:text-white">
              {{ couponData.id ? 'Edit Coupon' : 'Add New Coupon' }}
            </h3>
            
            <div class="space-y-4 text-xs font-semibold">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Coupon Code</label>
                  <input type="text" [(ngModel)]="couponData.code" placeholder="FITCORN10"
                         [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                         class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400 font-mono uppercase" />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Discount Type</label>
                  <select [(ngModel)]="couponData.type"
                          [ngClass]="themeService.theme() === 'dark' ? 'bg-charcoal-950 border-charcoal-850 text-white' : 'bg-white border-charcoal-200 text-charcoal-800'"
                          class="w-full px-5 py-3 rounded-full border focus:outline-none focus:border-corn-400 cursor-pointer">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rp)</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Discount Value</label>
                  <input type="number" [(ngModel)]="couponData.value" placeholder="10"
                         [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                         class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Min Purchase (Rp)</label>
                  <input type="number" [(ngModel)]="couponData.minPurchase" placeholder="0"
                         [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                         class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Max Discount cap (Rp)</label>
                  <input type="number" [(ngModel)]="couponData.maxDiscount" placeholder="Optional limit cap"
                         [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                         class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Usage Limit Count</label>
                  <input type="number" [(ngModel)]="couponData.usageLimit" placeholder="Optional max redemptions"
                         [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                         class="w-full px-5 py-3 rounded-full border bg-transparent focus:outline-none focus:border-corn-400" />
                </div>
              </div>

              <div class="flex items-center gap-2 pt-4 select-none">
                <label class="flex items-center gap-2 text-xs font-semibold text-charcoal-800 dark:text-white cursor-pointer">
                  <input type="checkbox" [(ngModel)]="couponData.isActive" class="w-4 h-4 accent-corn-400" />
                  Active Coupon
                </label>
              </div>
            </div>

            <div class="flex items-center gap-4 justify-between pt-2">
              <button (click)="closeCouponModal()" class="px-6 py-2.5 rounded-full border border-charcoal-200 text-charcoal-500 hover:text-charcoal-800 font-bold transition-all text-xs uppercase tracking-wider cursor-pointer">Cancel</button>
              <button (click)="saveCoupon()" class="px-8 py-3 bg-corn-400 hover:bg-corn-500 text-charcoal-900 font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      }

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
      alert('Courier Name and Airwaybill tracking number are required.');
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

  updateOrderStatus(orderId: string, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
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
    if (!confirm('Are you sure you want to delete this category?')) return;
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
      next: () => alert('All system settings saved successfully!'),
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
    if (!confirm(`Are you sure you want to delete product "${prod.name}"?`)) return;
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
      alert('Title and Image URL are required.');
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
    if (!confirm('Are you sure you want to delete this banner?')) return;
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
      alert('Image URL and Post URL are required.');
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
    if (!confirm('Are you sure you want to delete this Instagram post?')) return;
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
      alert('Coupon Code and Discount Value are required.');
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
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    this.adminService.deleteCoupon(id).subscribe({
      next: () => this.loadActiveTabDataset(),
      error: (err) => console.error('Failed to delete coupon', err)
    });
  }
}
