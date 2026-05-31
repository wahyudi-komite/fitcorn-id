import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { ThemeService } from '../../core/services/theme.service';
import { GlassmorphismDirective } from '../../shared/directives/glassmorphism.directive';
import { ButtonComponent, ProductCardComponent, ProductCardData } from '../../shared/ui';

type FlavorHighlight = {
  eyebrow: string;
  title: string;
  description: string;
};

type BrandPillar = {
  value: string;
  title: string;
  description: string;
};

type JourneyStep = {
  index: string;
  title: string;
  description: string;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, ProductCardComponent, GlassmorphismDirective],
  template: `
    <div class="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(252,211,77,0.24),_transparent_32%),linear-gradient(180deg,_var(--color-charcoal-50)_0%,_#fffdf6_38%,_white_100%)] text-charcoal-800 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.08),_transparent_26%),linear-gradient(180deg,_var(--color-charcoal-950)_0%,_var(--color-charcoal-900)_100%)] dark:text-white">
      <div class="hero-noise absolute inset-0 opacity-40 pointer-events-none"></div>
      <div class="hero-orb hero-orb-left pointer-events-none"></div>
      <div class="hero-orb hero-orb-right pointer-events-none"></div>

      <section class="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-32">
        <div class="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div class="space-y-8">
            <div class="inline-flex items-center gap-3 rounded-full border border-corn-200/80 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-corn-700 shadow-sm backdrop-blur dark:border-corn-400/20 dark:bg-charcoal-900/65 dark:text-corn-300">
              Better snacking, built in small batches
            </div>

            <div class="space-y-6">
              <h1 class="max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Popcorn sehat
                <span class="block text-charcoal-500 dark:text-charcoal-300">dengan rasa yang tetap berani.</span>
              </h1>
              <p class="max-w-2xl text-base leading-8 text-charcoal-600 dark:text-charcoal-350 sm:text-lg">
                Fitcorn meracik camilan premium untuk orang yang ingin makan lebih bersih tanpa mengorbankan rasa. Biji pilihan, seasoning berlapis, dan tekstur renyah yang terasa niat sejak gigitan pertama.
              </p>
            </div>

            <div class="flex flex-col gap-4 sm:flex-row">
              <app-button route="/produk" size="lg" customClass="sm:min-w-[220px] justify-center">
                Belanja Sekarang
              </app-button>
              <app-button variant="outline" size="lg" customClass="sm:min-w-[220px] justify-center" (onClick)="scrollToSection('story-section')">
                Lihat Cerita Rasa
              </app-button>
            </div>

            <div class="grid gap-4 sm:grid-cols-3">
              <div class="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-white/8 dark:bg-white/5">
                <p class="text-3xl font-display font-extrabold text-corn-600 dark:text-corn-300">0%</p>
                <p class="mt-2 text-sm font-semibold text-charcoal-600 dark:text-charcoal-350">tanpa minyak sawit dan tanpa pengawet buatan</p>
              </div>
              <div class="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-white/8 dark:bg-white/5">
                <p class="text-3xl font-display font-extrabold text-corn-600 dark:text-corn-300">3x</p>
                <p class="mt-2 text-sm font-semibold text-charcoal-600 dark:text-charcoal-350">lapisan rasa untuk finish yang lebih penuh</p>
              </div>
              <div class="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-white/8 dark:bg-white/5">
                <p class="text-3xl font-display font-extrabold text-corn-600 dark:text-corn-300">48j</p>
                <p class="mt-2 text-sm font-semibold text-charcoal-600 dark:text-charcoal-350">target kirim cepat untuk batch populer</p>
              </div>
            </div>
          </div>

          <div class="relative">
            <div appGlassmorphism class="relative overflow-hidden rounded-[2rem] border p-6 shadow-2xl shadow-corn-950/10 dark:shadow-black/30 sm:p-8">
              <div class="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,_rgba(252,211,77,0.18),_rgba(245,158,11,0.05),_transparent)]"></div>

              <div class="relative grid gap-6">
                <div class="rounded-[1.75rem] border border-charcoal-100/80 bg-[linear-gradient(180deg,_#2e2419_0%,_#15110c_100%)] p-6 text-white dark:border-white/8">
                  <div class="flex items-start justify-between gap-6">
                    <div class="space-y-3">
                      <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-corn-300">Signature Drop</p>
                      <h2 class="max-w-xs font-display text-3xl font-extrabold leading-tight">Sweet Honey Butter</h2>
                      <p class="max-w-sm text-sm leading-7 text-white/72">
                        Manis yang hangat, buttery, dan tetap ringan. Dibuat untuk jadi entry point paling aman sekaligus paling sulit dilupakan.
                      </p>
                    </div>
                    <div class="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-right backdrop-blur">
                      <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-corn-200">Mulai</p>
                      <p class="font-display text-2xl font-extrabold">Rp 25K</p>
                    </div>
                  </div>

                  <div class="mt-8 grid grid-cols-[1.15fr_0.85fr] gap-4">
                    <div class="rounded-[1.5rem] bg-[radial-gradient(circle_at_30%_25%,_rgba(255,255,255,0.16),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.08),_rgba(255,255,255,0.02))] p-5">
                      <div class="flex h-full flex-col justify-between">
                        <div class="space-y-2">
                          <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">Flavor Notes</p>
                          <div class="flex flex-wrap gap-2">
                            <span class="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/80">golden honey</span>
                            <span class="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/80">brown butter</span>
                            <span class="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/80">sea salt finish</span>
                          </div>
                        </div>
                        <div class="mt-6 rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                          <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Texture</p>
                          <div class="mt-3 h-2 rounded-full bg-white/10">
                            <div class="h-2 w-[86%] rounded-full bg-[linear-gradient(90deg,_#fde68a,_#f59e0b)]"></div>
                          </div>
                          <p class="mt-3 text-xs font-semibold text-white/65">Crisp, light, dan tidak meninggalkan rasa berminyak.</p>
                        </div>
                      </div>
                    </div>

                    <div class="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(252,211,77,0.95)_0%,_rgba(245,158,11,0.92)_54%,_rgba(180,83,9,0.92)_100%)] p-5 text-charcoal-900">
                      <div class="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,_rgba(255,255,255,0.55),_transparent_26%)]"></div>
                      <div class="relative flex h-full flex-col justify-between">
                        <div>
                          <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-700/70">Snack Meter</p>
                          <p class="mt-2 font-display text-5xl font-extrabold">4.9</p>
                          <p class="mt-2 text-sm font-semibold text-charcoal-700/75">favorit untuk stok meja kerja dan movie night</p>
                        </div>
                        <div class="rounded-2xl bg-charcoal-900/10 px-4 py-3 backdrop-blur">
                          <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-charcoal-700/60">Batch Weekly</p>
                          <p class="mt-1 text-xl font-display font-extrabold">Fresh roasted every week</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid gap-4 sm:grid-cols-3">
                  @for (item of flavorHighlights; track item.title) {
                    <div class="rounded-2xl border border-charcoal-100/90 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/8 dark:bg-white/5">
                      <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-corn-600 dark:text-corn-300">{{ item.eyebrow }}</p>
                      <h3 class="mt-3 font-display text-xl font-extrabold">{{ item.title }}</h3>
                      <p class="mt-3 text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">{{ item.description }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="story-section" class="relative border-y border-charcoal-150/70 bg-white/70 py-16 backdrop-blur dark:border-white/8 dark:bg-white/4">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
          <div class="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl space-y-4">
              <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-600 dark:text-corn-300">Flavor stories</p>
              <h2 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Tiga profil rasa untuk tiga mood ngemil yang berbeda.
              </h2>
            </div>
            <p class="max-w-xl text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">
              Kami tidak membuat katalog yang ramai tanpa arah. Setiap lini rasa punya peran yang jelas, dari yang comforting sampai yang paling intens.
            </p>
          </div>

          <div class="mt-10 grid gap-5 lg:grid-cols-3">
            <div class="rounded-[1.75rem] border border-charcoal-100 bg-[linear-gradient(180deg,_#fff7db_0%,_#ffffff_100%)] p-7 shadow-sm dark:border-white/8 dark:bg-[linear-gradient(180deg,_rgba(251,191,36,0.16)_0%,_rgba(255,255,255,0.02)_100%)]">
              <p class="text-[11px] font-bold uppercase tracking-[0.3em] text-corn-700 dark:text-corn-300">Soft Sweet</p>
              <h3 class="mt-4 font-display text-2xl font-extrabold">Buttery comfort</h3>
              <p class="mt-4 text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">
                Profil yang hangat dan mudah disukai. Cocok untuk repeat order dan cocok juga jadi hadiah aman buat orang yang baru kenal Fitcorn.
              </p>
            </div>

            <div class="rounded-[1.75rem] border border-charcoal-100 bg-[linear-gradient(180deg,_#fff1e3_0%,_#ffffff_100%)] p-7 shadow-sm dark:border-white/8 dark:bg-[linear-gradient(180deg,_rgba(217,119,6,0.18)_0%,_rgba(255,255,255,0.02)_100%)]">
              <p class="text-[11px] font-bold uppercase tracking-[0.3em] text-corn-700 dark:text-corn-300">Savory Hit</p>
              <h3 class="mt-4 font-display text-2xl font-extrabold">Clean salty finish</h3>
              <p class="mt-4 text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">
                Untuk yang suka rasa gurih tegas, ringan di lidah, dan tidak bikin cepat enek. Ideal untuk kerja, belajar, atau perjalanan.
              </p>
            </div>

            <div class="rounded-[1.75rem] border border-charcoal-100 bg-[linear-gradient(180deg,_#ffe7d8_0%,_#ffffff_100%)] p-7 shadow-sm dark:border-white/8 dark:bg-[linear-gradient(180deg,_rgba(180,83,9,0.24)_0%,_rgba(255,255,255,0.02)_100%)]">
              <p class="text-[11px] font-bold uppercase tracking-[0.3em] text-corn-700 dark:text-corn-300">Bold Blend</p>
              <h3 class="mt-4 font-display text-2xl font-extrabold">Layered spice</h3>
              <p class="mt-4 text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">
                Rasa paling ekspresif untuk pencari sensasi. Bumbu naik bertahap, bukan sekadar pedas, jadi tetap terasa kompleks sampai akhir.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-6 lg:px-8 py-20 sm:py-24">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div class="space-y-4">
            <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-600 dark:text-corn-300">Kenapa Fitcorn</p>
            <h2 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Dibangun seperti brand makanan modern, bukan camilan generik.
            </h2>
            <p class="max-w-xl text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">
              Fokus kami ada pada bahan, konsistensi rasa, dan pengalaman membuka kemasan yang terasa premium dari awal sampai selesai.
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-3">
            @for (item of brandPillars; track item.title) {
              <div appGlassmorphism [appGlassmorphismShadow]="false" class="rounded-[1.75rem] border p-6">
                <p class="text-3xl font-display font-extrabold text-corn-600 dark:text-corn-300">{{ item.value }}</p>
                <h3 class="mt-5 font-display text-xl font-extrabold">{{ item.title }}</h3>
                <p class="mt-3 text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">{{ item.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      @if (featuredProducts().length > 0) {
        <section id="catalog-section" class="border-y border-charcoal-150/70 bg-charcoal-50/80 py-20 dark:border-white/8 dark:bg-white/3 sm:py-24">
          <div class="max-w-7xl mx-auto px-6 lg:px-8">
            <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div class="max-w-2xl space-y-4">
                <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-600 dark:text-corn-300">Best sellers</p>
                <h2 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Produk favorit yang paling sering kembali dibeli.
                </h2>
                <p class="text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">
                  Rasa yang paling cepat habis biasanya juga paling aman untuk order pertama. Kalau ingin mulai dari yang paling populer, mulai dari sini.
                </p>
              </div>
              <app-button route="/produk" customClass="md:shrink-0">Lihat Semua Produk</app-button>
            </div>

            <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              @for (item of featuredProducts(); track item.id) {
                <app-product-card [product]="mapProduct(item)" />
              }
            </div>
          </div>
        </section>
      }

      <section class="max-w-7xl mx-auto px-6 lg:px-8 py-20 sm:py-24">
        <div class="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div class="space-y-4">
            <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-600 dark:text-corn-300">From kernel to box</p>
            <h2 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Proses yang sederhana, tapi dieksekusi dengan disiplin.
            </h2>
            <p class="max-w-xl text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">
              Kami menjaga alur produksi tetap ringkas supaya yang masuk ke produk hanya keputusan yang benar-benar berdampak pada rasa, tekstur, dan kesegaran.
            </p>
          </div>

          <div class="grid gap-4">
            @for (step of journeySteps; track step.index) {
              <div class="grid gap-4 rounded-[1.5rem] border border-charcoal-100 bg-white/80 p-5 shadow-sm dark:border-white/8 dark:bg-white/5 md:grid-cols-[76px_minmax(0,1fr)] md:items-start">
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-corn-100 font-display text-xl font-extrabold text-corn-700 dark:bg-corn-400/10 dark:text-corn-300">
                  {{ step.index }}
                </div>
                <div>
                  <h3 class="font-display text-xl font-extrabold">{{ step.title }}</h3>
                  <p class="mt-2 text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">{{ step.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="border-y border-charcoal-150/70 bg-white/70 py-20 backdrop-blur dark:border-white/8 dark:bg-white/4 sm:py-24">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
          <div class="grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <div class="space-y-4">
              <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-600 dark:text-corn-300">Community notes</p>
              <h2 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Komentar yang paling sering muncul: ringan, bersih, tapi nagih.
              </h2>
            </div>

            <div class="grid gap-5 md:grid-cols-3">
              @for (item of testimonials; track item.name) {
                <div appGlassmorphism [appGlassmorphismShadow]="false" class="rounded-[1.75rem] border p-6">
                  <p class="text-sm leading-8 text-charcoal-600 dark:text-charcoal-350">"{{ item.quote }}"</p>
                  <div class="mt-8">
                    <p class="font-display text-lg font-extrabold">{{ item.name }}</p>
                    <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-charcoal-400 dark:text-charcoal-500">{{ item.role }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="max-w-5xl mx-auto px-6 py-20 sm:py-24">
        <div class="space-y-4 text-center">
          <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-600 dark:text-corn-300">FAQ</p>
          <h2 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Pertanyaan yang paling sering ditanyakan sebelum checkout.
          </h2>
          <p class="mx-auto max-w-2xl text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">
            Jawaban singkat untuk hal-hal yang biasanya ingin dipastikan pelanggan baru.
          </p>
        </div>

        <div class="mt-10 grid gap-4">
          @for (item of faqs; track item.question) {
            <div class="rounded-[1.5rem] border border-charcoal-100 bg-white/80 p-6 shadow-sm dark:border-white/8 dark:bg-white/5">
              <h3 class="font-display text-xl font-extrabold">{{ item.question }}</h3>
              <p class="mt-3 text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">{{ item.answer }}</p>
            </div>
          }
        </div>
      </section>

      <section class="max-w-6xl mx-auto px-6 pb-20 sm:pb-24">
        <div appGlassmorphism class="relative overflow-hidden rounded-[2rem] border px-6 py-10 shadow-2xl shadow-corn-950/10 dark:shadow-black/30 sm:px-10 sm:py-14">
          <div class="absolute inset-0 bg-[linear-gradient(120deg,_rgba(252,211,77,0.18),_rgba(255,255,255,0),_rgba(245,158,11,0.1))]"></div>
          <div class="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div class="max-w-2xl space-y-4">
              <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-600 dark:text-corn-300">Ready to snack better</p>
              <h2 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Mulai dari rasa terlaris, lalu temukan favorit pribadi Anda.
              </h2>
              <p class="text-sm leading-7 text-charcoal-600 dark:text-charcoal-350">
                Kalau Anda baru pertama kali coba, katalog kami sudah disusun supaya mudah memilih. Produk populer ada di depan, dan detail rasa dibuat sejelas mungkin.
              </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <app-button route="/produk" size="lg" customClass="sm:min-w-[210px] justify-center">
                Jelajahi Katalog
              </app-button>
              <app-button variant="outline" size="lg" customClass="sm:min-w-[210px] justify-center" (onClick)="scrollToSection('catalog-section')">
                Lompat ke Best Seller
              </app-button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero-noise {
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
      background-size: 36px 36px;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.4), transparent 88%);
    }

    .hero-orb {
      position: absolute;
      width: 28rem;
      height: 28rem;
      border-radius: 9999px;
      filter: blur(70px);
      opacity: 0.3;
    }

    .hero-orb-left {
      top: 3rem;
      left: -10rem;
      background: rgba(252, 211, 77, 0.72);
    }

    .hero-orb-right {
      right: -8rem;
      top: 16rem;
      background: rgba(245, 158, 11, 0.32);
    }

    :host-context(.dark) .hero-noise {
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    }
  `]
})
export class HomeComponent implements OnInit {
  themeService = inject(ThemeService);
  private productsService = inject(ProductsService);

  featuredProducts = signal<any[]>([]);

  protected readonly flavorHighlights: FlavorHighlight[] = [
    {
      eyebrow: 'Balanced',
      title: 'Rasa yang tegas, bukan berisik',
      description: 'Setiap varian diracik supaya lapisan rasanya jelas. Tidak sekadar manis atau asin, tapi punya awal, tengah, dan finish.'
    },
    {
      eyebrow: 'Intentional',
      title: 'Kemasan yang enak dibuka dan mudah ditutup lagi',
      description: 'Produk dibuat untuk ritme ngemil modern: bisa dibawa, dibagi, lalu disimpan tanpa cepat melempem.'
    },
    {
      eyebrow: 'Clean',
      title: 'Bahan yang terasa ringan setelah dimakan',
      description: 'Kami menjaga resep tetap bersih supaya pengalaman ngemil terasa puas, bukan berat atau berminyak.'
    }
  ];

  protected readonly brandPillars: BrandPillar[] = [
    {
      value: '01',
      title: 'Bahan pilihan',
      description: 'Mulai dari jagung sampai seasoning, kami prioritaskan bahan yang jelas asalnya dan relevan terhadap rasa akhir.'
    },
    {
      value: '02',
      title: 'Batch kecil',
      description: 'Produksi dalam batch lebih terkontrol membantu menjaga tekstur, aroma, dan konsistensi produk saat sampai ke pelanggan.'
    },
    {
      value: '03',
      title: 'Branding matang',
      description: 'Fitcorn dibangun seperti product experience utuh, bukan cuma camilan yang dibungkus lalu dijual.'
    }
  ];

  protected readonly journeySteps: JourneyStep[] = [
    {
      index: '01',
      title: 'Kernel selection',
      description: 'Kami mulai dari biji yang pop rate-nya tinggi supaya tekstur akhir tetap ringan dan volumenya bagus.'
    },
    {
      index: '02',
      title: 'Flavor layering',
      description: 'Bumbu tidak dilempar sekaligus. Kami susun bertahap agar rasa menempel lebih merata dan tidak menumpuk di satu titik.'
    },
    {
      index: '03',
      title: 'Small-batch sealing',
      description: 'Setelah dingin dan stabil, popcorn langsung dikemas untuk menjaga crispness dan aroma saat dibuka pelanggan.'
    }
  ];

  protected readonly testimonials: Testimonial[] = [
    {
      quote: 'Biasanya popcorn premium terlihat bagus tapi rasanya biasa. Fitcorn beda, finishing rasanya bersih dan bikin ingin ambil lagi.',
      name: 'Roni Kusuma',
      role: 'Repeat customer'
    },
    {
      quote: 'Saya cari camilan yang tidak terlalu berat untuk sore hari. Yang saya suka, produk ini tetap terasa indulgent tanpa kesan berminyak.',
      name: 'Sarah Amalia',
      role: 'Healthy snacker'
    },
    {
      quote: 'Varian gurihnya rapi sekali. Tidak over-seasoned, tapi tetap punya karakter kuat. Enak untuk stok meeting dan nonton di rumah.',
      name: 'Adi Wijaya',
      role: 'Office pantry buyer'
    }
  ];

  protected readonly faqs: FaqItem[] = [
    {
      question: 'Berapa lama produk tetap enak setelah dibuka?',
      answer: 'Kalau kemasan ditutup kembali dengan rapat, tekstur masih akan tetap baik untuk beberapa kali sesi ngemil. Simpan di tempat sejuk dan kering.'
    },
    {
      question: 'Apakah Fitcorn cocok untuk order pertama sebagai hadiah?',
      answer: 'Cocok. Kami sarankan mulai dari best seller karena profil rasanya paling universal dan aman untuk penerima dengan preferensi yang berbeda.'
    },
    {
      question: 'Apakah semua produk tersedia setiap saat?',
      answer: 'Mayoritas produk inti kami rutin tersedia, tetapi beberapa batch populer bisa bergerak cepat. Produk terlaris di katalog biasanya yang paling cepat restock.'
    }
  ];

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  protected mapProduct(p: any): ProductCardData {
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      image: p.images?.[0]?.url || '/assets/popcorn.png',
      category: p.categories?.[0]?.name,
      rating: p.rating,
      soldCount: p.soldCount,
      stock: p.stock,
    };
  }

  protected scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private loadFeaturedProducts() {
    this.productsService.getFeatured().subscribe({
      next: (res) => this.featuredProducts.set(res || []),
      error: () => this.featuredProducts.set([])
    });
  }
}
