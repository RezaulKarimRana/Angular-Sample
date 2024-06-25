import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { TaskTypeDetailsService } from '../../../../core/services/MasterSetup/taskTypeDetails.service';
import { TaskTypeDetailsModel, UrlTypeModel } from '../../../../core/models/mastersetup-model/tasktypedetails.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class TaskTypeDetailsAddEditComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  breadCrumbItems: Array<{}>;
  taskTypeDetailsModel: TaskTypeDetailsModel;
  initModel: TaskTypeDetailsModel;
  taskTypeDetailsForm: FormGroup;
  subSink: SubSink;

  codeNamePairId: string;
  labelListTitle: string;
  urlTypeModel :UrlTypeModel;

  constructor(private router: Router,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private taskTypeDetailsService: TaskTypeDetailsService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.loadInitData();
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Task Type Details";
    if (this.isEdit) {
      this.loadTaskTypeDetailsById(this.aModel.Id);
    }
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  private loadInitData() {
    this.subSink.sink = this.taskTypeDetailsService.getInitData().subscribe(
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

  createForm() {
    this.taskTypeDetailsForm = this.fb.group({
      Id: [''],
      Name: ['', [Validators.required, , Validators.maxLength(256)]],
      IsActive: [true, Validators.required],
      TaskTypeId: ['',Validators.required],
    });
  }

  loadTaskTypeDetails(aModel: TaskTypeDetailsModel) {
    this.taskTypeDetailsForm.patchValue({
      Id: aModel.Id,
      Name: aModel.Name,
      IsActive: aModel.IsActive,
      TaskTypeId: aModel.TaskTypeId
    });
  }

  private loadTaskTypeDetailsById(Id: number) {
    this.subSink.sink = this.taskTypeDetailsService.getTaskTypeDetailsById(Id).subscribe(
      (res) => {
        if (res) {
          this.taskTypeDetailsModel = res;
          this.loadTaskTypeDetails(this.taskTypeDetailsModel);
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      });
  }
  
  onSubmit() {
    if (this.taskTypeDetailsForm.invalid) {
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.taskTypeDetailsForm.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

 

  private onCreate() {
    this.taskTypeDetailsForm.value.Id = 0;
    this.subSink.sink = this.taskTypeDetailsService.save(this.taskTypeDetailsForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('task type details added successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.taskTypeDetailsService.update(this.taskTypeDetailsForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('task type details updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

}