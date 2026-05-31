import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <nav class="flex items-center justify-center gap-1.5 mt-6" aria-label="Pagination">
      <button (click)="goTo(currentPage() - 1)" [disabled]="currentPage() <= 1"
        class="px-3 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-600 dark:text-charcoal-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-800">
        Prev
      </button>

      @for (page of pages(); track page) {
        @if (page === '...') {
          <span class="px-3 py-2 text-xs text-charcoal-400">...</span>
        } @else {
          <button (click)="goTo(page)"
            [class.bg-corn-400]="page === currentPage()"
            [class.text-charcoal-900]="page === currentPage()"
            [class.text-charcoal-600]="page !== currentPage()"
            [class.dark:text-charcoal-300]="page !== currentPage()"
            [class.hover:bg-charcoal-100]="page !== currentPage()"
            [class.dark:hover:bg-charcoal-800]="page !== currentPage()"
            class="px-3 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer min-w-[2rem] text-center">
            {{ page }}
          </button>
        }
      }

      <button (click)="goTo(currentPage() + 1)" [disabled]="currentPage() >= totalPages()"
        class="px-3 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-charcoal-600 dark:text-charcoal-400 hover:bg-charcoal-100 dark:hover:bg-charcoal-800">
        Next
      </button>
    </nav>
  `,
})
export class PaginationComponent {
  currentPage = input(1);
  totalPages = input(1);
  onPageChange = output<number>();

  protected pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const result: (number | string)[] = [1];
    if (current > 3) result.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      result.push(i);
    }
    if (current < total - 2) result.push('...');
    result.push(total);
    return result;
  });

  protected goTo(page: number | string) {
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages() && pageNum !== this.currentPage()) {
      this.onPageChange.emit(pageNum);
    }
  }
}
