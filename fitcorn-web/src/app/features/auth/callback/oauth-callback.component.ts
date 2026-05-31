import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-md mx-auto px-6 py-32 font-sans transition-colors duration-300">
      <div [ngClass]="themeService.theme() === 'dark' ? 'glassmorphism-dark shadow-premium-dark' : 'glassmorphism-light shadow-premium'"
           class="p-8 rounded-3xl border space-y-6 shadow-premium relative overflow-hidden text-center">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-corn-300 to-corn-500"></div>

        <a routerLink="/" class="inline-block hover:scale-105 transition-transform duration-300">
          <img src="/logo.png" alt="FITCORN Logo" class="h-16 mx-auto w-auto object-contain" />
        </a>

        @if (errorMsg) {
          <div class="space-y-4">
            <div class="text-6xl">😕</div>
            <h1 class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white">Login Gagal</h1>
            <p class="text-sm text-charcoal-400 dark:text-charcoal-300">{{ errorMsg }}</p>
            <a routerLink="/login"
               class="inline-block px-8 py-3 font-sans font-bold text-xs tracking-widest uppercase rounded-full bg-corn-400 hover:bg-corn-500 text-charcoal-900 transition-all duration-300 cursor-pointer">
              Coba Lagi
            </a>
          </div>
        } @else {
          <div class="space-y-4">
            <div class="text-6xl animate-pulse">🔄</div>
            <h1 class="text-2xl font-display font-extrabold text-charcoal-800 dark:text-white">Memasukkan Anda...</h1>
            <p class="text-sm text-charcoal-400 dark:text-charcoal-300">Harap tunggu, sedang menyelesaikan autentikasi</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class OauthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  themeService = inject(ThemeService);
  errorMsg = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const userStr = params['user'];
      const err = params['error'];

      if (err) {
        this.errorMsg = err === 'instagram_not_configured'
          ? 'Login Instagram belum dikonfigurasi.'
          : 'Autentikasi gagal. Silakan coba lagi.';
        return;
      }

      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          this.authService.setSession(token, user);

          this.cartService.mergeCartOnLogin().subscribe({
            next: () => this.router.navigate(['/']),
            error: () => this.router.navigate(['/']),
          });
        } catch {
          this.errorMsg = 'Respons autentikasi tidak valid.';
        }
      } else {
        this.errorMsg = 'Tidak ada data autentikasi yang diterima.';
      }
    });
  }
}
