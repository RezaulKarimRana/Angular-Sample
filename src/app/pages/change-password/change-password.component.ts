import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PasswordChangeModel } from 'src/app/core/models/password.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit , OnDestroy {

  subSink: SubSink;
  model: PasswordChangeModel;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private router: Router,
    private authService: AuthService,
    private toaster: ToastrService,
  ) { this.subSink = new SubSink(); }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.passwordForm = this.fb.group({
      CurrentPassword: ['',Validators.required],
      NewPassword: ['',[Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['',[Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  get CurrentPasswordFormControl() {
    return this.passwordForm ? this.passwordForm.get('CurrentPassword') : null;
  }
  get NewPasswordFormControl() {
    return this.passwordForm ? this.passwordForm.get('NewPassword') : null;
  }
  get ConfirmPasswordFormControl() {
    return this.passwordForm ? this.passwordForm.get('ConfirmPassword') : null;
  }
  changePassword = () => {
    if(this.passwordForm.invalid){
      this.passwordForm.markAllAsTouched();
      return;
    }
    else if(this.NewPasswordFormControl.value != this.ConfirmPasswordFormControl.value){
      this.toaster.error('New Password and Confirm Password must be same');
      return;
    }
    else if(this.CurrentPasswordFormControl.value == this.NewPasswordFormControl.value){
      this.toaster.error('New Password and Current Password must not same');
      return;
    }
    else{
      this.authService.changePassword(this.passwordForm.value).subscribe((x) => {console.log(x)
        if (x.Success) {
          this.activeModal.close();
          this.toaster.success('Password Changed Successfully!!');
          this.authService.logout();
          this.router.navigate(['/account/login']);
        }
        else if(!x.Success){
            this.toaster.warning(x.Message,'warning');
        }
        else {
          this.toaster.error('error in password change');
        }
      })
    }
  }
}
