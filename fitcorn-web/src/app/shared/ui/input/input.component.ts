import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-input',
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
        @if (prefixIcon()) {
          <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-charcoal-400 dark:text-charcoal-500 pointer-events-none text-sm">{{ prefixIcon() }}</span>
        }
        <input
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [required]="required()"
          [ngClass]="inputClasses()"
          [class.pl-10]="!!prefixIcon()"
          [class.pr-10]="!!suffixIcon()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          class="w-full px-4 py-3 rounded-md border bg-transparent placeholder-charcoal-400 dark:placeholder-charcoal-500 focus:outline-none focus:border-corn-400 transition-all duration-200 text-sm"
        />
        @if (suffixIcon()) {
          <span class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-charcoal-400 dark:text-charcoal-500 pointer-events-none text-sm">{{ suffixIcon() }}</span>
        }
      </div>
      @if (error()) {
        <p class="text-[11px] font-semibold text-red-500 dark:text-red-400 mt-1">{{ error() }}</p>
      }
      @if (hint() && !error()) {
        <p class="text-[11px] font-medium text-charcoal-400 dark:text-charcoal-500 mt-1">{{ hint() }}</p>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
  error = input<string>('');
  hint = input<string>('');
  required = input(false);
  disabled = input(false);
  prefixIcon = input<string>('');
  suffixIcon = input<string>('');

  value = signal<string>('');
  touched = signal(false);

  protected inputClasses = computed(() => {
    const base = 'w-full px-4 py-3 rounded-md border bg-transparent placeholder-charcoal-400 dark:placeholder-charcoal-500 focus:outline-none focus:border-corn-400 transition-all duration-200 text-sm';
    const theme = 'text-charcoal-800 dark:text-white dark:border-charcoal-700';
    const errorState = this.error() ? 'border-red-400 dark:border-red-500 focus:border-red-500' : 'border-charcoal-200 dark:border-charcoal-800';
    const prefix = this.prefixIcon() ? 'pl-10' : '';
    const suffix = this.suffixIcon() ? 'pr-10' : '';
    return [base, theme, errorState, prefix, suffix].filter(Boolean).join(' ');
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // handled via input()
  }

  protected onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  protected onBlur() {
    this.touched.set(true);
    this.onTouched();
  }

  focus() {
    // Expose focus if needed via ViewChild
  }
}
