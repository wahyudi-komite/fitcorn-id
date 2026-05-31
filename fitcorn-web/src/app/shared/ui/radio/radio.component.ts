import { Component, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="inline-flex items-center gap-3 cursor-pointer group">
      <div class="relative flex items-center justify-center">
        <input
          type="radio"
          [value]="value()"
          [name]="name()"
          [checked]="selected() === value()"
          [disabled]="disabled()"
          (change)="onSelect()"
          class="peer sr-only"
        />
        <div class="w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
          peer-checked:border-corn-400
          peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
          border-charcoal-300 dark:border-charcoal-600
          group-hover:border-corn-400 dark:group-hover:border-corn-400">
          @if (selected() === value()) {
            <div class="w-2.5 h-2.5 rounded-full bg-corn-400"></div>
          }
        </div>
      </div>
      @if (label()) {
        <span class="text-sm font-medium text-charcoal-700 dark:text-charcoal-200 select-none">{{ label() }}</span>
      }
    </label>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RadioComponent), multi: true },
  ],
})
export class RadioComponent implements ControlValueAccessor {
  label = input<string>('');
  value = input<string>('');
  name = input<string>('');
  disabled = input(false);
  selected = signal<string>('');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void { this.selected.set(val ?? ''); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  onSelect() {
    this.selected.set(this.value());
    this.onChange(this.value());
    this.onTouched();
  }
}
