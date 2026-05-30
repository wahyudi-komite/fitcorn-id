import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  cartService = inject(CartService);
  authService = inject(AuthService);

  isMobileMenuOpen = signal(false);

  get initial(): string {
    const user = this.authService.currentUser();
    if (!user) return '?';
    return (user.fullName || user.email || '').charAt(0).toUpperCase();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }
}
