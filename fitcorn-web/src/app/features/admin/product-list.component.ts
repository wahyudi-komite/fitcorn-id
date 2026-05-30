import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { ProductsService } from '../../core/services/products.service';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto px-6 py-24 sm:py-32 font-sans transition-colors duration-300">
      <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
           class="p-8 rounded-3xl border space-y-6 relative overflow-hidden">
        
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-corn-300 to-corn-500"></div>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white">Produk</h1>
            <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-1">Kelola katalog produk</p>
          </div>
          <a routerLink="/admin/produk/baru"
             class="px-6 py-3 font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
            + Produk Baru
          </a>
        </div>

        <div class="flex gap-3">
          <input type="text" [(ngModel)]="search" (input)="onSearch()" placeholder="Cari produk..."
                 [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                 class="flex-1 px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400 text-sm" />
        </div>

        @if (loading()) {
          <div class="text-center py-12 text-charcoal-400">Loading...</div>
        } @else if (products().length === 0) {
          <div class="text-center py-12 text-charcoal-400">No products found</div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest border-b border-charcoal-100 dark:border-charcoal-900">
                  <th class="text-left py-3 px-2">Image</th>
                  <th class="text-left py-3 px-2">Name</th>
                  <th class="text-left py-3 px-2">Price</th>
                  <th class="text-left py-3 px-2">Stock</th>
                  <th class="text-left py-3 px-2">Status</th>
                  <th class="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (product of products(); track product.id) {
                  <tr class="border-b border-charcoal-100 dark:border-charcoal-900 hover:bg-charcoal-50 dark:hover:bg-charcoal-900/30 transition-colors">
                    <td class="py-3 px-2">
                      <img [src]="product.images?.[0]?.url || ''" [alt]="product.name"
                           class="w-12 h-12 rounded-xl object-cover bg-charcoal-100 dark:bg-charcoal-800" />
                    </td>
                    <td class="py-3 px-2 font-semibold text-charcoal-800 dark:text-white">{{ product.name }}</td>
                    <td class="py-3 px-2 text-charcoal-600 dark:text-charcoal-300">Rp {{ product.price | number }}</td>
                    <td class="py-3 px-2">
                      <span [class.text-green-500]="(product.inventory?.quantity || 0) > 0"
                            [class.text-red-500]="(product.inventory?.quantity || 0) === 0">
                        {{ product.inventory?.quantity || 0 }}
                      </span>
                    </td>
                    <td class="py-3 px-2">
                      <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            [class.bg-green-100]="product.isActive && product.isActive !== false"
                            [class.text-green-700]="product.isActive && product.isActive !== false"
                            [class.bg-red-100]="!product.isActive"
                            [class.text-red-700]="!product.isActive">
                        {{ product.isActive && product.isActive !== false ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td class="py-3 px-2 text-right">
                      <a [routerLink]="['/admin/produk', product.id]"
                         class="px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-full bg-corn-400/20 text-corn-700 dark:text-corn-300 hover:bg-corn-400/40 transition-colors cursor-pointer">
                        Edit
                      </a>
                      <button (click)="confirmDelete(product)"
                              class="ml-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-full bg-red-500/20 text-red-600 hover:bg-red-500/40 transition-colors cursor-pointer">
                        Delete
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (meta().totalPages > 1) {
            <div class="flex justify-center gap-2 pt-4">
              @for (p of pages(); track p) {
                <button (click)="goToPage(p)"
                        class="px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer"
                        [class.bg-corn-400]="p === meta().page"
                        [class.text-charcoal-900]="p === meta().page"
                        [class.bg-charcoal-100]="p !== meta().page"
                        [class.dark:bg-charcoal-800]="p !== meta().page"
                        [class.dark:text-white]="p !== meta().page">
                  {{ p }}
                </button>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [],
})
export class AdminProductListComponent implements OnInit {
  themeService = inject(ThemeService);
  private productsService = inject(ProductsService);
  private modalService = inject(ModalService);
  private router = inject(Router);

  products = signal<any[]>([]);
  loading = signal(false);
  search = '';
  meta = signal<any>({ page: 1, totalPages: 1, total: 0 });

  ngOnInit() {
    this.loadProducts();
  }

  pages() {
    return Array.from({ length: this.meta().totalPages }, (_, i) => i + 1);
  }

  loadProducts() {
    this.loading.set(true);
    this.productsService.getAdminProducts({ search: this.search, page: this.meta().page, limit: 20 })
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
          this.meta.set(res.meta);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onSearch() {
    this.meta.set({ ...this.meta(), page: 1 });
    this.loadProducts();
  }

  goToPage(page: number) {
    this.meta.set({ ...this.meta(), page });
    this.loadProducts();
  }

  async confirmDelete(product: any) {
    const confirmed = await this.modalService.confirm({
      title: 'Delete Product',
      message: `Delete "${product.name}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    if (!confirmed) return;
    this.productsService.deleteProduct(product.id).subscribe({
      next: () => this.loadProducts(),
      error: () => {
        this.modalService.confirm({
          title: 'Error',
          message: 'Failed to delete product. Please try again.',
          confirmLabel: 'OK',
          cancelLabel: '',
        });
      },
    });
  }
}
