import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdvanceApproverMatrixService } from 'src/app/core/services/Advance/advanceApproverMatrix.service';
import { ApprovalWorkFlowMatrixModel } from 'src/app/core/models/advance-model/approvalWorkFlowMatrix.model';
import { ApproverSubGroupModel } from 'src/app/core/models/group-model/approverSubGroup.model';

@Component({
  selector: 'app-add-edit-advance-approver-matrix',
  templateUrl: './add-edit-advance-approver-matrix.component.html',
  styleUrls: ['./add-edit-advance-approver-matrix.component.scss']
})

export class AddEditAdvanceApproverMatrixComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  initModel: ApprovalWorkFlowMatrixModel;
  acknowledgerGroupList: ApproverSubGroupModel[];
  verifierGroupList: ApproverSubGroupModel[];
  recommanderGroupList: ApproverSubGroupModel[];
  verifierHRGroupList: ApproverSubGroupModel[];
  financeCheckGroupList: ApproverSubGroupModel[];
  financeCompleteGroupList: ApproverSubGroupModel[];
  internalControlGroupList: ApproverSubGroupModel[];
  advanceApproverMatrixForm: FormGroup;
  subSink: SubSink;
  labelListTitle: string;

  constructor(private router: Router,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private advanceApproverMatrixService: AdvanceApproverMatrixService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.loadInitData();
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Approver Matrix";
    if (this.isEdit) {
      this.loadDetails();
    }
  }
  private loadInitData() {
    this.subSink.sink = this.advanceApproverMatrixService.getInitWorkFlow().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
          this.acknowledgerGroupList = this.initModel?.AcknowledgerGroupList;
          this.verifierGroupList = this.initModel?.VerifierGroupList;
          this.recommanderGroupList = this.initModel?.RecommanderGroupList;
          this.verifierHRGroupList = this.initModel?.VerifierHRGroupList;
          this.financeCheckGroupList = this.initModel?.FinanceCheckGroupList;
          this.financeCompleteGroupList = this.initModel?.FinanceCompleteGroupList;
          this.internalControlGroupList = this.initModel?.InternalControlGroupList;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
  selectSubGroup(){
    this.acknowledgerGroupList = this.initModel?.AcknowledgerGroupList.filter(x=> x.DepartmentId == this.departmentFormControl.value);
    this.verifierGroupList = this.initModel?.VerifierGroupList.filter(x=> x.DepartmentId == this.departmentFormControl.value);
    this.recommanderGroupList = this.initModel?.RecommanderGroupList.filter(x=> x.DepartmentId == this.departmentFormControl.value);
    this.verifierHRGroupList = this.initModel?.VerifierHRGroupList;
    this.financeCheckGroupList = this.initModel?.FinanceCheckGroupList;
    this.financeCompleteGroupList = this.initModel?.FinanceCompleteGroupList;
    this.internalControlGroupList = this.initModel?.InternalControlGroupList;
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  loadDetails() {
    this.advanceApproverMatrixForm.patchValue({
      Id: this.aModel.Id,
      Name: this.aModel.Name,
      IsActive: this.aModel.IsActive,
      DepartmentId: this.aModel.DepartmentId,
      AcknowledgerGroupId: this.aModel.AcknowledgerGroupId,
      VerifierGroupId: this.aModel.VerifierGroupId,
      RecommanderGroupId: this.aModel.RecommanderGroupId,
      ApproverId: this.aModel.ApproverId,
      STLCheckerId: this.aModel.STLCheckerId,
      VerifierHRGroupId: this.aModel.VerifierHRGroupId,
      FinanceCheckGroupId: this.aModel.FinanceCheckGroupId,
      FinanceCompleteGroupId: this.aModel.FinanceCompleteGroupId,
      InternalControlGroupId: this.aModel.InternalControlGroupId
    });
  }

  createForm() {
    this.advanceApproverMatrixForm = this.fb.group({
      Id: [''],
      Name: ['', Validators.required],
      IsActive: [true, Validators.required],
      DepartmentId: [null, Validators.required],
      AcknowledgerGroupId: [null],
      VerifierGroupId: [null],
      RecommanderGroupId: [null],
      ApproverId: [null],
      STLCheckerId: [null],
      VerifierHRGroupId: [null],
      FinanceCheckGroupId: [null, Validators.required],
      FinanceCompleteGroupId: [null, Validators.required],
      InternalControlGroupId: [null],
    });
  }

  get departmentFormControl() {
    return this.advanceApproverMatrixForm ? this.advanceApproverMatrixForm.get('DepartmentId') : null;
  }

  onSubmit() {
    if (this.advanceApproverMatrixForm.invalid) {
      this.advanceApproverMatrixForm.markAllAsTouched();
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.advanceApproverMatrixForm.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

  private onCreate() {
    this.advanceApproverMatrixForm.value.Id = 0;
    this.subSink.sink = this.advanceApproverMatrixService.save(this.advanceApproverMatrixForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('saved successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.advanceApproverMatrixService.update(this.advanceApproverMatrixForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

}