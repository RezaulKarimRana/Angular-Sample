import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApproverSubGroupUserModel } from 'src/app/core/models/group-model/approver.subGroupUser.model';
import { ApproverSubGroupUserService } from 'src/app/core/services/ApproverGroup/approverSubGroupUser.service';
import { UserModel } from 'src/app/core/models/mastersetup-model/user.model';
import { CodeNamePair } from 'src/app/core/models/mastersetup-model/codenamepair.model';
import { ApproverSubGroupModel } from 'src/app/core/models/group-model/approverSubGroup.model';

@Component({
  selector: 'app-add-edit-approver-sub-grou-user-list',
  templateUrl: './add-edit-approver-sub-grou-user-list.component.html',
  styleUrls: ['./add-edit-approver-sub-grou-user-list.component.scss']
})

export class AddEditApproverSubGrouUserListComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  allSubGroupList: ApproverSubGroupModel[] = [];
  approverSubGroupList: ApproverSubGroupModel[] = [];
  approverSubGroupUserModel: ApproverSubGroupUserModel;
  approverSubGroupUserForm: FormGroup;
  subSink: SubSink;
  loading: boolean = false;
  labelListTitle: string;
  departmentList: CodeNamePair[] = [];
  approveruserModel: UserModel[] = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private approverSubGroupUserService: ApproverSubGroupUserService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.loadInitData();
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Approver Sub-Group User";
    if (this.isEdit) {
      this.loadDetails();
    }
  }
  get departmentFormControl() {
    return this.approverSubGroupUserForm ? this.approverSubGroupUserForm.get('DepartmentId') : null;
  }
  get approverSubGroupFormControl() {
    return this.approverSubGroupUserForm ? this.approverSubGroupUserForm.get('ApproverSubGroupId') : null;
  }
  
  get userIdFormControl() {
    return this.approverSubGroupUserForm ? this.approverSubGroupUserForm.get('UserId') : null;
  }
  
  get isActiveFormControl() {
    return this.approverSubGroupUserForm ? this.approverSubGroupUserForm.get('IsActive') : null;
  }
  selectSubGroup(){
    this.approverSubGroupList = this.allSubGroupList.filter(x=> x.DepartmentId == this.departmentFormControl.value);
  }
  private loadInitData() {
    this.loading = true;
    this.subSink.sink = this.approverSubGroupUserService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.loading = false;
          this.departmentList = res.departmentList;
          this.allSubGroupList = res.approverSubGroupList;
          this.approverSubGroupList = res.approverSubGroupList;
          this.approveruserModel = res.userList;
        }
      },
      (err) => {
        this.loading = false;
        this.toaster.error(err, "Error");
      }
    );
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  loadDetails() {
    this.approverSubGroupUserForm.patchValue({
      Id: this.aModel.Id,
      IsActive: this.aModel.IsActive,
      UserId: this.aModel.UserId,
      ApproverSubGroupId: this.aModel.ApproverSubGroupId,
      DepartmentId: this.aModel.DepartmentId
    });
  }

  createForm() {
    this.approverSubGroupUserForm = this.fb.group({
      Id: [''],
      IsActive: [true, Validators.required],
      UserId: [null, Validators.required],
      DepartmentId: [null],
      ApproverSubGroupId: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.approverSubGroupUserForm.invalid) {
      this.approverSubGroupUserForm.markAllAsTouched();
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.approverSubGroupUserForm.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

  private onCreate() {
    let data = this.prepareSupervisorData();
    data.Id = 0;
    this.subSink.sink = this.approverSubGroupUserService.save(data).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('approver Sub-Group User saved successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    let data = this.prepareSupervisorData();
    data.Id = this.approverSubGroupUserForm.value.Id;
    this.subSink.sink = this.approverSubGroupUserService.update(data).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('approver Sub-Group User  updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  prepareSupervisorData(): ApproverSubGroupUserModel {
    const _approverSubGroupUserModel = new ApproverSubGroupUserModel();
    _approverSubGroupUserModel.UserId = this.userIdFormControl.value;
    _approverSubGroupUserModel.ApproverSubGroupId = this.approverSubGroupFormControl.value;
    _approverSubGroupUserModel.DepartmentId = this.departmentFormControl.value;
    _approverSubGroupUserModel.IsActive = this.isActiveFormControl.value;
    return _approverSubGroupUserModel;
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.FullName?.toLocaleLowerCase().indexOf(term) > -1
      || item.Designations?.Name.toLocaleLowerCase().indexOf(term) > -1
      || item.Department?.Name.toLocaleLowerCase().indexOf(term) > -1;
  }
}