import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto px-6 py-24 sm:py-32 font-sans transition-colors duration-300">
      <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
           class="p-8 rounded-3xl border space-y-6 relative overflow-hidden">

        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-corn-300 to-corn-500"></div>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white">
              {{ isEdit() ? 'Edit Produk' : 'Produk Baru' }}
            </h1>
            <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider mt-1">
              {{ isEdit() ? 'Perbarui detail produk' : 'Tambah produk baru ke katalog' }}
            </p>
          </div>
          <a routerLink="/admin/produk"
             class="px-5 py-2 font-bold text-xs tracking-widest uppercase rounded-full bg-charcoal-100 dark:bg-charcoal-800 hover:bg-charcoal-200 dark:hover:bg-charcoal-700 text-charcoal-600 dark:text-charcoal-300 transition-colors cursor-pointer">
            Kembali
          </a>
        </div>

        <form (submit)="onSubmit()" class="space-y-5 text-sm font-medium" #productForm="ngForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="md:col-span-2">
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Nama *</label>
              <input type="text" [(ngModel)]="form.name" name="name" required
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
            </div>

            <div>
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Slug</label>
              <input type="text" [(ngModel)]="form.slug" name="slug"
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
            </div>

            <div>
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">SKU</label>
              <input type="text" [(ngModel)]="form.sku" name="sku"
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
            </div>

            <div class="md:col-span-2">
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Deskripsi *</label>
              <textarea [(ngModel)]="form.description" name="description" required rows="4"
                        [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                        class="w-full px-5 py-3 rounded-2xl border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400"></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Deskripsi Singkat</label>
              <textarea [(ngModel)]="form.shortDescription" name="shortDescription" rows="2"
                        [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                        class="w-full px-5 py-3 rounded-2xl border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400"></textarea>
            </div>

            <div>
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Harga *</label>
              <input type="number" [(ngModel)]="form.price" name="price" required min="0"
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
            </div>

            <div>
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Harga Diskon</label>
              <input type="number" [(ngModel)]="form.salePrice" name="salePrice" min="0"
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
            </div>

            <div>
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Weight (g) *</label>
              <input type="number" [(ngModel)]="form.weight" name="weight" required min="0"
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
            </div>

            <div>
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">URL Gambar</label>
              <input type="url" [(ngModel)]="form.imageUrl" name="imageUrl"
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
            </div>

            <div class="flex items-center gap-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="form.isFeatured" name="isFeatured"
                       class="w-4 h-4 rounded accent-corn-400" />
                <span class="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Unggulan</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="form.isActive" name="isActive"
                       class="w-4 h-4 rounded accent-corn-400" />
                <span class="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Aktif</span>
              </label>
            </div>
          </div>

          <div class="pt-4 space-y-3">
            <button type="submit" [disabled]="saving()"
                    class="w-full px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 disabled:bg-corn-400/50 disabled:cursor-not-allowed text-charcoal-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2">
              @if (saving()) {
                Menyimpan...
              } @else {
                {{ isEdit() ? 'Perbarui Produk' : 'Buat Produk' }}
              }
            </button>

            @if (errorMsg()) {
              <div class="p-3 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
                {{ errorMsg() }}
              </div>
            }
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class AdminProductFormComponent implements OnInit {
  themeService = inject(ThemeService);
  private productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = signal(false);
  productId = signal<string | null>(null);
  saving = signal(false);
  errorMsg = signal('');

  form: any = {
    name: '',
    slug: '',
    sku: '',
    description: '',
    shortDescription: '',
    price: 0,
    salePrice: null,
    weight: 0,
    imageUrl: '',
    isFeatured: false,
    isActive: true,
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'baru') {
      this.isEdit.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  loadProduct(id: string) {
    this.productsService.getAdminProductById(id).subscribe({
      next: (product) => {
        this.form = {
          name: product.name,
          slug: product.slug,
          sku: product.sku || '',
          description: product.description,
          shortDescription: product.shortDescription || '',
          price: product.price,
          salePrice: product.salePrice || null,
          weight: product.weight,
          imageUrl: product.images?.[0]?.url || '',
          isFeatured: product.isFeatured,
          isActive: product.isActive !== false,
        };
      },
      error: () => {
        this.errorMsg.set('Gagal memuat produk');
      },
    });
  }

  onSubmit() {
    if (!this.form.name || !this.form.description || !this.form.price || !this.form.weight) {
      this.errorMsg.set('Harap isi semua field yang wajib diisi');
      return;
    }

    this.saving.set(true);
    this.errorMsg.set('');

    const payload = {
      ...this.form,
      salePrice: this.form.salePrice || undefined,
      slug: this.form.slug || undefined,
      sku: this.form.sku || undefined,
      imageUrl: this.form.imageUrl || undefined,
    };

    const request = this.isEdit() && this.productId()
      ? this.productsService.updateProduct(this.productId()!, payload)
      : this.productsService.createProduct(payload);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/produk']);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Gagal menyimpan produk');
        this.saving.set(false);
      },
    });
  }
}
