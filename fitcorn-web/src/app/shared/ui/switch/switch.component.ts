import { NgClass } from '@angular/common';
import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [FormsModule, NgClass],
  template: `
    <label class="inline-flex items-center gap-3 cursor-pointer group">
      <button type="button" role="switch" [attr.aria-checked]="checked()" [disabled]="disabled()"
        (click)="onToggle()" (keydown.space)="onToggle(); $event.preventDefault()"
        [ngClass]="switchClasses()"
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)]"
      >
        <span [class.translate-x-5]="checked()" [class.translate-x-0]="!checked()"
          class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-[var(--color-surface-base)] shadow ring-0 transition duration-200"></span>
      </button>
      @if (label()) {
        <span class="select-none text-sm font-medium text-[var(--color-text-primary)]">{{ label() }}</span>
      }
    </label>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SwitchComponent), multi: true },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  label = input<string>('');
  disabled = input(false);
  checked = signal(false);

  protected switchClasses = computed(() => {
    const state = this.checked() ? 'bg-corn-400' : 'bg-[var(--color-border-strong)]';
    const disabled = this.disabled() ? 'opacity-50' : '';
    return [state, disabled].filter(Boolean).join(' ');
  });

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: boolean): void { this.checked.set(val ?? false); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  onToggle() {
    if (this.disabled()) return;
    const val = !this.checked();
    this.checked.set(val);
    this.onChange(val);
    this.onTouched();
  }
}
