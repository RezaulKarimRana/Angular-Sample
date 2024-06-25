import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OfficeLocationService } from 'src/app/core/services/MasterSetup/officeLocation.service';
import { DistrictModel } from 'src/app/core/models/mastersetup-model/district.model';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html'
})

export class OfficeLocationAddEditComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  districts: DistrictModel[];
  officeLocationForm: FormGroup;
  subSink: SubSink;
  labelListTitle: string;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private service: OfficeLocationService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.loadInitData();
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "Office Location";
    if (this.isEdit) {
      this.loadDetails();
    }
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  loadDetails() {
    this.officeLocationForm.patchValue({
      Id: this.aModel.Id,
      Name: this.aModel.Name,
      DistrictId: this.aModel.DistrictId,
      DistrictName: this.aModel.DistrictName,
      IsActive: this.aModel.IsActive
    });
  }

  createForm() {
    this.officeLocationForm = this.fb.group({
      Id: [''],
      DistrictId: [null,Validators.required],
      Name: ['', [Validators.required, , Validators.maxLength(256)]],
      IsActive: [true, Validators.required]
    });
  }

  onSubmit() {
    if (this.officeLocationForm.invalid) {
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.officeLocationForm.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

  private onCreate() {
    this.officeLocationForm.value.Id = 0;
    this.subSink.sink = this.service.save(this.officeLocationForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('Office location added successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.service.update(this.officeLocationForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('Office location updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }
  private loadInitData() {
    this.subSink.sink = this.service.getAllDistricts().subscribe(
      (res) => {
        if (res) {
          this.districts = res;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
}