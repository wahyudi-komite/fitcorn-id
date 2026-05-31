import { Component, input, output } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  template: `
    <div class="overflow-x-auto rounded-xl border border-charcoal-100 dark:border-charcoal-800">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-charcoal-50 dark:bg-charcoal-900 border-b border-charcoal-100 dark:border-charcoal-800">
            @for (col of columns(); track col.key) {
              <th [class.cursor-pointer]="col.sortable" (click)="col.sortable && sort(col.key)"
                [style.width]="col.width" [class.text-right]="col.align === 'right'" [class.text-center]="col.align === 'center'"
                class="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal-500 dark:text-charcoal-400 whitespace-nowrap">
                <span class="flex items-center gap-1" [class.justify-end]="col.align === 'right'" [class.justify-center]="col.align === 'center'">
                  {{ col.label }}
                  @if (col.sortable && sortKey() === col.key) {
                    <svg class="w-3 h-3" [class.rotate-180]="sortDir() === 'asc'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                  }
                </span>
              </th>
            }
          </tr>
        </thead>
        <tbody class="divide-y divide-charcoal-100 dark:divide-charcoal-800">
          @for (row of data(); track trackRow(row, $index)) {
            <tr class="hover:bg-charcoal-50 dark:hover:bg-charcoal-900/50 transition-colors">
              @for (col of columns(); track col.key) {
                <td [class.text-right]="col.align === 'right'" [class.text-center]="col.align === 'center'"
                  class="px-4 py-3 text-charcoal-700 dark:text-charcoal-300">
                  {{ row[col.key] }}
                </td>
              }
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="columns().length" class="px-4 py-12 text-center text-charcoal-400 dark:text-charcoal-500 text-sm">
                {{ emptyMessage() }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class TableComponent {
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  sortKey = input<string>('');
  sortDir = input<'asc' | 'desc'>('asc');
  emptyMessage = input('Tidak ada data');
  trackBy = input<((row: any) => any) | undefined>();
  onSort = output<string>();
  onRowClick = output<any>();

  protected trackRow(row: any, index: number) {
    const fn = this.trackBy();
    return fn ? fn(row) : (row.id ?? index);
  }

  protected sort(key: string) {
    this.onSort.emit(key);
  }
}
