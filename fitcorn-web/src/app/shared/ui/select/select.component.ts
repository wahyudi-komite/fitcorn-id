import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormsModule, NgClass],
  template: `
    <div class="space-y-1.5">
      @if (label()) {
        <label class="ds-label">
          {{ label() }}
          @if (required()) { <span class="text-red-400">*</span> }
        </label>
      }
      <div class="relative">
        <select
          [disabled]="disabled()"
          [required]="required()"
          [ngClass]="selectClasses()"
          [value]="value()"
          (change)="onChange($event)"
          (blur)="onBlur()"
          class="ds-control appearance-none cursor-pointer pr-11 text-sm"
        >
          @if (placeholder()) {
            <option value="" [selected]="!value()" disabled>{{ placeholder() }}</option>
          }
          <ng-content/>
        </select>
        <span class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-[var(--color-text-muted)]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </span>
      </div>
      @if (error()) {
        <p class="ds-error">{{ error() }}</p>
      }
      @if (hint() && !error()) {
        <p class="ds-hint">{{ hint() }}</p>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  error = input<string>('');
  hint = input<string>('');
  required = input(false);
  disabled = input(false);

  value = signal<string>('');
  touched = signal(false);

  protected selectClasses = computed(() => {
    const errorState = this.error() ? 'is-invalid' : '';
    const placeholderState = !this.value() ? 'text-[var(--color-text-muted)]' : '';
    return [errorState, placeholderState].filter(Boolean).join(' ');
  });

  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  writeValue(val: string): void { this.value.set(val ?? ''); }
  registerOnChange(fn: any): void { this.onChangeFn = fn; }
  registerOnTouched(fn: any): void { this.onTouchedFn = fn; }
  setDisabledState(isDisabled: boolean): void {}

  protected onChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.value.set(val);
    this.onChangeFn(val);
  }

  protected onBlur() {
    this.touched.set(true);
    this.onTouchedFn();
  }
}
