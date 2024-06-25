import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApproverSubGroupModel } from 'src/app/core/models/group-model/approverSubGroup.model';
import { ApproverSubGroupService } from 'src/app/core/services/ApproverGroup/approverSubGroup.service';

@Component({
  selector: 'app-add-edit-approver-sub-group',
  templateUrl: './add-edit-approver-sub-group.component.html',
  styleUrls: ['./add-edit-approver-sub-group.component.scss']
})

export class AddEditApproverSubGroupComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  approverSubGroupModel: ApproverSubGroupModel;
  approverSubGroupForm: FormGroup;
  subSink: SubSink;
  labelListTitle: string;

  constructor(private router: Router,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private approverSubGroupService: ApproverSubGroupService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.loadInitData();
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Approver Sub-Group";
    if (this.isEdit) {
      this.loadDetails();
    }
  }
  private loadInitData() {
    this.subSink.sink = this.approverSubGroupService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.approverSubGroupModel = res;
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

  loadDetails() {
    this.approverSubGroupForm.patchValue({
      Id: this.aModel.Id,
      Name: this.aModel.Name,
      IsActive: this.aModel.IsActive,
      ApproverGroupId: this.aModel.ApproverGroupId,
      DepartmentId: this.aModel.DepartmentId
    });
  }

  createForm() {
    this.approverSubGroupForm = this.fb.group({
      Id: [''],
      Name: ['', Validators.required],
      IsActive: [true, Validators.required],
      DepartmentId: [null],
      ApproverGroupId: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.approverSubGroupForm.invalid) {
      this.approverSubGroupForm.markAllAsTouched();
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.approverSubGroupForm.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

  private onCreate() {
    this.approverSubGroupForm.value.Id = 0;
    this.subSink.sink = this.approverSubGroupService.save(this.approverSubGroupForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('approver Sub-Group saved successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.approverSubGroupService.update(this.approverSubGroupForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('approver Sub-Group  updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

}