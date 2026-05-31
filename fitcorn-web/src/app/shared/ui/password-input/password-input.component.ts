import { Component, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-password-input',
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
        <input
          [type]="show() ? 'text' : 'password'"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [required]="required()"
          [ngClass]="inputClasses"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          class="w-full px-4 py-3 rounded-md border bg-transparent placeholder-charcoal-400 dark:placeholder-charcoal-500 focus:outline-none focus:border-corn-400 transition-all duration-200 text-sm pr-12"
        />
        <button type="button" (click)="toggle()" tabindex="-1"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-corn-500 cursor-pointer text-lg leading-none transition-colors">
          {{ show() ? '🙈' : '👁️' }}
        </button>
      </div>
      @if (error()) {
        <p class="text-[11px] font-semibold text-red-500 dark:text-red-400">{{ error() }}</p>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
})
export class PasswordInputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  error = input<string>('');
  required = input(false);
  disabled = input(false);

  value = signal<string>('');
  touched = signal(false);
  show = signal(false);

  protected inputClasses = [
    'w-full',
    'px-4',
    'py-3',
    'rounded-md',
    'border',
    'bg-transparent',
    'placeholder-charcoal-400',
    'dark:placeholder-charcoal-500',
    'focus:outline-none',
    'focus:border-corn-400',
    'transition-all',
    'duration-200',
    'text-sm',
    'pr-12',
    'text-charcoal-800',
    'dark:text-white',
    'border-charcoal-200',
    'dark:border-charcoal-700',
  ].join(' ');

  protected toggle() {
    this.show.update(v => !v);
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void { this.value.set(val ?? ''); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  protected onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  protected onBlur() {
    this.touched.set(true);
    this.onTouched();
  }
}
