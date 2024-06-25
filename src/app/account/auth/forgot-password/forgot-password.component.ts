import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SubSink } from 'subsink/dist/subsink';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { CodeNamePair } from '../../../core/models/mastersetup-model/codenamepair.model';
import { ToastrService } from 'ngx-toastr';
import { ConstantMessages } from 'src/app/core/enums/constants';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {

  innerWidth: any;
  subSink = new SubSink();
  employeeTypeList: CodeNamePair[];
  loginForm: FormGroup;
  submitted: boolean = false;
  error: string = '';
  year: number = new Date().getFullYear();
  apiUrl: string = "";
  loading: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private toaster: ToastrService) { }


  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    document.body.classList.add('auth-body-bg')
    this.loginForm = this.formBuilder.group({
      employeeTypeId:[null, [Validators.required]],
      hrId:[null,[Validators.required]]
    });
    this.getInitData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth + 'Resize');
  }
  
  get f() { return this.loginForm.controls; }


  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    else {
      this.ResetPassword();
    }
  }

  //#region ServiceCall
  private ResetPassword() {
    this.loading = true;
    this.authservice.resetPassword(this.loginForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('Password reset success!!', 'A new password sent to your e-mail', {
          timeOut: 5000,
        });
        this.authservice.logout();
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

  private getInitData() {
    this.subSink.sink = this.authservice.getInitData().subscribe(res => {
      this.employeeTypeList = res['EmployeeTypeList'];
    }, err => {
      this.toaster.error(ConstantMessages.refreshAndTryAgainMessage);
    });
  }
}
