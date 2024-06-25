import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { BankAccountService } from '../../../../core/services/MasterSetup/bankaccount.service';
import { UserProfileService } from '../../../../core/services/MasterSetup/user.service';

import { BankAccountInitModel, BankAccountModel } from '../../../../core/models/mastersetup-model/bankaccount.model';
import { UserModel } from '../../../../core/models/mastersetup-model/user.model';

@Component({
  selector: 'app-add-edit-bankaccount',
  templateUrl: './add-edit-bankaccount.component.html',
  styleUrls: ['./add-edit-bankaccount.component.scss']
})

export class AddEditBankAccountComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  breadCrumbItems: Array<{}>;
  bankaccountModel: BankAccountModel;
  initModel: BankAccountInitModel;
  bankaccountForm: FormGroup;
  subSink: SubSink;
  labelListTitle: string;
  usersModel: UserModel[] = [];
  userModel: UserModel;

  constructor(private router: Router,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private bankaccountService: BankAccountService,
    private userService: UserProfileService) 
    {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.loadInitData();
    this.createForm();
    this.onChanges();
    
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Bank Account";
    if (this.isEdit) {
      this.loadUserDetailsById(this.aModel.UserId);
    }
    
  }
  private loadInitData() {
    this.subSink.sink = this.bankaccountService.getInitData().subscribe(
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

  loadBankAccountDetails() {
    
    this.bankaccountForm.patchValue({
      Id: this.aModel.Id,
      BankName: this.aModel.BankName,
      AccountNo: this.aModel.AccountNo,
      AccountType: this.aModel.AccountType,
      RouterNo: this.aModel.RouterNo,
      DepartmentId: this.userModel['DepartmentId'],
      UserId: this.aModel.UserId,
      Condition: this.aModel.Condition
    });
  }

  private loadUserDetailsById(Id: number) {
    this.subSink.sink = this.userService.getById(Id).subscribe(
      (res) => {
        if (res) {
          this.userModel = res;
          this.loadBankAccountDetails();
        }
        
      },
      (err) => {
        this.toaster.error(err, "Error");
      });
  }

  createForm() {
    this.bankaccountForm = this.fb.group({
      Id: [''],
      BankName: ['',Validators.required],
      AccountNo: ['',Validators.required],
      AccountType: ['',Validators.required],
      RouterNo: ['',Validators.required],
      DepartmentId: ['',Validators.required],
      UserId: ['',Validators.required],
      Condition: ['',Validators.required]
    });
  }

  onSubmit() {
    if (this.bankaccountForm.invalid) {
      this.bankaccountForm.markAllAsTouched();
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.bankaccountForm.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

  private onCreate() {
    this.bankaccountForm.value.Id = 0;
    this.subSink.sink = this.bankaccountService.save(this.bankaccountForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('bank account others saved successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.bankaccountService.update(this.bankaccountForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('bank account others updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.FullName?.toLocaleLowerCase().indexOf(term) > -1 
    || item.Designations?.Name.toLocaleLowerCase().indexOf(term) > -1 
    || item.Department?.Name.toLocaleLowerCase().indexOf(term) > -1;
  }

  get departmentIdFormControl() {
    return this.bankaccountForm ? this.bankaccountForm.get('DepartmentId') : null;
  }
  get userIdFormControl() {
    return this.bankaccountForm ? this.bankaccountForm.get('UserId') : null;
  }
  public onChanges() {
    this.subSink.sink = this.departmentIdFormControl.valueChanges.subscribe(value => {
      this.loadUserByDepartment(value);
      this.userIdFormControl.setValue("");
    });
  }

  private loadUserByDepartment(Id: number) {
    this.subSink.sink = this.userService.getUserByDepartment(Id).subscribe(
      (res) => {
        if (res) {
          this.usersModel = res;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      });
  }

}