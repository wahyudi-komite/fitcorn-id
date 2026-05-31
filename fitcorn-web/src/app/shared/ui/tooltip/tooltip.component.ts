import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  template: `
    <div class="relative group inline-flex">
      <ng-content/>
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-md bg-charcoal-800 dark:bg-charcoal-700 text-white dark:text-charcoal-200 text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
        {{ text() }}
        <div class="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-charcoal-800 dark:bg-charcoal-700 rotate-45 -mt-1"></div>
      </div>
    </div>
  `,
})
export class TooltipComponent {
  text = input.required<string>();
}
