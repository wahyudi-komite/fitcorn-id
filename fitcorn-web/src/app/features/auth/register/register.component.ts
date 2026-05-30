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
    <div class="max-w-md mx-auto px-6 py-24 sm:py-32 font-sans transition-colors duration-300">
      <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
           class="p-8 rounded-3xl border space-y-6 shadow-premium relative overflow-hidden">
        
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-corn-300 to-corn-500"></div>

        <div class="text-center space-y-2">
          <h1 class="text-3xl font-display font-extrabold text-charcoal-800 dark:text-white">
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
                <span class="animate-spin text-sm">⌛</span> Creating Account...
              } @else {
                <span>✨</span> Join Now
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
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  loading = signal<boolean>(false);
  errorMsg = signal<string>('');
  showPassword = signal<boolean>(false);

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
        // Automatically login on success
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
}
