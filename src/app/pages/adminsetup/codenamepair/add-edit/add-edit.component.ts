import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { CodeNamePairService } from '../../../../core/services/MasterSetup/codenamepair.service';
import { CodeNamePair, UrlTypeModel } from '../../../../core/models/mastersetup-model/codenamepair.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class CodeNamePairAddEditComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  breadCrumbItems: Array<{}>;
  codeNamePair: CodeNamePair;
  codeNamePairForm: FormGroup;
  subSink: SubSink;

  codeNamePairId: string;
  labelListTitle: string;
  urlTypeModel :UrlTypeModel;

  constructor(private router: Router,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private codenamepairService: CodeNamePairService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.urlTypeModel =  this.codenamepairService.findCodeNamePairType(this.router.url);
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + this.urlTypeModel.Codenamepair;
    if (this.isEdit) {
      this.loadCodeNamePairDetails();
    }
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  loadCodeNamePairDetails() {
    this.codeNamePairForm.patchValue({
      Id: this.aModel.Id,
      Name: this.aModel.Name,
      IsActive: this.aModel.IsActive,
      HasChild: this.aModel.HasChild
    });
  }

  createForm() {
    this.codeNamePairForm = this.fb.group({
      Id: [''],
      Name: ['', [Validators.required, , Validators.maxLength(256)]],
      IsActive: [true, Validators.required],
      HasChild: [false],
    });
  }

  onSubmit() {
    if (this.codeNamePairForm.invalid) {
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.codeNamePairForm.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

  private onCreate() {
    this.codeNamePairForm.value.Id = 0;
    this.subSink.sink = this.codenamepairService.save(this.codeNamePairForm.value, this.urlTypeModel.ApiUrlType).subscribe((x) => {
      if (x.Success) {
        this.toaster.success(this.urlTypeModel.Codenamepair + ' added successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.codenamepairService.update(this.codeNamePairForm.value, this.urlTypeModel.ApiUrlType).subscribe((x) => {
      if (x.Success) {
        this.toaster.success(this.urlTypeModel.Codenamepair + ' updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

}