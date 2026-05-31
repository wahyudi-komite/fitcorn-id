import { Component, input } from '@angular/core';

export type SkeletonVariant = 'text' | 'card' | 'image' | 'circle' | 'custom';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div [class]="classes()" class="animate-pulse bg-charcoal-200 dark:bg-charcoal-700 rounded-md">
      @if (variant() === 'text') {
        <div class="space-y-2.5">
          <div class="h-3 bg-charcoal-200 dark:bg-charcoal-700 rounded w-full"></div>
          <div class="h-3 bg-charcoal-200 dark:bg-charcoal-700 rounded w-5/6"></div>
          <div class="h-3 bg-charcoal-200 dark:bg-charcoal-700 rounded w-4/6"></div>
        </div>
      }
      @if (variant() === 'card') {
        <div class="space-y-3 p-4">
          <div class="aspect-video bg-charcoal-200 dark:bg-charcoal-700 rounded-md"></div>
          <div class="h-4 bg-charcoal-200 dark:bg-charcoal-700 rounded w-3/4"></div>
          <div class="h-3 bg-charcoal-200 dark:bg-charcoal-700 rounded w-1/2"></div>
        </div>
      }
      @if (variant() === 'image') {
        <div class="aspect-square bg-charcoal-200 dark:bg-charcoal-700 rounded-md"></div>
      }
      @if (variant() === 'circle') {
        <div class="rounded-full bg-charcoal-200 dark:bg-charcoal-700" [style.width.px]="size()" [style.height.px]="size()"></div>
      }
    </div>
  `,
})
export class SkeletonComponent {
  variant = input<SkeletonVariant>('text');
  size = input<number>(40);
  count = input<number>(1);

  protected classes = () => {
    if (this.variant() === 'circle') return '';
    if (this.variant() !== 'custom') return '';
    return '';
  };
}
