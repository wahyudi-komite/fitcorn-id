import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="flex border-b border-charcoal-100 dark:border-charcoal-800 overflow-x-auto no-scrollbar">
      @for (tab of tabs(); track tab.id) {
        <button type="button" (click)="selectTab(tab.id)"
          [ngClass]="activeTab() === tab.id ? activeClasses : inactiveClasses"
          class="flex items-center gap-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors duration-200 cursor-pointer border-b-2 -mb-[1px]">
          @if (tab.icon) {
            <span class="text-base">{{ tab.icon }}</span>
          }
          {{ tab.label }}
          @if (tab.count !== undefined) {
            <span class="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-charcoal-100 dark:bg-charcoal-800">{{ tab.count }}</span>
          }
        </button>
      }
    </div>
  `,
})
export class TabsComponent {
  tabs = input.required<TabItem[]>();
  activeTab = input<string>('');
  onChange = output<string>();

  protected activeClasses = 'border-corn-400 text-corn-600 dark:text-corn-400';
  protected inactiveClasses = 'border-transparent text-charcoal-500 dark:text-charcoal-400 hover:text-charcoal-800 dark:hover:text-charcoal-200 hover:border-charcoal-300 dark:hover:border-charcoal-700';

  protected selectTab(id: string) {
    this.onChange.emit(id);
  }
}
