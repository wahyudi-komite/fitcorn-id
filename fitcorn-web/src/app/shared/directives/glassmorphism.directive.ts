import { Directive, effect, ElementRef, inject, Renderer2 } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Directive({
  selector: '[appGlassmorphism]',
  standalone: true,
})
export class GlassmorphismDirective {
  private theme = inject(ThemeService);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const isDark = this.theme.theme() === 'dark';
      const native = this.el.nativeElement as HTMLElement;
      native.classList.remove('glassmorphism-light', 'glassmorphism-dark');
      native.classList.add(isDark ? 'glassmorphism-dark' : 'glassmorphism-light');
    });
  }
}
