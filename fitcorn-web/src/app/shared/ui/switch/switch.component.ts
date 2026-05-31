import { Component, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="inline-flex items-center gap-3 cursor-pointer group">
      <button type="button" role="switch" [attr.aria-checked]="checked()" [disabled]="disabled()"
        (click)="onToggle()" (keydown.space)="onToggle(); $event.preventDefault()"
        [class.bg-corn-400]="checked()"
        [class.bg-charcoal-200]="!checked()"
        [class.dark:bg-charcoal-700]="!checked()"
        [class.opacity-50]="disabled()"
        class="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-corn-400 focus:ring-offset-2 dark:focus:ring-offset-charcoal-900 cursor-pointer"
      >
        <span [class.translate-x-5]="checked()" [class.translate-x-0]="!checked()"
          class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"></span>
      </button>
      @if (label()) {
        <span class="text-sm font-medium text-charcoal-700 dark:text-charcoal-200 select-none">{{ label() }}</span>
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
