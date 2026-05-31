import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { FloatingButtonsComponent } from './shared/components/floating-buttons/floating-buttons.component';
import { ExitIntentPopupComponent } from './shared/components/exit-intent-popup/exit-intent-popup.component';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal.component';
import { PromoBannerComponent } from './shared/components/promo-banner/promo-banner.component';
import { ToastContainerComponent } from './shared/ui/toast-container/toast-container.component';
import { ThemeService } from './core/services/theme.service';
import { AnalyticsService } from './core/services/analytics.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    FloatingButtonsComponent,
    ExitIntentPopupComponent,
    ConfirmModalComponent,
    PromoBannerComponent,
    ToastContainerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  themeService = inject(ThemeService);
  private router = inject(Router);
  private analyticsService = inject(AnalyticsService);

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.analyticsService.trackPageView(event.urlAfterRedirects);
    });
  }
}
