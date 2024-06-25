import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink/dist/subsink';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TAdAInitModel, TAdAModel } from 'src/app/core/models/mastersetup-model/TAdAModel.model';
import { TAdAService } from 'src/app/core/services/MasterSetup/tAdA.service';

@Component({
  selector: 'app-add-edit-t-ad-a',
  templateUrl: './add-edit-t-ad-a.component.html',
  styleUrls: ['./add-edit-t-ad-a.component.scss']
})

export class AddEditTAdAComponent implements OnInit, OnDestroy {

  @Input() public isEdit: boolean;
  @Input() public aModel: TAdAModel;
  tAdAModel: TAdAModel;
  tAdAInitModel: TAdAInitModel;
  tAdAForm: FormGroup;
  subSink: SubSink;
  labelListTitle: string;

  constructor(private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService,
    private tAdAService: TAdAService) {
    this.subSink = new SubSink();
  }

  ngOnInit() {
    this.loadInitData();
    this.createForm();
    let title = this.isEdit ? "Edit " : "Create ";
    this.labelListTitle = title + "TA-DA";
  }
  private loadInitData() {
    this.subSink.sink = this.tAdAService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.tAdAInitModel = res;
          if (this.isEdit) {
            this.loadWorkFlowDetails(this.aModel);
          }
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

  loadWorkFlowDetails(model: any) {
    this.DesignationFormControl.setValue(model.DesignationId);
    this.tAdAForm.patchValue({
      Id: this.aModel.Id,
      BreakfastMajor: this.aModel.BreakfastMajor,
      BreakfastMinor: this.aModel.BreakfastMinor,
      LunchMajor: this.aModel.LunchMajor,
      LunchMinor: this.aModel.LunchMinor,
      DinnerMajor: this.aModel.DinnerMajor,
      DinnerMinor: this.aModel.DinnerMinor,
      SnacksMajor: this.aModel.SnacksMajor,
      SnacksMinor: this.aModel.SnacksMinor,
      TotalFoodMajor: this.aModel.TotalFoodMajor,
      TotalFoodMinor: this.aModel.TotalFoodMinor,
      HotelMajor: this.aModel.HotelMajor,
      HotelMinor: this.aModel.HotelMinor,
      LocalTransPortMajor: this.aModel.LocalTransPortMajor,
      LocalTransPortMinor: this.aModel.LocalTransPortMinor,
      TotalAllownaceMajor: this.aModel.TotalAllownaceMajor,
      TotalAllownaceMinor: this.aModel.TotalAllownaceMinor
    });
  }

  createForm() {
    this.tAdAForm = this.fb.group({
      Id: [''],
      DesignationId: [null,Validators.required],
      BreakfastMajor: [null, Validators.required],
      BreakfastMinor: [null, Validators.required],
      LunchMajor: [null, Validators.required],
      LunchMinor: [null, Validators.required],
      DinnerMajor: [null, Validators.required],
      DinnerMinor: [null, Validators.required],
      SnacksMajor: [null, Validators.required],
      SnacksMinor: [null, Validators.required],
      TotalFoodMajor: [null, Validators.required],
      TotalFoodMinor: [null, Validators.required],
      HotelMajor: [null, Validators.required],
      HotelMinor: [null, Validators.required],
      LocalTransPortMajor: [null, Validators.required],
      LocalTransPortMinor: [null, Validators.required],
      TotalAllownaceMajor: [null, Validators.required],
      TotalAllownaceMinor: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.tAdAForm.invalid) {
      this.tAdAForm.markAllAsTouched();
      this.toaster.warning('Please fill all the required field !');
      return;
    }
    else {
      if (this.tAdAForm.value.Id > 0)
        this.onEdit();
      else
        this.onCreate();
    }
  }

  private onCreate() {
    this.tAdAForm.value.Id = 0;
    this.subSink.sink = this.tAdAService.save(this.tAdAForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('saved successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }

  private onEdit() {
    this.subSink.sink = this.tAdAService.update(this.tAdAForm.value).subscribe((x) => {
      if (x.Success) {
        this.toaster.success('updated successfully');
        this.activeModal.close(x);
      } else {
        this.toaster.error(x.Message);
      }
    })
  }
  get DesignationFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('DesignationId') : null;
  }
  get BreakfastMajorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('BreakfastMajor') : null;
  }
  get BreakfastMinorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('BreakfastMinor') : null;
  }
  get LunchMajorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('LunchMajor') : null;
  }
  get LunchMinorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('LunchMinor') : null;
  }
  get DinnerMajorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('DinnerMajor') : null;
  }
  get DinnerMinorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('DinnerMinor') : null;
  }
  get SnacksMajorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('SnacksMajor') : null;
  }
  get SnacksMinorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('SnacksMinor') : null;
  }
  get TotalFoodMajorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('TotalFoodMajor') : null;
  }
  get TotalFoodMinorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('TotalFoodMinor') : null;
  }
  get HotelMajorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('HotelMajor') : null;
  }
  get HotelMinorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('HotelMinor') : null;
  }
  get LocalTransPortMajorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('LocalTransPortMajor') : null;
  }
  get LocalTransPortMinorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('LocalTransPortMinor') : null;
  }
  get TotalAllownaceMajorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('TotalAllownaceMajor') : null;
  }
  get TotalAllownaceMinorFormControl() {
    return this.tAdAForm ? this.tAdAForm.get('TotalAllownaceMinor') : null;
  }
  onAmountChanges(){
    this.BreakfastMinorFormControl.setValue(
      (!isNaN(parseInt(this.BreakfastMajorFormControl.value)) ? parseInt(this.BreakfastMajorFormControl.value) : 0));
    this.LunchMinorFormControl.setValue(
      (!isNaN(parseInt(this.LunchMajorFormControl.value)) ? parseInt(this.LunchMajorFormControl.value) : 0));
    this.SnacksMinorFormControl.setValue(
      (!isNaN(parseInt(this.SnacksMajorFormControl.value)) ? parseInt(this.SnacksMajorFormControl.value) : 0));
    this.DinnerMinorFormControl.setValue(
      (!isNaN(parseInt(this.DinnerMajorFormControl.value)) ? parseInt(this.DinnerMajorFormControl.value) : 0));
    this.TotalFoodMajorFormControl.setValue(
      (!isNaN(parseInt(this.BreakfastMajorFormControl.value)) ? parseInt(this.BreakfastMajorFormControl.value) : 0)
      + (!isNaN(parseInt(this.LunchMajorFormControl.value)) ? parseInt(this.LunchMajorFormControl.value) : 0)
      + (!isNaN(parseInt(this.DinnerMajorFormControl.value)) ? parseInt(this.DinnerMajorFormControl.value) : 0)
      + (!isNaN(parseInt(this.SnacksMajorFormControl.value)) ? parseInt(this.SnacksMajorFormControl.value) : 0)
    );
    this.TotalFoodMinorFormControl.setValue(
      (!isNaN(parseInt(this.BreakfastMinorFormControl.value)) ? parseInt(this.BreakfastMinorFormControl.value) : 0)
      + (!isNaN(parseInt(this.LunchMinorFormControl.value)) ? parseInt(this.LunchMinorFormControl.value) : 0)
      + (!isNaN(parseInt(this.DinnerMinorFormControl.value)) ? parseInt(this.DinnerMinorFormControl.value) : 0)
      + (!isNaN(parseInt(this.SnacksMinorFormControl.value)) ? parseInt(this.SnacksMinorFormControl.value) : 0)
    );
    this.TotalAllownaceMajorFormControl.setValue(
      (!isNaN(parseInt(this.TotalFoodMajorFormControl.value)) ? parseInt(this.TotalFoodMajorFormControl.value) : 0)
      + (!isNaN(parseInt(this.HotelMajorFormControl.value)) ? parseInt(this.HotelMajorFormControl.value) : 0)
      + (!isNaN(parseInt(this.LocalTransPortMajorFormControl.value)) ? parseInt(this.LocalTransPortMajorFormControl.value) : 0)
    );
    this.TotalAllownaceMinorFormControl.setValue(
      (!isNaN(parseInt(this.TotalFoodMinorFormControl.value)) ? parseInt(this.TotalFoodMinorFormControl.value) : 0)
      + (!isNaN(parseInt(this.HotelMinorFormControl.value)) ? parseInt(this.HotelMinorFormControl.value) : 0)
      + (!isNaN(parseInt(this.LocalTransPortMinorFormControl.value)) ? parseInt(this.LocalTransPortMinorFormControl.value) : 0)
    );
  }
}