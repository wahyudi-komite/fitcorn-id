import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="flex items-center gap-1.5 text-xs font-medium text-charcoal-400 dark:text-charcoal-500 mb-4">
      @for (item of items(); track $index) {
        @if ($index > 0) {
          <svg class="w-3.5 h-3.5 text-charcoal-300 dark:text-charcoal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        }
        @if (item.link && !$last) {
          <a [routerLink]="item.link" class="hover:text-corn-500 transition-colors">{{ item.label }}</a>
        } @else {
          <span [class.text-charcoal-800]="$last" [class.dark:text-white]="$last" class="font-semibold">{{ item.label }}</span>
        }
      }
    </nav>
  `,
})
export class BreadcrumbComponent {
  items = input.required<BreadcrumbItem[]>();
}
