import { Component, Renderer2, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms"

export const CUSTOM_SLIDE_VALUE_Yes_No_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomSlideYesNoComponent),
  multi: true,
};

@Component({
  selector: 'app-slide-yes-no',
  templateUrl: './custom-slide-yes-no.component.html',
  styleUrls: ['./custom-slide-yes-no.component.css'],
  providers: [CUSTOM_SLIDE_VALUE_Yes_No_ACCESSOR]
})
export class CustomSlideYesNoComponent implements ControlValueAccessor {
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