import { Component, computed, input } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    @if (src()) {
      <img [src]="src()" [alt]="alt()" [class]="classes()" class="object-cover" />
    } @else {
      <div [class]="classes()" class="flex items-center justify-center bg-corn-100 dark:bg-corn-900/30 text-corn-600 dark:text-corn-400 font-display font-bold select-none">
        {{ initials() }}
      </div>
    }
  `,
})
export class AvatarComponent {
  src = input<string>('');
  alt = input<string>('Avatar');
  name = input<string>('');
  size = input<AvatarSize>('md');

  protected initials = computed(() => {
    const n = this.name();
    if (!n) return '?';
    const parts = n.split(' ').filter(Boolean);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : n.substring(0, 2).toUpperCase();
  });

  protected classes = computed(() => {
    const base = 'rounded-full flex-shrink-0';
    const s = this.sizeMap[this.size()];
    return [base, s].join(' ');
  });

  private sizeMap: Record<AvatarSize, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };
}
