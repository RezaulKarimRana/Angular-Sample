import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApproverGroupService } from 'src/app/core/services/ApproverGroup/approverGroup.service';
import { ApproverGroupModel } from 'src/app/core/models/group-model/approverGroup.model';

@Component({
  selector: 'app-add-edit-approver-group',
  templateUrl: './add-edit-approver-group.component.html',
  styleUrls: ['./add-edit-approver-group.component.scss']
})

export class AddEditApproverGroupComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  approverGroupModel: ApproverGroupModel;
  approverGroupForm: FormGroup;
  subSink: SubSink;
  labelListTitle: string;

  constructor(private router: Router,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private approverGroupService: ApproverGroupService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Approver Group";
    if (this.isEdit) {
      this.loadDetails();
    }
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  loadDetails() {
    this.approverGroupForm.patchValue({
      Id: this.aModel.Id,
      Name: this.aModel.Name,
      IsActive: this.aModel.IsActive
    });
  }

  createForm() {
    this.approverGroupForm = this.fb.group({
      Id: [''],
      Name: ['', [Validators.required, , Validators.maxLength(256)]],
      IsActive: [true, Validators.required],
    });
  }

  onSubmit() {
    if (this.approverGroupForm.invalid) {
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.approverGroupForm.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

  private onCreate() {
    this.approverGroupForm.value.Id = 0;
    this.subSink.sink = this.approverGroupService.save(this.approverGroupForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('Approver Group added successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.approverGroupService.update(this.approverGroupForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('Approver Group updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

}