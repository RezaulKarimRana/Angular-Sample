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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  
  showPassword: boolean;
  innerWidth: any;
  subSink = new SubSink();
  employeeTypeList: CodeNamePair[];
  loginForm: FormGroup;
  submitted: boolean = false;
  error: string = '';
  returnUrl: string;
  year: number = new Date().getFullYear();
  passwordType: boolean = false;
  isMobileNo: boolean = false;
  apiUrl: string = "";
  loading: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authservice: AuthService,
    private toaster: ToastrService) { }


  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    document.body.classList.add('auth-body-bg')
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['', [Validators.required]],
      employeeTypeId:[null, [Validators.required]],
      hrId:[null,[Validators.required]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
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
      this.Login();
    }
  }

  //#region ServiceCall
  private Login() {
    this.apiUrl = ConstantMessages.Login;
    this.loading = true;
    this.authservice.login(this.f.hrId.value, this.f.password.value, this.f.employeeTypeId.value, this.apiUrl)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if(data.Success)
          {
            this.router.navigateByUrl(this.returnUrl);
          }
          else{
            this.toaster.error(data.Message,'error');
          }
        },
        error => {
          this.loading = false;
          this.toaster.error(ConstantMessages.loginErrorMessage);
        });
  }

  private getInitData() {
    this.subSink.sink = this.authservice.getInitData().subscribe(res => {
      this.employeeTypeList = res['EmployeeTypeList'];
    }, err => {
      this.toaster.error(ConstantMessages.refreshAndTryAgainMessage);
    });
  }

  //#endregion

  public showHidePassword() {
    this.passwordType = !this.passwordType;
  }
}
