import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SubSink } from 'subsink/dist/subsink';
import { UserAllInfoModel, UserModel } from 'src/app/core/models/mastersetup-model/user.model';
import { BankAccountModel } from 'src/app/core/models/mastersetup-model/bankaccount.model';
import { UserProfileService } from 'src/app/core/services/MasterSetup/user.service';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';

@Component({
  selector: 'app-change-profilepic',
  templateUrl: './change-profilepic.component.html',
  styleUrls: ['./change-profilepic.component.scss']
})
export class ChangeProfilePicComponent implements OnInit, OnDestroy {

  @Input() public aModel;
  subSink: SubSink;
  initModel: UserModel;
  userForm: FormGroup;
  bankAccountList: BankAccountModel[] = [];
  file: File;
  imageUrl: string | ArrayBuffer = "assets/images/users/avatar-1.jpg";
  fileName: string = "No file selected"

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private userService: UserProfileService,
    private toaster: ToastrService,
    private dataService: DataService
  ) { this.subSink = new SubSink(); }

  ngOnInit(): void {
    this.loadInitData();
    this.createUserForm();
    this.loadUserDetails();
  }

  createUserForm() {
    this.userForm = this.fb.group({
      Id: [],
      HrId: [],
      SupervisorName:[],
      IsActive: [],
      isApprover: [],
      FullName: [],
      MobileNo: [],
      Email: [],
      CompanyId: [],
      EmpolyeeTypeId: [],
      DepartmentId: [],
      DesignationId: [],
      OfficeLocationId: []
    });
  }

  loadUserDetails() {
    this.subSink.sink = this.userService.getUserAllInfoByUserId(this.aModel.Id).subscribe(
      (res) => {
        if (res) {
          this.userForm.patchValue({
            Id: this.aModel.Id,
            HrId: this.aModel.HrId,
            SupervisorName: this.aModel.SupervisorName,
            IsActive: this.aModel.IsActive,
            isApprover: this.aModel.isApprover,
            FullName: this.aModel.FullName,
            MobileNo: this.aModel.MobileNo,
            Email: this.aModel.Email,
            CompanyId: this.aModel.CompanyId,
            EmpolyeeTypeId: this.aModel.EmpolyeeTypeId,
            DepartmentId: this.aModel.DepartmentId,
            DesignationId: this.aModel.DesignationId,
            OfficeLocationId: this.aModel.OfficeLocationId
          });
          this.imageUrl = res.ProfilePicUrl != null ? "data:image/png;base64," + res.ProfilePicUrl : "assets/images/users/avatar-1.jpg";
          this.bankAccountList = res.BankAccountList;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      });

  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  private loadInitData() {
    this.subSink.sink = this.userService.getUserInitData().subscribe(
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


  updateProfilePic() {
    if (this.file) {
      var size = this.file.size / 1024 / 1024;
      if (size > 1) {
        this.toaster.error('File is bigger than 1MB');
        return false;
      }
      let data = this.packageForm();
      this.userService.updateUserProfilePic(data).subscribe((x) => {
        if (x.Success) {
          localStorage.removeItem('ProfilePicUrl');
          localStorage.setItem('ProfilePicUrl', JSON.stringify(x['Data']['ProfilePicUrl']));
          this.dataService.emitUserProfilePicUpdated(true);
          this.toaster.success('user Profile Picture update Success!!');
          this.activeModal.close(x);
        } else {
          this.toaster.error('error in save');
        }
      })
    }
  }

  packageForm(): FormData {
    let userInfo = new UserModel();
    userInfo.Id = this.userForm.value.Id;
    userInfo.FullName = this.userForm.value.FullName;
    userInfo.MobileNo = this.userForm.value.MobileNo;
    userInfo.Email = this.userForm.value.Email;

    let data = new UserAllInfoModel({
      Usermodel: userInfo
    });

    return this.modelToFormData(data);
  }

  modelToFormData(data: UserAllInfoModel): FormData {

    const formData = new FormData();
    let modelData = JSON.stringify(data);
    formData.set('model', modelData);
    if (this.imageUrl) {
      formData.append('profileFile', this.file, this.fileName);
    }
    return formData;
  }

  onPicChange(file: File) {
    if (file) {
      this.fileName = file.name;
      this.file = file;
      var size = this.file.size / 1024 / 1024;
      if (size > 1) {
        this.toaster.warning('File is bigger than 1MB');
        return false;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        this.imageUrl = reader.result;
      };
    }
  }
}
