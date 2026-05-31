import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Directive({
  selector: '[appGlassmorphism]',
  standalone: true,
})
export class GlassmorphismDirective {
  private theme = inject(ThemeService);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  variant = input<'glass' | 'card'>('glass', { alias: 'appGlassmorphismVariant' });
  shadow = input<boolean>(true, { alias: 'appGlassmorphismShadow' });

  constructor() {
    effect(() => {
      const isDark = this.theme.theme() === 'dark';
      const native = this.el.nativeElement as HTMLElement;

      // Glassmorphism classes
      native.classList.remove('glassmorphism-light', 'glassmorphism-dark',
        'bg-white', 'dark:bg-charcoal-900',
        'shadow-premium', 'shadow-premium-dark');

      if (this.variant() === 'glass') {
        native.classList.add(isDark ? 'glassmorphism-dark' : 'glassmorphism-light');
      } else {
        native.classList.add(isDark ? 'dark:bg-charcoal-900' : 'bg-white');
      }

      if (this.shadow()) {
        native.classList.add(isDark ? 'shadow-premium-dark' : 'shadow-premium');
      }
    });
  }
}
