import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { PasswordInputComponent } from '../../../shared/ui/password-input/password-input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonComponent, InputComponent, PasswordInputComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-white dark:bg-charcoal-950 transition-colors duration-300">
      <!-- Decorative Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-corn-200/30 dark:bg-corn-400/5 blur-3xl animate-pulse-gentle"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-corn-300/20 dark:bg-corn-500/5 blur-3xl animate-float"></div>
        <div class="absolute top-1/4 left-16 w-2 h-2 rounded-full bg-corn-400/40 dark:bg-corn-400/20"></div>
        <div class="absolute top-3/4 right-24 w-3 h-3 rounded-full bg-corn-400/30 dark:bg-corn-400/15"></div>
        <div class="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-corn-400/30 dark:bg-corn-400/15"></div>
      </div>

      <!-- Register Card -->
      <div class="w-full max-w-md relative z-10">
        <!-- Logo & Brand -->
        <div class="text-center mb-8 space-y-3">
          <a routerLink="/" class="inline-block hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="FITCORN Logo" class="h-16 mx-auto w-auto object-contain" />
          </a>
          <div>
            <h1 class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white">
              Buat Akun
            </h1>
            <p class="text-sm text-charcoal-400 font-medium mt-1">
              Bergabunglah dengan komunitas camilan sehat Fitcorn
            </p>
          </div>
        </div>

        <div class="bg-white dark:bg-charcoal-900 rounded-2xl shadow-lg border border-charcoal-100 dark:border-charcoal-800 p-8 space-y-6 relative">
          <div class="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-corn-300 via-corn-400 to-corn-500 rounded-full"></div>

          <!-- Register Form -->
          <form (submit)="onSubmit()" class="space-y-5">
            <div class="space-y-4">
              <app-input [(ngModel)]="fullName" type="text" label="Nama Lengkap" placeholder="Wahyudi" [required]="true" name="fullName" (ngModelChange)="clearFullNameError()" [error]="fullNameError()"></app-input>
              <app-input [(ngModel)]="email" type="email" label="Alamat Email" placeholder="customer@fitcorn.com" [required]="true" name="email" (ngModelChange)="clearEmailError()" [error]="emailError()"></app-input>
              <app-password-input [(ngModel)]="password" label="Kata Sandi" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" [required]="true" name="password" (ngModelChange)="clearPasswordError()" [error]="passwordError()"></app-password-input>
            </div>

            <div class="ds-hint leading-relaxed flex items-start gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0 mt-0.5 text-corn-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Dengan mendaftar, kamu setuju dengan <a routerLink="/" class="text-corn-500 hover:underline font-bold">Ketentuan Layanan</a> & <a routerLink="/" class="text-corn-500 hover:underline font-bold">Kebijakan Privasi</a> kami.</span>
            </div>

            <app-button type="submit" [loading]="loading()" [fullWidth]="true" size="lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Daftar Sekarang
            </app-button>

            @if (errorMsg()) {
              <div class="flex items-center gap-2 p-3 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <span>{{ errorMsg() }}</span>
              </div>
            }
          </form>

          <!-- Social Register Divider -->
          <div class="relative flex items-center gap-3">
            <div class="flex-1 h-px bg-charcoal-100 dark:bg-charcoal-800"></div>
            <span class="ds-label shrink-0">atau daftar dengan</span>
            <div class="flex-1 h-px bg-charcoal-100 dark:bg-charcoal-800"></div>
          </div>

          <!-- Social Register Buttons -->
          <div class="grid grid-cols-3 gap-3">
            <button type="button" (click)="authService.socialLogin('google')"
              class="flex min-h-[var(--control-height-md)] flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-3 py-3 text-[var(--color-text-secondary)] shadow-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:border-corn-300 hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] hover:shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-[10px] font-bold uppercase tracking-wider">Google</span>
            </button>

            <button type="button" (click)="authService.socialLogin('facebook')"
              class="flex min-h-[var(--control-height-md)] flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-3 py-3 text-[var(--color-text-secondary)] shadow-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:border-corn-300 hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] hover:shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.672-5.328-12.073-12-12.073S0 5.401 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="text-[10px] font-bold uppercase tracking-wider">Facebook</span>
            </button>

            <button type="button" (click)="authService.socialLogin('instagram')"
              class="flex min-h-[var(--control-height-md)] flex-col items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-3 py-3 text-[var(--color-text-secondary)] shadow-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:border-corn-300 hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] hover:shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
                <linearGradient id="ig-reg" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stop-color="#f9ce34"/>
                  <stop offset="50%" stop-color="#ee2a7b"/>
                  <stop offset="100%" stop-color="#6228d7"/>
                </linearGradient>
                <path fill="url(#ig-reg)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <span class="text-[10px] font-bold uppercase tracking-wider">Instagram</span>
            </button>
          </div>

          <!-- WhatsApp Divider -->
          <div class="relative flex items-center gap-3">
            <div class="flex-1 h-px bg-charcoal-100 dark:bg-charcoal-800"></div>
            <span class="ds-label shrink-0">atau via WhatsApp</span>
            <div class="flex-1 h-px bg-charcoal-100 dark:bg-charcoal-800"></div>
          </div>

          <!-- WhatsApp Register -->
          <form (submit)="onRegisterWithPhone($event)" class="space-y-4">
            <app-input [(ngModel)]="phoneRegister" type="tel" label="Nomor WhatsApp" placeholder="082132976457" [required]="true" name="phoneRegister"></app-input>
            <app-button type="submit" [disabled]="!phoneRegister || sendingOtpReg()" [loading]="sendingOtpReg()" [fullWidth]="true" variant="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 -ml-1" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Kirim OTP via WhatsApp
            </app-button>
            @if (otpMsgReg()) {
              <div class="flex items-center gap-2 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>{{ otpMsgReg() }}</span>
              </div>
            }
            @if (otpErrorReg()) {
              <div class="flex items-center gap-2 p-3 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <span>{{ otpErrorReg() }}</span>
              </div>
            }
          </form>

          <!-- Login Link -->
          <div class="text-center pt-2 border-t border-charcoal-100 dark:border-charcoal-800">
            <p class="text-xs font-semibold text-charcoal-400 dark:text-charcoal-500">
              Sudah punya akun?
              <a routerLink="/login" class="text-corn-500 hover:text-corn-600 dark:hover:text-corn-400 hover:underline font-bold transition-colors duration-200">Login di sini</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  loading = signal<boolean>(false);
  errorMsg = signal<string>('');
  fullNameError = signal('');
  emailError = signal('');
  passwordError = signal('');
  phoneRegister = '';
  sendingOtpReg = signal<boolean>(false);
  otpMsgReg = signal<string>('');
  otpErrorReg = signal<string>('');

  onSubmit() {
    this.fullNameError.set('');
    this.emailError.set('');
    this.passwordError.set('');

    let valid = true;

    if (!this.fullName) {
      this.fullNameError.set('Nama lengkap wajib diisi');
      valid = false;
    } else if (this.fullName.length < 2) {
      this.fullNameError.set('Nama lengkap minimal 2 karakter');
      valid = false;
    }

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

  clearFullNameError() {
    this.fullNameError.set('');
  }

  clearEmailError() {
    this.emailError.set('');
  }

  clearPasswordError() {
    this.passwordError.set('');
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

        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.sendingOtpReg.set(false);
        this.otpErrorReg.set(err.error?.message || 'Gagal mengirim OTP');
      }
    });
  }
}
