import { Component, Renderer2, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms"

export const CUSTOM_SLIDE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomSlideComponent),
  multi: true,
};

@Component({
  selector: 'app-slide',
  templateUrl: './custom-slide.component.html',
  styleUrls: ['./custom-slide.component.css'],
  providers: [CUSTOM_SLIDE_VALUE_ACCESSOR]
})
export class CustomSlideComponent implements ControlValueAccessor {
  @ViewChild("inp", { static: true }) input: ElementRef<HTMLInputElement>;

  onChange = (_: any) => { };

  onTouched = () => { };

  constructor(private _renderer: Renderer2) { }

  writeValue(value: any): void {
    this._renderer.setProperty(this.input.nativeElement, 'checked', value);
  }

  registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }

  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this.input.nativeElement, 'disabled', isDisabled);
  }
}