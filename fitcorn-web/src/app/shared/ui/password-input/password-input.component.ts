import { NgClass } from '@angular/common';
import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password-input',
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
        <input
          [type]="show() ? 'text' : 'password'"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [required]="required()"
          [ngClass]="inputClasses()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          class="ds-control pr-12 text-sm"
        />
        <button
          type="button"
          tabindex="-1"
          (click)="toggle()"
          [attr.aria-label]="show() ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-corn-500 cursor-pointer transition-colors"
        >
          @if (show()) {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.584 10.587A2 2 0 0012 14a1.99 1.99 0 001.414-.586" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.88 5.09A9.77 9.77 0 0112 4.875c4.478 0 8.268 2.943 9.542 7.001a10.45 10.45 0 01-2.287 3.95M6.228 6.228A10.45 10.45 0 002.458 11.876C3.732 15.934 7.522 18.875 12 18.875c1.49 0 2.903-.32 4.176-.895" />
            </svg>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        </button>
      </div>
      @if (error()) {
        <p class="ds-error">{{ error() }}</p>
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

  protected inputClasses = computed(() => this.error() ? 'is-invalid' : '');

  protected toggle() {
    this.show.update((v) => !v);
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
