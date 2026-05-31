import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { PasswordInputComponent } from '../../../shared/ui/password-input/password-input.component';

type SocialProvider = {
  key: 'google' | 'facebook' | 'instagram';
  label: string;
  hint: string;
};

type TrustPoint = {
  value: string;
  label: string;
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, InputComponent, PasswordInputComponent],
  template: `
    <div class="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(252,211,77,0.2),_transparent_30%),linear-gradient(180deg,_#fffdf7_0%,_#ffffff_40%,_#fff9ee_100%)] transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.12),_transparent_28%),linear-gradient(180deg,_var(--color-charcoal-950)_0%,_var(--color-charcoal-900)_100%)]">
      <div class="auth-grid absolute inset-0 opacity-50 pointer-events-none"></div>
      <div class="auth-orb auth-orb-left pointer-events-none"></div>
      <div class="auth-orb auth-orb-right pointer-events-none"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div class="grid min-h-[calc(100vh-6rem)] items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_520px]">
          <section class="hidden lg:flex lg:flex-col lg:justify-between rounded-[2rem] border border-white/60 bg-[linear-gradient(160deg,_rgba(255,250,235,0.95),_rgba(255,255,255,0.82))] p-10 shadow-[0_24px_80px_-32px_rgba(146,64,14,0.28)] backdrop-blur dark:border-white/8 dark:bg-[linear-gradient(160deg,_rgba(28,28,30,0.92),_rgba(18,18,20,0.9))] dark:shadow-[0_28px_90px_-40px_rgba(0,0,0,0.7)]">
            <div class="space-y-8">
              <a routerLink="/" class="inline-flex items-center gap-3 text-charcoal-800 transition-transform duration-300 hover:scale-[1.02] dark:text-white">
                <img src="/logo.png" alt="FITCORN Logo" class="h-14 w-auto object-contain" />
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-corn-600 dark:text-corn-300">Fitcorn account</p>
                  <p class="mt-1 font-display text-2xl font-extrabold">Masuk ke pantry pribadi Anda</p>
                </div>
              </a>

              <div class="space-y-5">
                <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-700 dark:text-corn-300">Clean snacking starts here</p>
                <h1 class="max-w-xl font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-charcoal-800 dark:text-white">
                  Login yang terasa
                  <span class="block text-charcoal-500 dark:text-charcoal-300">lebih premium, lebih jelas.</span>
                </h1>
                <p class="max-w-lg text-base leading-8 text-charcoal-600 dark:text-charcoal-350">
                  Pantau repeat order, lanjutkan checkout, dan akses riwayat camilan favorit tanpa harus memulai dari awal setiap kali kembali.
                </p>
              </div>

              <div class="grid gap-4 sm:grid-cols-3">
                @for (point of trustPoints; track point.label) {
                  <div class="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-white/8 dark:bg-white/5">
                    <p class="font-display text-3xl font-extrabold text-corn-600 dark:text-corn-300">{{ point.value }}</p>
                    <p class="mt-2 text-sm font-semibold leading-6 text-charcoal-600 dark:text-charcoal-350">{{ point.label }}</p>
                  </div>
                }
              </div>

              <div class="rounded-[1.75rem] border border-charcoal-100 bg-[linear-gradient(180deg,_#2f2418_0%,_#18120d_100%)] p-7 text-white shadow-xl dark:border-white/8">
                <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-corn-300">Member flow</p>
                <div class="mt-5 grid gap-4">
                  <div class="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p class="text-xs font-bold uppercase tracking-[0.22em] text-white/45">01</p>
                    <h2 class="mt-2 font-display text-2xl font-extrabold">Akses checkout lebih cepat</h2>
                    <p class="mt-2 text-sm leading-7 text-white/70">Alamat, keranjang, dan preferensi Anda bisa langsung lanjut tanpa isi ulang semuanya.</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p class="text-xs font-bold uppercase tracking-[0.22em] text-white/45">02</p>
                    <h2 class="mt-2 font-display text-2xl font-extrabold">Riwayat order tetap rapi</h2>
                    <p class="mt-2 text-sm leading-7 text-white/70">Lebih mudah repeat produk terlaris atau cek pesanan sebelumnya saat ingin stok ulang.</p>
                  </div>
                </div>
              </div>
            </div>

            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-charcoal-400 dark:text-charcoal-500">
              Fresh batches. Better texture. Fewer compromises.
            </p>
          </section>

          <section class="rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_80px_-36px_rgba(146,64,14,0.28)] backdrop-blur dark:border-white/8 dark:bg-[rgba(18,18,20,0.88)] dark:shadow-[0_28px_90px_-40px_rgba(0,0,0,0.7)] sm:p-8 lg:p-10">
            <div class="space-y-8">
              <div class="space-y-5">
                <a routerLink="/" class="inline-flex items-center gap-3 lg:hidden">
                  <img src="/logo.png" alt="FITCORN Logo" class="h-12 w-auto object-contain" />
                  <span class="text-[11px] font-bold uppercase tracking-[0.26em] text-corn-700 dark:text-corn-300">Fitcorn account</span>
                </a>

                <div class="space-y-3">
                  <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-700 dark:text-corn-300">Welcome back</p>
                  <h1 class="font-display text-3xl font-extrabold tracking-tight text-charcoal-800 dark:text-white sm:text-4xl">
                    Masuk ke akun Anda
                  </h1>
                  <p class="max-w-md text-sm leading-7 text-charcoal-500 dark:text-charcoal-350">
                    Pilih cara masuk yang paling nyaman: email, social login, atau OTP WhatsApp.
                  </p>
                </div>
              </div>

              <div class="rounded-[1.5rem] border border-charcoal-100 bg-charcoal-50/70 p-4 dark:border-white/8 dark:bg-white/4">
                <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-400 dark:text-charcoal-500">Akses cepat</p>
                <div class="mt-3 grid gap-3 sm:grid-cols-3">
                  @for (provider of socialProviders; track provider.key) {
                    <button
                      type="button"
                      (click)="authService.socialLogin(provider.key)"
                      class="group rounded-2xl border border-charcoal-200 bg-white px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-corn-300 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:border-corn-400/30"
                    >
                      <p class="text-sm font-bold text-charcoal-800 dark:text-white">{{ provider.label }}</p>
                      <p class="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-400 dark:text-charcoal-500">{{ provider.hint }}</p>
                    </button>
                  }
                </div>
              </div>

              <div class="relative flex items-center gap-3">
                <div class="h-px flex-1 bg-charcoal-100 dark:bg-white/10"></div>
                <span class="shrink-0 text-[10px] font-bold uppercase tracking-[0.22em] text-charcoal-400 dark:text-charcoal-500">atau login dengan email</span>
                <div class="h-px flex-1 bg-charcoal-100 dark:bg-white/10"></div>
              </div>

              <form (submit)="onSubmit()" class="space-y-5">
                <div class="space-y-4">
                  <app-input
                    [(ngModel)]="email"
                    type="email"
                    label="Alamat Email"
                    placeholder="customer@fitcorn.com"
                    [required]="true"
                    name="email"
                    (ngModelChange)="clearEmailError()"
                    [error]="emailError()"
                  ></app-input>
                  <app-password-input
                    [(ngModel)]="password"
                    label="Kata Sandi"
                    placeholder="Masukkan kata sandi Anda"
                    [required]="true"
                    name="password"
                    (ngModelChange)="clearPasswordError()"
                    [error]="passwordError()"
                  ></app-password-input>
                </div>

                <div class="flex items-center justify-between gap-4 text-xs font-semibold">
                  <span class="text-charcoal-400 dark:text-charcoal-500">Gunakan email yang sama dengan checkout Anda sebelumnya.</span>
                  <a routerLink="/" class="shrink-0 text-charcoal-500 transition-colors duration-200 hover:text-corn-500 dark:text-charcoal-400 dark:hover:text-corn-400">
                    Lupa sandi?
                  </a>
                </div>

                <app-button type="submit" [loading]="loading()" [fullWidth]="true" size="lg" customClass="justify-center">
                  Masuk Sekarang
                </app-button>

                @if (errorMsg()) {
                  <div class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                    {{ errorMsg() }}
                  </div>
                }
              </form>

              <div class="relative flex items-center gap-3">
                <div class="h-px flex-1 bg-charcoal-100 dark:bg-white/10"></div>
                <span class="shrink-0 text-[10px] font-bold uppercase tracking-[0.22em] text-charcoal-400 dark:text-charcoal-500">atau via WhatsApp OTP</span>
                <div class="h-px flex-1 bg-charcoal-100 dark:bg-white/10"></div>
              </div>

              @if (!otpSent()) {
                <form (submit)="onSendOtp($event)" class="space-y-4 rounded-[1.5rem] border border-charcoal-100 bg-charcoal-50/70 p-5 dark:border-white/8 dark:bg-white/4">
                  <div class="space-y-2">
                    <p class="text-sm font-bold text-charcoal-800 dark:text-white">Login tanpa kata sandi</p>
                    <p class="text-sm leading-7 text-charcoal-500 dark:text-charcoal-350">Masukkan nomor WhatsApp aktif, lalu kami kirim OTP untuk verifikasi cepat.</p>
                  </div>

                  <app-input
                    [(ngModel)]="phone"
                    type="tel"
                    label="Nomor WhatsApp"
                    placeholder="082132976457"
                    [required]="true"
                    name="phone"
                  ></app-input>

                  <app-button
                    type="submit"
                    [disabled]="!phone || sendingOtp()"
                    [loading]="sendingOtp()"
                    [fullWidth]="true"
                    variant="secondary"
                    customClass="justify-center"
                  >
                    Kirim OTP via WhatsApp
                  </app-button>

                  @if (otpMsg()) {
                    <div class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                      {{ otpMsg() }}
                    </div>
                  }

                  @if (otpError()) {
                    <div class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                      {{ otpError() }}
                    </div>
                  }
                </form>
              } @else {
                <form (submit)="onVerifyOtp($event)" class="space-y-4 rounded-[1.5rem] border border-charcoal-100 bg-charcoal-50/70 p-5 dark:border-white/8 dark:bg-white/4">
                  <div class="space-y-2">
                    <p class="text-sm font-bold text-charcoal-800 dark:text-white">Masukkan kode OTP</p>
                    <p class="text-sm leading-7 text-charcoal-500 dark:text-charcoal-350">Kode 6 digit sudah kami kirim ke nomor WhatsApp yang Anda masukkan.</p>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-[10px] font-bold uppercase tracking-[0.22em] text-charcoal-400 dark:text-charcoal-500">Kode OTP</label>
                    <input
                      [(ngModel)]="otp"
                      name="otp"
                      type="text"
                      placeholder="000000"
                      required
                      maxlength="6"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      class="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-4 text-center text-xl font-bold tracking-[0.5em] text-charcoal-800 outline-none transition-all duration-200 placeholder:text-charcoal-300 focus:border-corn-400 focus:ring-2 focus:ring-corn-400/15 dark:border-white/10 dark:bg-charcoal-900 dark:text-white dark:placeholder:text-charcoal-600"
                    />
                    <p class="text-[11px] font-medium text-charcoal-400 dark:text-charcoal-500">Tips: di mode development, OTP juga bisa terlihat di console server.</p>
                  </div>

                  <div class="grid gap-3 sm:grid-cols-2">
                    <app-button
                      type="submit"
                      [disabled]="!otp || otp.length < 6 || verifyingOtp()"
                      [loading]="verifyingOtp()"
                      [fullWidth]="true"
                      customClass="justify-center"
                    >
                      Verifikasi & Masuk
                    </app-button>
                    <app-button variant="outline" type="button" (onClick)="resetOtp()" [fullWidth]="true" customClass="justify-center">
                      Gunakan Nomor Lain
                    </app-button>
                  </div>

                  @if (otpError()) {
                    <div class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                      {{ otpError() }}
                    </div>
                  }
                </form>
              }

              <div class="rounded-[1.25rem] border border-charcoal-100 bg-white/70 px-5 py-4 text-sm font-semibold text-charcoal-500 dark:border-white/8 dark:bg-white/3 dark:text-charcoal-350">
                Belum punya akun?
                <a routerLink="/daftar" class="ml-1 text-corn-600 transition-colors duration-200 hover:text-corn-700 dark:text-corn-300 dark:hover:text-corn-200">
                  Daftar di sini
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-grid {
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 34px 34px;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.45), transparent 92%);
    }

    .auth-orb {
      position: absolute;
      width: 24rem;
      height: 24rem;
      border-radius: 9999px;
      filter: blur(72px);
      opacity: 0.26;
    }

    .auth-orb-left {
      top: -5rem;
      left: -8rem;
      background: rgba(252, 211, 77, 0.88);
    }

    .auth-orb-right {
      right: -7rem;
      bottom: -6rem;
      background: rgba(217, 119, 6, 0.42);
    }

    :host-context(.dark) .auth-grid {
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
    }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal<boolean>(false);
  errorMsg = signal<string>('');
  emailError = signal('');
  passwordError = signal('');
  phone = '';
  otp = '';
  sendingOtp = signal<boolean>(false);
  verifyingOtp = signal<boolean>(false);
  otpSent = signal<boolean>(false);
  otpMsg = signal<string>('');
  otpError = signal<string>('');

  protected readonly socialProviders: SocialProvider[] = [
    { key: 'google', label: 'Google', hint: '1-click access' },
    { key: 'facebook', label: 'Facebook', hint: 'social account' },
    { key: 'instagram', label: 'Instagram', hint: 'creator flow' }
  ];

  protected readonly trustPoints: TrustPoint[] = [
    { value: '1x', label: 'login untuk akses order dan checkout lebih cepat' },
    { value: '24/7', label: 'akun Anda siap dipakai kembali kapan saja' },
    { value: 'OTP', label: 'opsi masuk cepat tanpa harus ingat password' }
  ];

  onSubmit() {
    this.emailError.set('');
    this.passwordError.set('');

    let valid = true;

    if (!this.email) {
      this.emailError.set('Email wajib diisi');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError.set('Format email tidak valid');
      valid = false;
    }

    if (!this.password) {
      this.passwordError.set('Kata sandi wajib diisi');
      valid = false;
    } else if (this.password.length < 6) {
      this.passwordError.set('Kata sandi minimal 6 karakter');
      valid = false;
    }

    if (!valid) return;

    this.loading.set(true);
    this.errorMsg.set('');

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.cartService.mergeCartOnLogin().subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/']);
          },
          error: () => {
            this.loading.set(false);
            this.router.navigate(['/']);
          }
        });
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMsg.set(err.error?.message || 'Email atau kata sandi salah. Silakan coba lagi.');
        this.loading.set(false);
      }
    });
  }

  onSendOtp(event: Event) {
    event.preventDefault();
    if (!this.phone) return;

    this.sendingOtp.set(true);
    this.otpMsg.set('');
    this.otpError.set('');

    this.authService.sendOtp(this.phone).subscribe({
      next: () => {
        this.sendingOtp.set(false);
        this.otpSent.set(true);
        this.otpMsg.set('OTP terkirim. Cek WhatsApp Anda, lalu masukkan kodenya di bawah.');
      },
      error: (err) => {
        this.sendingOtp.set(false);
        this.otpError.set(err.error?.message || 'Gagal mengirim OTP');
      }
    });
  }

  onVerifyOtp(event: Event) {
    event.preventDefault();
    if (!this.phone || !this.otp || this.otp.length < 6) return;

    this.verifyingOtp.set(true);
    this.otpError.set('');

    this.authService.verifyOtp(this.phone, this.otp).subscribe({
      next: () => {
        this.verifyingOtp.set(false);
        this.cartService.mergeCartOnLogin().subscribe({
          next: () => this.router.navigate(['/']),
          error: () => this.router.navigate(['/']),
        });
      },
      error: (err) => {
        this.verifyingOtp.set(false);
        this.otpError.set(err.error?.message || 'OTP tidak valid');
      }
    });
  }

  clearEmailError() {
    this.emailError.set('');
  }

  clearPasswordError() {
    this.passwordError.set('');
  }

  resetOtp() {
    this.otpSent.set(false);
    this.otp = '';
    this.otpMsg.set('');
    this.otpError.set('');
  }
}
