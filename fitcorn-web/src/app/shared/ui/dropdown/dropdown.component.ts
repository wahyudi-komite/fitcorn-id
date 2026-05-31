import { Component, input, output, HostListener } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  template: `
    <div class="relative inline-block">
      <div (click)="toggleOpen()" class="cursor-pointer">
        <ng-content select="[trigger]"/>
      </div>
      @if (isOpen()) {
        <div [class]="menuClasses()" class="absolute z-50 mt-1 min-w-[180px] rounded-xl border shadow-xl py-1"
          (click)="close()">
          <ng-content select="[content]"/>
        </div>
      }
    </div>
  `,
})
export class DropdownComponent {
  align = input<'left' | 'right'>('left');
  isOpen = input(false);
  onToggle = output<boolean>();

  protected menuClasses = () => {
    const align = this.align() === 'right' ? 'right-0' : 'left-0';
    const theme = 'bg-white dark:bg-charcoal-900 border-charcoal-100 dark:border-charcoal-800';
    return [align, theme].join(' ');
  };

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    // Close on outside click
  }

  protected toggleOpen() {
    this.onToggle.emit(!this.isOpen());
  }

  protected close() {
    if (this.isOpen()) {
      this.onToggle.emit(false);
    }
  }
}
