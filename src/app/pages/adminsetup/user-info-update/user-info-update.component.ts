import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base/base.service';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { UserInfoUpdateInitModel, UserInfoUpdateModel } from 'src/app/core/models/admin-support/adminSupport.model';
import { AdminSupportService } from 'src/app/core/services/AdminSupport/adminSupport.service';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-user-info-update',
  templateUrl: './user-info-update.component.html'
})
export class UserInfoUpdateComponent extends BaseComponent implements OnInit, OnDestroy {

  subSink: SubSink;
  pageTitle: string;
  loading: boolean = false;
  formGroup: FormGroup;
  initModel: UserInfoUpdateInitModel;

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private service: AdminSupportService,
    private fb: FormBuilder
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    this.pageTitle = 'Admin Support Panel';
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      SupportTypeId: [null, Validators.required],
      UserId: [null, Validators.required],
      BillReviewerId: [null]
    });
    this.loadInitData();
  }
  get supportTypeFC() {
    return this.formGroup ? this.formGroup.get('SupportTypeId') : null;
  }
  get userFC() {
    return this.formGroup ? this.formGroup.get('UserId') : null;
  }
  get billReviewerFC() {
    return this.formGroup ? this.formGroup.get('BillReviewerId') : null;
  }
  private loadInitData() {
    this.subSink.sink = this.service.getUserInfoInitData().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  onModifyInfo(){
    if(this.formGroup.invalid)
    {
      this.formGroup.markAllAsTouched();
      return;
    }
    if(this.supportTypeFC.value == 1 && this.billReviewerFC.value <= 0)
    {
      this.toaster.error('Please Select Bill Reviewer','error');
      return;
    }
    let data = new UserInfoUpdateModel({
      SupportTypeId: this.supportTypeFC.value,
      UserId: this.userFC.value,
      BillReviewerId: this.billReviewerFC.value
		});
    this.loading = true;
    this.subSink.sink = this.service.updateUserInfo(data).subscribe((x) => {
      if (x.Success) {
        this.loading = false;
        this.toaster.success(x.Message);
      } else {
        this.loading = false;
        this.toaster.error(x.Message);
      }
    })
  }
}
