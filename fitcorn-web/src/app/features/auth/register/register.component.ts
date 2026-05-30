import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
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
            Create Account
          </h1>
          <p class="text-xs text-charcoal-400 font-semibold uppercase tracking-wider">
            Join the Fitcorn organic snacking tribe
          </p>
        </div>

        <form (submit)="onSubmit()" class="space-y-4 text-sm font-medium">
          <div class="space-y-4">
            <div>
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Full Name</label>
              <input type="text" [(ngModel)]="fullName" name="fullName" placeholder="e.g. Wahyudi" required
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
            </div>

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
                <span class="animate-spin text-sm">&#x231B;</span> Creating Account...
              } @else {
                <span>&#x2728;</span> Join Now
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
          <span class="text-[10px] font-bold uppercase tracking-widest text-charcoal-400">or sign up with</span>
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

        <form (submit)="onRegisterWithPhone($event)" class="space-y-3">
          <div>
            <input type="tel" [(ngModel)]="phoneRegister" name="phoneRegister" placeholder="e.g. 081234567890" required
                   [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                   class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400 text-sm" />
          </div>
          <button type="submit" [disabled]="!phoneRegister || sendingOtpReg()"
                  class="w-full px-8 py-3 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 disabled:bg-corn-400/50 disabled:cursor-not-allowed text-charcoal-900 transition-all duration-300 cursor-pointer">
            @if (sendingOtpReg()) {
              Sending OTP...
            } @else {
              Send OTP via WhatsApp
            }
          </button>
          @if (otpMsgReg()) {
            <div class="p-2 text-center text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              {{ otpMsgReg() }}
            </div>
          }
          @if (otpErrorReg()) {
            <div class="p-2 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
              {{ otpErrorReg() }}
            </div>
          }
        </form>

        <div class="text-center text-xs font-semibold text-charcoal-400 pt-2 border-t border-charcoal-100 dark:border-charcoal-900">
          Already have an account?
          <a routerLink="/masuk" class="text-corn-500 hover:underline">Log in here</a>
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
            this.router.navigate(['/masuk']);
          }
        });
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.errorMsg.set(err.error?.message || 'Failed to create account. Email might already be registered.');
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
        this.otpMsgReg.set('OTP sent! Check your WhatsApp (check server console in dev mode)');

        // Navigate to login page with phone pre-filled for OTP verification
        this.router.navigate(['/masuk']);
      },
      error: (err) => {
        this.sendingOtpReg.set(false);
        this.otpErrorReg.set(err.error?.message || 'Failed to send OTP');
      }
    });
  }
}
