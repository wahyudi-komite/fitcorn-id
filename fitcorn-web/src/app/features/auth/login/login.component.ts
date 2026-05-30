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
    <div class="max-w-md mx-auto px-6 py-24 sm:py-32 font-sans transition-colors duration-300">
      <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
           class="p-8 rounded-3xl border space-y-6 shadow-premium relative overflow-hidden">
        
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-corn-300 to-corn-500"></div>

        <div class="text-center space-y-2">
          <h1 class="text-3xl font-display font-extrabold text-charcoal-800 dark:text-white">
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
              <input type="email" [(ngModel)]="email" name="email" placeholder="e.g. customer&#64;fitcorn.com" required
                     [ngClass]="themeService.theme() === 'dark' ? 'border-charcoal-850 text-white' : 'border-charcoal-200 text-charcoal-800'"
                     class="w-full px-5 py-3 rounded-full border bg-transparent placeholder-charcoal-400 focus:outline-none focus:border-corn-400" />
            </div>

            <div class="relative">
              <label class="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block mb-2">Password</label>
              <input [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password" name="password" placeholder="••••••••" required
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
                <span class="animate-spin text-sm">⌛</span> Authenticating...
              } @else {
                <span>🔑</span> Sign In
              }
            </button>

            @if (errorMsg()) {
              <div class="p-3 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl">
                {{ errorMsg() }}
              </div>
            }
          </div>
        </form>

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
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal<boolean>(false);
  errorMsg = signal<string>('');
  showPassword = signal<boolean>(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (!this.email || !this.password) return;

    this.loading.set(true);
    this.errorMsg.set('');

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        // Post-login cart merging
        this.cartService.mergeCartOnLogin().subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/']);
          },
          error: () => {
            this.loading.set(false);
            this.router.navigate(['/']); // redirect anyway if merge fails
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
}
