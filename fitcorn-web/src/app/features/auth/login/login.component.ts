import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { PasswordInputComponent } from '../../../shared/ui/password-input/password-input.component';
import { GlassmorphismDirective } from '../../../shared/directives/glassmorphism.directive';

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
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    PasswordInputComponent,
    GlassmorphismDirective
  ],
  template: `
    <div class="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(252,211,77,0.22),_transparent_35%),linear-gradient(180deg,_#fffdf5_0%,_#ffffff_40%,_#fff9ee_100%)] transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.14),_transparent_32%),linear-gradient(180deg,_#0a0a0b_0%,_#121214_100%)]">
      <div class="auth-grid absolute inset-0 opacity-45 pointer-events-none"></div>
      <div class="auth-orb auth-orb-left pointer-events-none"></div>
      <div class="auth-orb auth-orb-right pointer-events-none"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        
        <!-- Login Card -->
        <section appGlassmorphism
                 class="relative w-full max-w-[520px] rounded-[2.5rem] border p-8 shadow-2xl overflow-hidden flex flex-col justify-center">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-corn-300 to-corn-500"></div>

            <div class="space-y-8">
              <div class="space-y-4">
                <a routerLink="/" class="inline-flex items-center gap-2.5 lg:hidden">
                  <img src="/logo.png" alt="FITCORN Logo" class="h-10 w-auto object-contain" />
                  <span class="text-[11px] font-bold uppercase tracking-[0.26em] text-corn-600 dark:text-corn-400">Fitcorn Account</span>
                </a>

                <div class="space-y-2">
                  <p class="text-[11px] font-bold uppercase tracking-[0.32em] text-corn-600 dark:text-corn-400">Welcome Back</p>
                  <h1 class="font-display text-3xl font-extrabold tracking-tight text-charcoal-800 dark:text-white sm:text-4xl">
                    Masuk pantry Anda
                  </h1>
                  <p class="text-sm leading-relaxed text-charcoal-500 dark:text-charcoal-400">
                    Akses pantry Anda dengan email, media sosial, atau verifikasi WhatsApp cepat.
                  </p>
                </div>
              </div>

              <!-- Quick Access (Social Login) -->
              <div class="rounded-2xl border border-charcoal-100 bg-charcoal-50/50 p-4 dark:border-white/5 dark:bg-white/3">
                <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal-400 dark:text-charcoal-500 mb-3">Masuk Cepat</p>
                <div class="grid gap-3 sm:grid-cols-3">
                  
                  <!-- Google Login Button -->
                  <button
                    type="button"
                    (click)="authService.socialLogin('google')"
                    class="group flex items-center gap-2.5 rounded-xl border border-charcoal-200 bg-white/70 px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500/45 hover:bg-white hover:shadow-[0_8px_20px_-6px_rgba(239,68,68,0.16)] dark:border-white/10 dark:bg-charcoal-900/60 dark:hover:border-red-500/30 cursor-pointer"
                  >
                    <svg class="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <div>
                      <p class="text-xs font-bold text-charcoal-800 dark:text-white leading-none">Google</p>
                      <span class="text-[8px] font-semibold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-wider block mt-0.5">1-Click</span>
                    </div>
                  </button>

                  <!-- Facebook Login Button -->
                  <button
                    type="button"
                    (click)="authService.socialLogin('facebook')"
                    class="group flex items-center gap-2.5 rounded-xl border border-charcoal-200 bg-white/70 px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/45 hover:bg-white hover:shadow-[0_8px_20px_-6px_rgba(59,130,246,0.16)] dark:border-white/10 dark:bg-charcoal-900/60 dark:hover:border-blue-500/30 cursor-pointer"
                  >
                    <svg class="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.44 23.08 10.25 24v-8.44H7.18v-3.49h3.07V9.42c0-3.03 1.8-4.71 4.57-4.71 1.33 0 2.72.24 2.72.24v2.99h-1.53c-1.5 0-1.97.93-1.97 1.88v2.26h3.37l-.54 3.49h-2.83V24C19.56 23.08 24 18.1 24 12.07z" fill="#1877F2"/>
                    </svg>
                    <div>
                      <p class="text-xs font-bold text-charcoal-800 dark:text-white leading-none">Facebook</p>
                      <span class="text-[8px] font-semibold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-wider block mt-0.5">Social</span>
                    </div>
                  </button>

                  <!-- Instagram Login Button -->
                  <button
                    type="button"
                    (click)="authService.socialLogin('instagram')"
                    class="group flex items-center gap-2.5 rounded-xl border border-charcoal-200 bg-white/70 px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-500/45 hover:bg-white hover:shadow-[0_8px_20px_-6px_rgba(236,72,153,0.16)] dark:border-white/10 dark:bg-charcoal-900/60 dark:hover:border-pink-500/30 cursor-pointer"
                  >
                    <svg class="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.05.42 2.22.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.05.37-2.22.42-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.42-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.42-.37-1.05-.42-2.22-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.42-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.05-.37 2.22-.42 1.27-.06 1.64-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.92.56a5.92 5.92 0 00-2.14 1.39A5.92 5.92 0 00.6 4.16C.3 4.93.1 5.8.04 7.08.01 8.36 0 8.77 0 12s.01 3.64.07 4.92c.06 1.28.26 2.15.56 2.92a5.92 5.92 0 001.39 2.14 5.92 5.92 0 002.14 1.39c.77.3 1.64.5 2.92.56 1.28.06 1.69.07 4.92.07s3.64-.01 4.92-.07c1.28-.06 2.15-.26 2.92-.56a5.92 5.92 0 002.14-1.39 5.92 5.92 0 001.39-2.14c.3-.77.5-1.64.56-2.92.06-1.28.07-1.69.07-4.92s-.01-3.64-.07-4.92c-.06-1.28-.26-2.15-.56-2.92a5.92 5.92 0 00-1.39-2.14 5.92 5.92 0 00-2.14-1.39c-.77-.3-1.64-.5-2.92-.56C15.67.01 15.26 0 12 0z" fill="url(#ig-grad)"/>
                      <path d="M12 5.83a6.17 6.17 0 100 12.34 6.17 6.17 0 000-12.34zm0 10.18a4 4 0 110-8 4 4 0 010 8z" fill="url(#ig-grad)"/>
                      <circle cx="18.4" cy="5.6" r="1.44" fill="url(#ig-grad)"/>
                      <defs>
                        <radialGradient id="ig-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2.7 20.4) rotate(-45) scale(25.9)">
                          <stop offset="0" stop-color="#FEC564"/>
                          <stop offset="0.25" stop-color="#F783AC"/>
                          <stop offset="0.5" stop-color="#DA5EAA"/>
                          <stop offset="0.75" stop-color="#B135B3"/>
                          <stop offset="1" stop-color="#4F5BD5"/>
                        </radialGradient>
                      </defs>
                    </svg>
                    <div>
                      <p class="text-xs font-bold text-charcoal-800 dark:text-white leading-none">Instagram</p>
                      <span class="text-[8px] font-semibold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-wider block mt-0.5">Creator</span>
                    </div>
                  </button>

                </div>
              </div>

              <!-- Divider -->
              <div class="relative flex items-center gap-3">
                <div class="h-px flex-1 bg-charcoal-100 dark:bg-white/10"></div>
                <span class="shrink-0 text-[9px] font-bold uppercase tracking-[0.22em] text-charcoal-400 dark:text-charcoal-500">atau gunakan email</span>
                <div class="h-px flex-1 bg-charcoal-100 dark:bg-white/10"></div>
              </div>

              <!-- Email Form -->
              <form (submit)="onSubmit()" class="space-y-5">
                <div class="space-y-6">
                  <app-input
                    [(ngModel)]="email"
                    type="email"
                    label="Alamat Email"
                    placeholder="customer@fitcorn.com"
                    [required]="true"
                    name="email"
                    class="block"
                    (ngModelChange)="clearEmailError()"
                    [error]="emailError()"
                  ></app-input>
                  <app-password-input
                    [(ngModel)]="password"
                    label="Kata Sandi"
                    placeholder="Masukkan kata sandi Anda"
                    [required]="true"
                    name="password"
                    class="block"
                    (ngModelChange)="clearPasswordError()"
                    [error]="passwordError()"
                  ></app-password-input>
                </div>

                <div class="flex items-center justify-between gap-4 text-xs font-medium">
                  <span class="text-charcoal-400 dark:text-charcoal-500">Gunakan email checkout Anda.</span>
                  <a routerLink="/" class="shrink-0 text-charcoal-500 hover:text-corn-500 transition-colors duration-200 dark:text-charcoal-400 dark:hover:text-corn-400">
                    Lupa sandi?
                  </a>
                </div>

                <app-button type="submit" [loading]="loading()" [fullWidth]="true" size="lg" customClass="justify-center">
                  Masuk Pantry
                </app-button>

                @if (errorMsg()) {
                  <div class="rounded-xl border border-red-200/60 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-600 dark:border-red-500/20 dark:text-red-400">
                    {{ errorMsg() }}
                  </div>
                }
              </form>

              <!-- WhatsApp OTP Flow -->
              <div class="relative flex items-center gap-3">
                <div class="h-px flex-1 bg-charcoal-100 dark:bg-white/10"></div>
                <span class="shrink-0 text-[9px] font-bold uppercase tracking-[0.22em] text-charcoal-400 dark:text-charcoal-500">atau via whatsapp otp</span>
                <div class="h-px flex-1 bg-charcoal-100 dark:bg-white/10"></div>
              </div>

              @if (!otpSent()) {
                <form (submit)="onSendOtp($event)" class="space-y-6 rounded-2xl border border-charcoal-100 bg-charcoal-50/50 p-5 dark:border-white/5 dark:bg-white/3">
                  <div class="space-y-1">
                    <p class="text-xs font-bold text-charcoal-800 dark:text-white">Login Tanpa Kata Sandi</p>
                    <p class="text-xs leading-relaxed text-charcoal-500 dark:text-charcoal-400">Kirim OTP instan ke nomor WhatsApp aktif Anda.</p>
                  </div>

                  <app-input
                    [(ngModel)]="phone"
                    type="tel"
                    label="Nomor WhatsApp"
                    placeholder="0821xxxxxxxx"
                    [required]="true"
                    name="phone"
                    class="block"
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
                    <div class="rounded-xl border border-emerald-200/60 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-600 dark:border-emerald-500/20 dark:text-emerald-400">
                      {{ otpMsg() }}
                    </div>
                  }

                  @if (otpError()) {
                    <div class="rounded-xl border border-red-200/60 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-600 dark:border-red-500/20 dark:text-red-400">
                      {{ otpError() }}
                    </div>
                  }
                </form>
              } @else {
                <form (submit)="onVerifyOtp($event)" class="space-y-6 rounded-2xl border border-charcoal-100 bg-charcoal-50/50 p-5 dark:border-white/5 dark:bg-white/3">
                  <div class="space-y-1">
                    <p class="text-xs font-bold text-charcoal-800 dark:text-white">Verifikasi OTP WhatsApp</p>
                    <p class="text-xs leading-relaxed text-charcoal-500 dark:text-charcoal-400">Masukkan kode 6 digit yang dikirim ke nomor WhatsApp Anda.</p>
                  </div>

                  <div class="space-y-2">
                    <label class="ds-label">Kode Verifikasi</label>
                    <input
                      [(ngModel)]="otp"
                      name="otp"
                      type="text"
                      placeholder="000000"
                      required
                      maxlength="6"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      class="w-full rounded-xl border border-charcoal-200 bg-white/90 px-4 py-3.5 text-center text-xl font-bold tracking-[0.4em] text-charcoal-800 outline-none transition-all duration-200 placeholder:text-charcoal-300 focus:border-corn-400 focus:ring-4 focus:ring-corn-400/10 dark:border-white/10 dark:bg-charcoal-950 dark:text-white dark:placeholder:text-charcoal-600"
                    />
                    <p class="text-[10px] font-medium text-charcoal-400 dark:text-charcoal-500">Tips: Di lingkungan dev, kode juga tertera pada log console server.</p>
                  </div>

                  <div class="grid gap-3 sm:grid-cols-2">
                    <app-button
                      type="submit"
                      [disabled]="!otp || otp.length < 6 || verifyingOtp()"
                      [loading]="verifyingOtp()"
                      [fullWidth]="true"
                      customClass="justify-center"
                    >
                      Verifikasi
                    </app-button>
                    <app-button variant="outline" type="button" (onClick)="resetOtp()" [fullWidth]="true" customClass="justify-center">
                      Ubah Nomor
                    </app-button>
                  </div>

                  @if (otpError()) {
                    <div class="rounded-xl border border-red-200/60 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-600 dark:border-red-500/20 dark:text-red-400">
                      {{ otpError() }}
                    </div>
                  }
                </form>
              }

              <!-- Register Footnote -->
              <div class="rounded-2xl border border-charcoal-100 bg-white/40 px-5 py-4 text-xs font-semibold text-charcoal-500 dark:border-white/5 dark:bg-white/3 dark:text-charcoal-350">
                Belum terdaftar?
                <a routerLink="/daftar" class="ml-1 text-corn-600 hover:text-corn-700 transition-colors duration-200 dark:text-corn-400 dark:hover:text-corn-300">
                  Buat akun baru di sini
                </a>
              </div>
            </div>
          </section>
      </div>
    </div>
  `,
  styles: [`
    .auth-grid {
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 36px 36px;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.4), transparent 94%);
    }

    .auth-orb {
      position: absolute;
      width: 28rem;
      height: 28rem;
      border-radius: 9999px;
      filter: blur(80px);
      opacity: 0.22;
    }

    .auth-orb-left {
      top: -6rem;
      left: -10rem;
      background: rgba(252, 211, 77, 0.8);
    }

    .auth-orb-right {
      right: -8rem;
      bottom: -8rem;
      background: rgba(217, 119, 6, 0.4);
    }

    :host-context(.dark) .auth-grid {
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
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
