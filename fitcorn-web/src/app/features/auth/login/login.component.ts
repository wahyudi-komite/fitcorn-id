import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-md mx-auto px-6 py-16 sm:py-24 font-sans transition-colors duration-300">
      <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
           class="p-8 rounded-3xl border space-y-6 shadow-premium relative overflow-hidden">

        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-corn-300 to-corn-500"></div>

        <div class="text-center space-y-4">
          <a routerLink="/" class="inline-block hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="FITCORN Logo" class="h-16 mx-auto w-auto object-contain" />
          </a>
          <h1 class="text-3xl font-display font-extrabold text-charcoal-800 dark:text-white mt-2">
            Welcome Back
          </h1>
          <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider">
            Sign in to your premium Fitcorn account
          </p>
        </div>

        <form (submit)="onSubmit()" class="space-y-4 text-sm font-medium">
          <div class="space-y-4">
            <div>
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Email Address</label>
              <input type="email" [(ngModel)]="email" name="email" placeholder="e.g. customer@fitcorn.com" required
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
            </div>

            <div class="relative">
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Password</label>
              <input [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" name="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" required
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 pr-12 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
              <button type="button" (click)="togglePassword()" tabindex="-1"
                      class="absolute right-4 top-1/2 translate-y-1 text-charcoal-400 hover:text-corn-500 cursor-pointer text-lg leading-none">
                {{ showPassword() ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="pt-4 space-y-3">
            <button type="submit" [disabled]="loading()"
                    class="w-full px-8 py-4 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 disabled:bg-corn-400/50 disabled:cursor-not-allowed text-charcoal-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2">
              @if (loading()) {
                <span class="animate-spin text-sm">&#x231B;</span> Authenticating...
              } @else {
                <span>&#x1F511;</span> Sign In
              }
            </button>

            @if (errorMsg()) {
              <div class="p-3 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
                {{ errorMsg() }}
              </div>
            }
          </div>
        </form>

        <div class="relative flex items-center gap-3 py-2">
          <div class="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-800"></div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-charcoal-400">or continue with</span>
          <div class="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-800"></div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <button (click)="authService.socialLogin('google')" type="button"
                  class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-charcoal-200 dark:border-charcoal-800 hover:bg-charcoal-100 dark:hover:bg-charcoal-900 transition-colors cursor-pointer text-sm font-medium text-charcoal-700 dark:text-charcoal-300">
            <span class="text-lg">G</span>
            <span class="hidden sm:inline text-xs">Google</span>
          </button>
          <button (click)="authService.socialLogin('facebook')" type="button"
                  class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-charcoal-200 dark:border-charcoal-800 hover:bg-charcoal-100 dark:hover:bg-charcoal-900 transition-colors cursor-pointer text-sm font-medium text-charcoal-700 dark:text-charcoal-300">
            <span class="text-lg">f</span>
            <span class="hidden sm:inline text-xs">Facebook</span>
          </button>
          <button (click)="authService.socialLogin('instagram')" type="button"
                  class="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-charcoal-200 dark:border-charcoal-800 hover:bg-charcoal-100 dark:hover:bg-charcoal-900 transition-colors cursor-pointer text-sm font-medium text-charcoal-700 dark:text-charcoal-300">
            <span class="text-lg">IG</span>
            <span class="hidden sm:inline text-xs">Instagram</span>
          </button>
        </div>

        <div class="relative flex items-center gap-3 py-1">
          <div class="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-800"></div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-charcoal-400">or via WhatsApp</span>
          <div class="flex-1 h-px bg-charcoal-200 dark:bg-charcoal-800"></div>
        </div>

        @if (!otpSent()) {
          <form (submit)="onSendOtp($event)" class="space-y-3">
            <div>
              <input type="tel" [(ngModel)]="phone" name="phone" placeholder="e.g. 081234567890" required
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400 text-sm" />
            </div>
            <button type="submit" [disabled]="!phone || sendingOtp()"
                    class="w-full px-8 py-3 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 disabled:bg-corn-400/50 disabled:cursor-not-allowed text-charcoal-900 transition-all duration-300 cursor-pointer">
              @if (sendingOtp()) {
                Sending OTP...
              } @else {
                Send OTP via WhatsApp
              }
            </button>
            @if (otpMsg()) {
              <div class="p-2 text-center text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                {{ otpMsg() }}
              </div>
            }
          </form>
        } @else {
          <form (submit)="onVerifyOtp($event)" class="space-y-3">
            <div>
              <input type="text" [(ngModel)]="otp" name="otp" placeholder="Enter 6-digit OTP" required maxlength="6"
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400 text-sm text-center tracking-[8px]" />
            </div>
            <button type="submit" [disabled]="!otp || otp.length < 6 || verifyingOtp()"
                    class="w-full px-8 py-3 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 disabled:bg-corn-400/50 disabled:cursor-not-allowed text-charcoal-900 transition-all duration-300 cursor-pointer">
              @if (verifyingOtp()) {
                Verifying...
              } @else {
                Verify & Sign In
              }
            </button>
            <button type="button" (click)="resetOtp()"
                    class="w-full text-xs text-charcoal-400 hover:text-corn-500 transition-colors cursor-pointer">
              Use a different number
            </button>
            @if (otpError()) {
              <div class="p-2 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
                {{ otpError() }}
              </div>
            }
          </form>
        }

        <div class="text-center text-xs font-semibold text-charcoal-400 pt-2 border-t border-charcoal-100 dark:border-charcoal-900">
          Don't have an account?
          <a routerLink="/daftar" class="text-corn-500 hover:underline">Register here</a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal<boolean>(false);
  errorMsg = signal<string>('');
  showPassword = signal<boolean>(false);

  phone = '';
  otp = '';
  sendingOtp = signal<boolean>(false);
  verifyingOtp = signal<boolean>(false);
  otpSent = signal<boolean>(false);
  otpMsg = signal<string>('');
  otpError = signal<string>('');

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (!this.email || !this.password) return;

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
        this.errorMsg.set(err.error?.message || 'Invalid email or password. Please try again.');
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
        this.otpMsg.set('OTP sent! Check your WhatsApp (check server console in dev mode)');
      },
      error: (err) => {
        this.sendingOtp.set(false);
        this.otpError.set(err.error?.message || 'Failed to send OTP');
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
        this.otpError.set(err.error?.message || 'Invalid OTP');
      }
    });
  }

  resetOtp() {
    this.otpSent.set(false);
    this.otp = '';
    this.otpMsg.set('');
    this.otpError.set('');
  }
}
