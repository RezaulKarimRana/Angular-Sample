import { Component,Input} from '@angular/core';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';


@Component({
  selector: 'error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.scss']
})
export class ErrorHandlerComponent  {

  @Input() controlName:string;
  @Input() displayName: string;
  @Input() visible:any;
  
  constructor(private controlContainer: ControlContainer) { }

  get form():FormGroup {
    return this.controlContainer.control  as FormGroup;
  }

  get formControl() :AbstractControl{
    return this.form.get(this.controlName) as AbstractControl;
  }

  get isNotValid() {
    return this.formControl.invalid && (this.formControl.touched)
  }
  
}