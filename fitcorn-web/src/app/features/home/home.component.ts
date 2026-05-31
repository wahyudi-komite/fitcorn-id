import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { ProductsService } from '../../core/services/products.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="relative overflow-hidden font-sans transition-colors duration-300">
      
      <!-- Premium Background Glows -->
      <div class="absolute top-1/10 left-1/10 w-[500px] h-[500px] rounded-full bg-corn-300/20 blur-3xl dark:bg-corn-400/10 pointer-events-none"></div>
      <div class="absolute top-1/2 right-1/10 w-[400px] h-[400px] rounded-full bg-corn-400/20 blur-3xl dark:bg-corn-500/5 pointer-events-none"></div>

      <!-- 1. Hero Section -->
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 sm:py-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8 max-w-xl text-center lg:text-left">
            
            <!-- Animated Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-corn-300 bg-corn-50 dark:bg-corn-400/10 text-corn-700 dark:text-corn-400 font-sans font-semibold text-xs tracking-wider uppercase animate-pulse-gentle mx-auto lg:mx-0">
              <span>🍿</span>               Camilan Sehat 100% Organik
            </div>

            <h1 class="text-5xl sm:text-6xl font-display font-extrabold tracking-tight text-charcoal-800 dark:text-white leading-tight">
              Popcorn premium <br>
              <span class="text-corn-500 bg-gradient-to-r from-corn-400 to-corn-600 bg-clip-text text-transparent">diciptakan ulang.</span>
            </h1>

            <p class="text-lg text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium">
              Kami menghilangkan lemak jahat dan bahan kimia berat. Fitcorn dibuat dengan biji non-rekayasa genetik, gula tebu organik, dan rempah pilihan. Camilan yang ditingkatkan menjadi seni.
            </p>

            <!-- CTA Actions -->
            <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
              <a routerLink="/produk" 
                 class="px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer">
                Lihat Rasa
              </a>
              <a href="#why-fitcorn" 
                 class="px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full border border-charcoal-200 dark:border-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-charcoal-100 dark:hover:bg-charcoal-850 transition-all duration-300 cursor-pointer">
                Pelajari Lebih Lanjut
              </a>
            </div>

          </div>

          <!-- Graphic Showcase -->
          <div class="relative flex justify-center lg:justify-end animate-float">
            <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'" 
                 class="relative p-8 rounded-3xl w-full max-w-sm border transition-all duration-300">
              
              <!-- Popcorn Image Frame -->
              <div class="aspect-square rounded-2xl bg-charcoal-100 dark:bg-charcoal-900 overflow-hidden flex items-center justify-center text-7xl select-none">
                🍿
              </div>

              <!-- Product Snippet -->
              <div class="mt-6 flex justify-between items-center">
                <div>
                  <h3 class="font-display font-extrabold text-lg text-charcoal-800 dark:text-white">Sweet Honey Butter</h3>
                  <p class="text-xs text-charcoal-400 font-semibold mt-1">Pilihan Terlaris</p>
                </div>
                <div class="text-lg font-display font-extrabold text-corn-500">
                  Rp 25.000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Why Fitcorn Section -->
      <div id="why-fitcorn" class="max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-charcoal-150 dark:border-charcoal-900">
        <div class="text-center max-w-xl mx-auto mb-16 space-y-4">
          <h2 class="text-3xl sm:text-4xl font-display font-extrabold text-charcoal-800 dark:text-white">
            Mengapa Pelanggan Memilih Kami
          </h2>
          <p class="text-charcoal-500 dark:text-charcoal-400 font-medium">
            Kami membuat popcorn dengan kesehatan dan cita rasa terbaik. Tidak ada kompromi, hanya bahan premium.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-8 rounded-3xl border space-y-4 text-center shadow-premium">
            <span class="text-4xl block">🌱</span>
            <h3 class="font-display font-bold text-xl text-charcoal-800 dark:text-white">100% Organik & Non-Rekayasa Genetik</h3>
            <p class="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium">
              Bersumber dari petani jagung lokal berkelanjutan yang berdedikasi pada pertanian bebas bahan kimia.
            </p>
          </div>

          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-8 rounded-3xl border space-y-4 text-center shadow-premium">
            <span class="text-4xl block">🥥</span>
            <h3 class="font-display font-bold text-xl text-charcoal-800 dark:text-white">Lemak Sehat</h3>
            <p class="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium">
              Kami hanya menggunakan minyak kelapa organik extra-virgin dan mentega Prancis dari sapi rumput asli. Tanpa minyak sawit.
            </p>
          </div>

          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-8 rounded-3xl border space-y-4 text-center shadow-premium">
            <span class="text-4xl block">🚫</span>
            <h3 class="font-display font-bold text-xl text-charcoal-800 dark:text-white">Bebas Pengawet</h3>
            <p class="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium">
              Diawetkan secara alami dengan membuat batch kecil sesuai pesanan dan dikirim segar langsung kepada Anda.
            </p>
          </div>
        </div>
      </div>

      <!-- 3. Best Sellers Carousel/Grid -->
      @if (featuredProducts().length > 0) {
        <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-charcoal-150 dark:border-charcoal-900">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div class="space-y-4 max-w-xl">
              <h2 class="text-3xl sm:text-4xl font-display font-extrabold text-charcoal-800 dark:text-white">
                Produk Terlaris Kami
              </h2>
              <p class="text-charcoal-500 dark:text-charcoal-400 font-medium">
                Coba rasa yang sedang digemari di seluruh Indonesia. Dipopcorn dengan sempurna.
              </p>
            </div>
            <a routerLink="/produk" 
               class="inline-flex items-center gap-2 px-6 py-3 font-sans font-bold text-xs uppercase tracking-wider rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 transition-colors shadow-md shrink-0">
              Lihat Katalog
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            @for (item of featuredProducts(); track item.id) {
              <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
                   class="rounded-3xl p-5 border flex flex-col justify-between transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div>
                  <div class="aspect-square rounded-2xl bg-charcoal-100 dark:bg-charcoal-900 overflow-hidden flex items-center justify-center mb-4 relative">
                    @if (item.images && item.images.length > 0) {
                      <img [src]="item.images[0].url" [alt]="item.images[0].altText || item.name" class="w-full h-full object-cover" />
                    } @else {
                      <span class="text-4xl">🍿</span>
                    }
                  </div>
                  <span class="text-[9px] font-bold text-corn-500 uppercase tracking-widest block mb-1">
                    {{ item.categories?.[0]?.name || 'Rasa Signature' }}
                  </span>
                  <h4 class="font-display font-extrabold text-base text-charcoal-800 dark:text-white line-clamp-1">
                    <a [routerLink]="['/produk', item.slug]">{{ item.name }}</a>
                  </h4>
                  <p class="text-xs text-charcoal-400 font-semibold mt-1">Berat: {{ item.weight }}g</p>
                </div>
                
                <div class="mt-4 pt-3 border-t border-charcoal-100 dark:border-charcoal-900/50 flex items-center justify-between">
                  <span class="text-sm font-display font-extrabold text-corn-500">
                    Rp {{ item.price.toLocaleString('id-ID') }}
                  </span>
                  <a [routerLink]="['/produk', item.slug]"
                     class="px-3 py-1.5 text-[10px] font-bold bg-charcoal-100 dark:bg-charcoal-900 text-charcoal-700 dark:text-charcoal-300 rounded-full hover:bg-corn-400 hover:text-charcoal-900 transition-colors">
                    Pesan
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- 4. Customer Reviews -->
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-charcoal-150 dark:border-charcoal-900">
        <div class="text-center max-w-xl mx-auto mb-16 space-y-4">
          <h2 class="text-3xl sm:text-4xl font-display font-extrabold text-charcoal-800 dark:text-white">
            Disukai Pecinta Camilan
          </h2>
          <p class="text-charcoal-500 dark:text-charcoal-400 font-medium">
            Dengarkan dari komunitas kami yang telah menikmati popcorn premium.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-6 rounded-3xl border space-y-4 shadow-premium">
            <div class="flex items-center gap-1 text-corn-500">⭐⭐⭐⭐⭐</div>
            <p class="text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium italic">
              "Rasa Sweet Honey Butter benar-benar revolusioner. Anda bisa merasakan madu asli, berbeda dengan debu kimia pada merek biasa. Camilan andalan saya setiap hari!"
            </p>
            <div class="flex items-center gap-3 pt-2">
              <div class="w-10 h-10 rounded-full bg-corn-200 flex items-center justify-center font-bold text-charcoal-800">R</div>
              <div>
                <h4 class="font-bold text-charcoal-800 dark:text-white">Roni Kusuma</h4>
                <span class="text-[10px] text-charcoal-400 uppercase tracking-wider font-bold">Pembeli Terverifikasi</span>
              </div>
            </div>
          </div>

          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-6 rounded-3xl border space-y-4 shadow-premium">
            <div class="flex items-center gap-1 text-corn-500">⭐⭐⭐⭐⭐</div>
            <p class="text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium italic">
              "Himalayan Salt luar biasa. Bahan-bahan yang sangat bersih, dipopcorn dengan sempurna, dan sangat ringan. Sangat cocok untuk nonton film tanpa merasa berat atau kembung setelahnya."
            </p>
            <div class="flex items-center gap-3 pt-2">
              <div class="w-10 h-10 rounded-full bg-corn-200 flex items-center justify-center font-bold text-charcoal-800">S</div>
              <div>
                <h4 class="font-bold text-charcoal-800 dark:text-white">Sarah Amalia</h4>
                <span class="text-[10px] text-charcoal-400 uppercase tracking-wider font-bold">Pecinta Kesehatan</span>
              </div>
            </div>
          </div>

          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-6 rounded-3xl border space-y-4 shadow-premium">
            <div class="flex items-center gap-1 text-corn-500">⭐⭐⭐⭐⭐</div>
            <p class="text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium italic">
              "Spicy Cheese Lava memiliki sensasi pedas yang pas dengan lapisan cheddar asli yang lezat. Melebihi semua ekspektasi. Pengiriman cepat dan kemasan premium yang dapat ditutup kembali juga."
            </p>
            <div class="flex items-center gap-3 pt-2">
              <div class="w-10 h-10 rounded-full bg-corn-200 flex items-center justify-center font-bold text-charcoal-800">A</div>
              <div>
                <h4 class="font-bold text-charcoal-800 dark:text-white">Adi Wijaya</h4>
                <span class="text-[10px] text-charcoal-400 uppercase tracking-wider font-bold">Pecinta Kuliner</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Curated FAQ Section -->
      <div class="max-w-4xl mx-auto px-6 py-24 border-t border-charcoal-150 dark:border-charcoal-900">
        <div class="text-center mb-16 space-y-4">
          <h2 class="text-3xl sm:text-4xl font-display font-extrabold text-charcoal-800 dark:text-white">
            Pertanyaan Umum
          </h2>
          <p class="text-charcoal-500 dark:text-charcoal-400 font-medium">
            Semua yang perlu Anda ketahui tentang popcorn premium kami.
          </p>
        </div>

        <div class="space-y-6">
          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-6 rounded-2xl border space-y-2">
            <h4 class="font-display font-extrabold text-base text-charcoal-800 dark:text-white">Berapa lama masa simpannya?</h4>
            <p class="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium">
              Popcorn premium kami tetap segar hingga 6 bulan dari tanggal pembuatan. Simpan di tempat sejuk dan kering, lalu tutup kembali kemasan zip lock premium setelah dibuka.
            </p>
          </div>

          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-6 rounded-2xl border space-y-2">
            <h4 class="font-display font-extrabold text-base text-charcoal-800 dark:text-white">Apakah biji jagung Anda organik dan aman?</h4>
            <p class="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium">
              Ya, tentu! Kami menggunakan biji premium 100% organik dan non-rekayasa genetik dari pertanian organik bersertifikat, memastikan tidak ada pestisida berat atau semprotan kimia buatan yang digunakan.
            </p>
          </div>

          <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark' : 'glassmorphism-light'"
               class="p-6 rounded-2xl border space-y-2">
            <h4 class="font-display font-extrabold text-base text-charcoal-800 dark:text-white">Apakah Anda mengirim ke seluruh Indonesia?</h4>
            <p class="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed font-medium">
              Kami mengirim ke seluruh provinsi di Indonesia menggunakan jaringan kurir premium (JNE, J&T, SiCepat). Biaya pengiriman dihitung secara dinamis secara real-time di halaman checkout.
            </p>
          </div>
        </div>
      </div>

      <!-- 6. Instagram Mock Gallery -->
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-24 border-t border-charcoal-150 dark:border-charcoal-900">
        <div class="text-center max-w-xl mx-auto mb-16 space-y-4">
          <h2 class="text-3xl sm:text-4xl font-display font-extrabold text-charcoal-800 dark:text-white">
            Bagikan Momen Camilan Anda
          </h2>
          <p class="text-charcoal-500 dark:text-charcoal-400 font-medium">
            Tag kami <span class="text-corn-500 font-bold">&#64;FitcornPremium</span> untuk ditampilkan di feed kami!
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="aspect-square rounded-2xl bg-charcoal-100 dark:bg-charcoal-900 overflow-hidden flex items-center justify-center text-4xl relative group">
            🍿
            <span class="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-xs font-bold text-white tracking-widest uppercase">Lihat Postingan</span>
          </div>
          <div class="aspect-square rounded-2xl bg-charcoal-100 dark:bg-charcoal-900 overflow-hidden flex items-center justify-center text-4xl relative group">
            😋
            <span class="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-xs font-bold text-white tracking-widest uppercase">Lihat Postingan</span>
          </div>
          <div class="aspect-square rounded-2xl bg-charcoal-100 dark:bg-charcoal-900 overflow-hidden flex items-center justify-center text-4xl relative group">
            😍
            <span class="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-xs font-bold text-white tracking-widest uppercase">Lihat Postingan</span>
          </div>
          <div class="aspect-square rounded-2xl bg-charcoal-100 dark:bg-charcoal-900 overflow-hidden flex items-center justify-center text-4xl relative group">
            ✨
            <span class="absolute inset-0 bg-charcoal-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-xs font-bold text-white tracking-widest uppercase">Lihat Postingan</span>
          </div>
        </div>
      </div>

      <!-- 7. Newsletter Signup -->
      <div class="max-w-5xl mx-auto px-6 py-24">
        <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
             class="p-12 rounded-3xl border text-center space-y-6 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-corn-300 to-corn-500"></div>

          <div class="max-w-md mx-auto space-y-3">
            <h2 class="text-3xl font-display font-extrabold text-charcoal-800 dark:text-white">
              Dapatkan Diskon 10% Pesanan Pertama
            </h2>
            <p class="text-sm text-charcoal-500 dark:text-charcoal-400 font-medium leading-relaxed">
              Bergabunglah dengan klub eksklusif kami. Dapatkan pengumuman resep premium, diskon kilat, dan peluncuran rasa eksklusif untuk anggota.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input type="email" placeholder="Masukkan alamat email"
                   [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                   class="flex-grow px-5 py-3 rounded-md border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400 text-sm font-medium" />
            <button class="px-8 py-3.5 font-sans font-bold text-xs uppercase tracking-widest rounded-md bg-corn-400 hover:bg-corn-500 text-charcoal-900 shadow-md hover:shadow-lg transition-all duration-300 shrink-0 cursor-pointer">
              Berlangganan
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  themeService = inject(ThemeService);
  private productsService = inject(ProductsService);

  featuredProducts = signal<any[]>([]);

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.productsService.getFeatured().subscribe({
      next: (res) => this.featuredProducts.set(res || []),
      error: () => this.featuredProducts.set([])
    });
  }
}
