import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DistrictService } from '../../../../core/services/MasterSetup/district.service';
import { UserProfileService } from '../../../../core/services/MasterSetup/user.service';
import { DistrictModel, DistrictViewModel } from '../../../../core/models/mastersetup-model/district.model';

@Component({
  selector: 'app-add-edit-district',
  templateUrl: './add-edit-district.component.html',
  styleUrls: ['./add-edit-district.component.scss']
})

export class AddEditDistrictComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel;

  breadCrumbItems: Array<{}>;
  districtModel: DistrictModel;
  initModel: DistrictViewModel;
  districtForm: FormGroup;
  subSink: SubSink;
  labelListTitle: string;


  constructor(private router: Router,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private districtService: DistrictService,
    private userService: UserProfileService) 
    {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "District";
    if (this.isEdit) {
      this.loadUserDetailsById(this.aModel.Id);
    }
    
  }

  createForm() {
    this.districtForm = this.fb.group({
      Id: [''],
      Name: ['',Validators.required],
      RioId: ['',Validators.required],
      IsMajor: ['', Validators.required],
      IsActive: [true, Validators.required]
    });
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  loadDistrictDetails() {   
    this.districtForm.patchValue({
      Id: this.aModel.Id,
      Name: this.aModel.Name,
      RioId: this.aModel.RIOId,      
      IsMajor: this.aModel.IsMajor,
      IsActive: this.aModel.IsActive
    });
  }

  private loadUserDetailsById(Id: number) {
    this.subSink.sink = this.userService.getById(Id).subscribe(
      (res) => {
        if (res) {
          this.loadDistrictDetails();
        }
        
      },
      (err) => {
        this.toaster.error(err, "Error");
      });
  }

  onSubmit() {
    if (this.districtForm.invalid) {
      this.districtForm.markAllAsTouched();
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.districtForm.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

  private onCreate() {
    this.districtForm.value.Id = 0;
    this.subSink.sink = this.districtService.save(this.districtForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('district others saved successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.districtService.update(this.districtForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('district others updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

}