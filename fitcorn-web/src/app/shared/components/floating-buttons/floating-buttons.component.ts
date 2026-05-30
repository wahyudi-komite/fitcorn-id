import { Component, signal, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-floating-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-buttons.component.html',
  styleUrls: []
})
export class FloatingButtonsComponent {
  showScrollTop = signal(false);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.isBrowser) return;
    const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
    this.showScrollTop.set(scrollPos > 300);
  }

  scrollToTop() {
    if (!this.isBrowser) return;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
