import { Component, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="inline-flex items-center gap-3 cursor-pointer group">
      <div class="relative flex items-center justify-center">
        <input
          type="checkbox"
          [checked]="checked()"
          [disabled]="disabled()"
          (change)="onToggle($event)"
          class="peer sr-only"
        />
        <div class="w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
          peer-checked:bg-corn-400 peer-checked:border-corn-400
          peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
          border-charcoal-300 dark:border-charcoal-600
          group-hover:border-corn-400 dark:group-hover:border-corn-400">
          @if (checked()) {
            <svg class="w-3 h-3 text-charcoal-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          }
        </div>
      </div>
      @if (label()) {
        <span class="text-sm font-medium text-charcoal-700 dark:text-charcoal-200 select-none">{{ label() }}</span>
      }
    </label>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  label = input<string>('');
  disabled = input(false);
  checked = signal(false);

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: boolean): void { this.checked.set(val ?? false); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  onToggle(event: Event) {
    const val = (event.target as HTMLInputElement).checked;
    this.checked.set(val);
    this.onChange(val);
    this.onTouched();
  }
}
