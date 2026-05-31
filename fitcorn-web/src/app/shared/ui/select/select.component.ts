import { Component, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormsModule, NgClass],
  template: `
    <div class="space-y-1.5">
      @if (label()) {
        <label class="block text-[10px] font-bold text-charcoal-400 dark:text-charcoal-500 uppercase tracking-widest">
          {{ label() }}
          @if (required()) { <span class="text-red-400">*</span> }
        </label>
      }
      <div class="relative">
        <select
          [disabled]="disabled()"
          [required]="required()"
          [ngClass]="selectClasses"
          [value]="value()"
          (change)="onChange($event)"
          (blur)="onBlur()"
          class="w-full px-4 py-3 rounded-md border bg-transparent focus:outline-none focus:border-corn-400 transition-all duration-200 text-sm appearance-none cursor-pointer"
        >
          @if (placeholder()) {
            <option value="" disabled selected>{{ placeholder() }}</option>
          }
          <ng-content/>
        </select>
        <span class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-charcoal-400 dark:text-charcoal-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </span>
      </div>
      @if (error()) {
        <p class="text-[11px] font-semibold text-red-500 dark:text-red-400">{{ error() }}</p>
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
  required = input(false);
  disabled = input(false);

  value = signal<string>('');
  touched = signal(false);

  protected selectClasses = [
    'w-full',
    'px-4',
    'py-3',
    'rounded-md',
    'border',
    'bg-transparent',
    'focus:outline-none',
    'focus:border-corn-400',
    'transition-all',
    'duration-200',
    'text-sm',
    'appearance-none',
    'cursor-pointer',
    'text-charcoal-800',
    'dark:text-white',
    'border-charcoal-200',
    'dark:border-charcoal-700',
  ].join(' ');

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
