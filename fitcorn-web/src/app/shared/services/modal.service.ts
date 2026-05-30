import { Injectable, signal } from '@angular/core';

export interface ConfirmModalConfig {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  readonly confirmState = signal<{
    config: ConfirmModalConfig;
    resolve: (value: boolean) => void;
  } | null>(null);

  confirm(config: string | ConfirmModalConfig): Promise<boolean> {
    const normalized: ConfirmModalConfig =
      typeof config === 'string' ? { message: config } : config;

    return new Promise((resolve) => {
      this.confirmState.set({ config: normalized, resolve });
    });
  }

  close(result: boolean) {
    const current = this.confirmState();
    if (current) {
      current.resolve(result);
      this.confirmState.set(null);
    }
  }
}
