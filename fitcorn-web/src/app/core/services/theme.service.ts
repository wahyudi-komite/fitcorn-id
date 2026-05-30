import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<'light' | 'dark'>('light');
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeTheme();
  }

  private initializeTheme() {
    if (!this.isBrowser) return;

    const savedTheme = localStorage.getItem('fitcorn-theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const activeTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(activeTheme);
  }

  toggleTheme() {
    const nextTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  }

  private setTheme(mode: 'light' | 'dark') {
    this.theme.set(mode);
    
    if (this.isBrowser) {
      localStorage.setItem('fitcorn-theme', mode);
      const root = document.documentElement;
      
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
}
