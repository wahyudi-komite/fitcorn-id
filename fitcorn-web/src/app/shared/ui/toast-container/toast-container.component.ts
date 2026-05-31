import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast) {
        <div class="pointer-events-auto max-w-sm flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300 animate-in"
          [class.bg-emerald-50]="toast.variant === 'success'"
          [class.bg-red-50]="toast.variant === 'error'"
          [class.bg-amber-50]="toast.variant === 'warning'"
          [class.bg-sky-50]="toast.variant === 'info'"
          [class.dark:bg-emerald-900/40]="toast.variant === 'success'"
          [class.dark:bg-red-900/40]="toast.variant === 'error'"
          [class.dark:bg-amber-900/40]="toast.variant === 'warning'"
          [class.dark:bg-sky-900/40]="toast.variant === 'info'"
          [class.border-emerald-200]="toast.variant === 'success'"
          [class.border-red-200]="toast.variant === 'error'"
          [class.border-amber-200]="toast.variant === 'warning'"
          [class.border-sky-200]="toast.variant === 'info'"
          [class.text-emerald-800]="toast.variant === 'success'"
          [class.text-red-800]="toast.variant === 'error'"
          [class.text-amber-800]="toast.variant === 'warning'"
          [class.text-sky-800]="toast.variant === 'info'"
          [class.dark:text-emerald-200]="toast.variant === 'success'"
          [class.dark:text-red-200]="toast.variant === 'error'"
          [class.dark:text-amber-200]="toast.variant === 'warning'"
          [class.dark:text-sky-200]="toast.variant === 'info'">
          <span class="text-lg leading-none flex-shrink-0 mt-0.5">
            {{ toast.variant === 'success' ? '\u2713' : toast.variant === 'error' ? '\u2717' : toast.variant === 'warning' ? '\u26A0' : '\u24D8' }}
          </span>
          <div class="flex-1 min-w-0">
            @if (toast.title) { <p class="font-bold text-sm mb-0.5">{{ toast.title }}</p> }
            <p class="text-xs opacity-80">{{ toast.message }}</p>
          </div>
          <button (click)="toastService.dismiss(toast)" class="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes toast-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
    .animate-in { animation: toast-in 0.3s ease-out; }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
