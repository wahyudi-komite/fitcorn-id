import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-textarea',
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
      <textarea
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [required]="required()"
        [rows]="rows()"
        [ngClass]="textareaClasses()"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="ds-control min-h-[120px] resize-y text-sm"
      ></textarea>
      @if (error()) {
        <p class="ds-error">{{ error() }}</p>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  error = input<string>('');
  required = input(false);
  disabled = input(false);
  rows = input<number>(4);

  value = signal<string>('');
  touched = signal(false);

  protected textareaClasses = computed(() => this.error() ? 'is-invalid' : '');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value.set(val ?? '');
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  protected onInput(event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  protected onBlur() {
    this.touched.set(true);
    this.onTouched();
  }
}
