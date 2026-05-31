import { Injectable, signal } from '@angular/core';

export interface ToastConfig {
  message: string;
  title?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastConfig[]>([]);

  success(message: string, title?: string) {
    this.show({ message, title, variant: 'success' });
  }

  error(message: string, title?: string) {
    this.show({ message, title, variant: 'error' });
  }

  warning(message: string, title?: string) {
    this.show({ message, title, variant: 'warning' });
  }

  info(message: string, title?: string) {
    this.show({ message, title, variant: 'info' });
  }

  private show(config: ToastConfig) {
    const duration = config.duration ?? 4000;
    this.toasts.update(list => [...list, config]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(config), duration);
    }
  }

  dismiss(config: ToastConfig) {
    this.toasts.update(list => list.filter(t => t !== config));
  }

  clear() {
    this.toasts.set([]);
  }
}
