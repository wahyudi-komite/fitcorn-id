import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="max-w-md mx-auto px-6 py-16 sm:py-24 font-sans transition-colors duration-300">
      <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
           class="p-8 rounded-xl border space-y-6 shadow-premium relative overflow-hidden">

        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-corn-300 to-corn-500"></div>

        <div class="text-center space-y-4">
          <a routerLink="/" class="inline-block hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="FITCORN Logo" class="h-16 mx-auto w-auto object-contain" />
          </a>
          <h1 class="text-3xl font-display font-extrabold text-charcoal-800 dark:text-white mt-2">
            Buat Akun
          </h1>
          <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider">
            Bergabunglah dengan komunitas camilan sehat Fitcorn
          </p>
        </div>

        <form (submit)="onSubmit()" class="space-y-4 text-sm font-medium">
          <div class="space-y-4">
            <app-input [(ngModel)]="fullName" type="text" label="Nama Lengkap" placeholder="e.g. Wahyudi" [required]="true" name="fullName"></app-input>
            <app-input [(ngModel)]="email" type="email" label="Alamat Email" placeholder="e.g. customer@fitcorn.com" [required]="true" name="email"></app-input>
            <div class="relative">
              <label class="block text-[10px] font-bold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-widest mb-2">Kata Sandi</label>
              <input [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" name="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" required
                     class="w-full px-4 py-3 pr-12 rounded-md border bg-transparent text-charcoal-800 dark:text-white border-charcoal-200 dark:border-charcoal-700 placeholder-charcoal-400 dark:placeholder-charcoal-500 focus:outline-none focus:border-corn-400 transition-all duration-200 text-sm" />
              <button type="button" (click)="togglePassword()" tabindex="-1"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-corn-500 cursor-pointer text-lg leading-none">
                {{ showPassword() ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="pt-4 space-y-3">
            <app-button type="submit" [loading]="loading()" [fullWidth]="true" size="lg">&#x2728; Daftar Sekarang</app-button>

            @if (errorMsg()) {
              <div class="p-3 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {{ errorMsg() }}
              </div>
            }
          </div>
        </form>

        <div class="relative flex items-center gap-3 py-2">
          <div class="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-700"></div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-charcoal-400 dark:text-charcoal-300">atau daftar dengan</span>
          <div class="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-700"></div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <button (click)="authService.socialLogin('google')" type="button"
                  class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-charcoal-200 dark:border-charcoal-600 bg-transparent dark:bg-charcoal-900/40 hover:bg-charcoal-100 dark:hover:bg-charcoal-800/60 transition-colors cursor-pointer text-sm font-medium text-charcoal-700 dark:text-charcoal-200">
            <span class="text-lg">G</span>
            <span class="hidden sm:inline text-xs">Google</span>
          </button>
          <button (click)="authService.socialLogin('facebook')" type="button"
                  class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-charcoal-200 dark:border-charcoal-600 bg-transparent dark:bg-charcoal-900/40 hover:bg-charcoal-100 dark:hover:bg-charcoal-800/60 transition-colors cursor-pointer text-sm font-medium text-charcoal-700 dark:text-charcoal-200">
            <span class="text-lg">f</span>
            <span class="hidden sm:inline text-xs">Facebook</span>
          </button>
          <button (click)="authService.socialLogin('instagram')" type="button"
                  class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-charcoal-200 dark:border-charcoal-600 bg-transparent dark:bg-charcoal-900/40 hover:bg-charcoal-100 dark:hover:bg-charcoal-800/60 transition-colors cursor-pointer text-sm font-medium text-charcoal-700 dark:text-charcoal-200">
            <span class="text-lg">IG</span>
            <span class="hidden sm:inline text-xs">Instagram</span>
          </button>
        </div>

        <div class="relative flex items-center gap-3 py-1">
          <div class="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-700"></div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-charcoal-400 dark:text-charcoal-300">atau via WhatsApp</span>
          <div class="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-700"></div>
        </div>

        <form (submit)="onRegisterWithPhone($event)" class="space-y-3">
          <app-input [(ngModel)]="phoneRegister" type="tel" label="Nomor WhatsApp" placeholder="e.g. 082132976457" [required]="true" name="phoneRegister"></app-input>
          <app-button type="submit" [disabled]="!phoneRegister || sendingOtpReg()" [loading]="sendingOtpReg()" [fullWidth]="true">Kirim OTP via WhatsApp</app-button>
          @if (otpMsgReg()) {
            <div class="p-2 text-center text-xs font-semibold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30 rounded-md">
              {{ otpMsgReg() }}
            </div>
          }
          @if (otpErrorReg()) {
            <div class="p-2 text-center text-xs font-semibold text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-500/15 border border-red-500/20 dark:border-red-500/30 rounded-md">
              {{ otpErrorReg() }}
            </div>
          }
        </form>

        <div class="text-center text-xs font-semibold text-charcoal-400 dark:text-charcoal-300 pt-2 border-t border-charcoal-100 dark:border-charcoal-800">
          Sudah punya akun?
          <a routerLink="/login" class="text-corn-500 hover:underline">Login di sini</a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  loading = signal<boolean>(false);
  errorMsg = signal<string>('');
  showPassword = signal<boolean>(false);

  phoneRegister = '';
  sendingOtpReg = signal<boolean>(false);
  otpMsgReg = signal<string>('');
  otpErrorReg = signal<string>('');

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (!this.fullName || !this.email || !this.password) return;

    this.loading.set(true);
    this.errorMsg.set('');

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.authService.login({ email: this.email, password: this.password }).subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/']);
          },
          error: () => {
            this.loading.set(false);
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.errorMsg.set(err.error?.message || 'Gagal membuat akun. Email mungkin sudah terdaftar.');
        this.loading.set(false);
      }
    });
  }

  onRegisterWithPhone(event: Event) {
    event.preventDefault();
    if (!this.phoneRegister) return;

    this.sendingOtpReg.set(true);
    this.otpMsgReg.set('');
    this.otpErrorReg.set('');

    this.authService.sendOtp(this.phoneRegister).subscribe({
      next: () => {
        this.sendingOtpReg.set(false);
        this.otpMsgReg.set('OTP terkirim! Cek WhatsApp Anda (cek server console di mode development)');

        // Navigate to login page with phone pre-filled for OTP verification
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.sendingOtpReg.set(false);
        this.otpErrorReg.set(err.error?.message || 'Gagal mengirim OTP');
      }
    });
  }
}
