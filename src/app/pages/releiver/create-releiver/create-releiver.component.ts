import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SubSink } from 'subsink/dist/subsink';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { Releiver, ReleiverInitModel, ReleiverViewModel } from 'src/app/core/models/releiver/releiver.model';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { ReleiverService } from 'src/app/core/services/releiver/releiver.service';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-create-releiver',
  templateUrl: './create-releiver.component.html',
  styleUrls: ['./create-releiver.component.scss']
})

export class CreateReleiverComponent extends BaseComponent implements OnInit,OnDestroy {
  
  todaysDate: object = new Date();
  isEdit: boolean = false;
  pageTitle:string;
  subSink: SubSink;
  formGroup: FormGroup;
  aModel: ReleiverViewModel;
  initModel: ReleiverInitModel;
  loading:boolean= false;
  portalUserViewModel : PortalUserViewModel;

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private releiverService: ReleiverService,
    private formBuilder: FormBuilder) {
    super(toaster,baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    if (cn && cn.extras.state) {
      if(cn.extras.state.id != null && cn.extras.state.id != undefined && cn.extras.state.id != ''){
        this.pageTitle = 'Edit';
        this.isEdit = true;
        this._fetchData(cn.extras.state.id);
      }
    }
    else{
      this.pageTitle = 'Create';
    }
  }

  ngOnInit() {
    var date = new Date();
    var obj = { year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate() };
    this.todaysDate = obj;
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
      this.loadInitData();
      this.createForm();
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      Id: [null],
      PublicId: [''],
      ReleiveFromDate: [null, Validators.required],
      ReleiveToDate: [null, Validators.required],
      ReleiverId: [null, Validators.required],
      Justification: ['',Validators.required]
    });
  }
  //#region FormGroup
  get releiveFromDateFC() {
    return this.formGroup ? this.formGroup.get('ReleiveFromDate') : null;
  }
  get releiveToDateFC() {
    return this.formGroup ? this.formGroup.get('ReleiveToDate') : null;
  }
  get releiverIdFC() {
    return this.formGroup ? this.formGroup.get('ReleiverId') : null;
  }
  get justificationFC() {
    return this.formGroup ? this.formGroup.get('Justification') : null;
  }
  //#endregion
  packageForm(): Releiver {
    let userId = this.portalUserViewModel.Id;
		let data = new Releiver({
      Id: this.aModel?.Id > 0 ? this.aModel.Id : 0,
			ReleiveFromDate: this.formatDate(this.formGroup.value.ReleiveFromDate),
			ReleiveToDate: this.formatDate(this.formGroup.value.ReleiveToDate),
			ReleiverId: this.releiverIdFC.value,
			Justification: this.formGroup.value.Justification,
      StatusId: ApplicationStatus.Pending,
      UserId:userId,
      RequestNo : this.aModel?.Id > 0 ? this.aModel.RequestNo : null
		});
		return data;
	}

  private loadInitData() {
    this.subSink.sink = this.releiverService.getInitData().subscribe(
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

  onSubmit() {
    if( this.aModel?.Id == null && this.formGroup.invalid)
    {
      this.formGroup.markAllAsTouched();
      return null;
    }
    this.loading = true;
    let inv = this.packageForm();
    this.subSink.sink = this.releiverService.save(inv).subscribe((x) => {
      if (x.Success) {
        this.loading = false;
        this.toaster.success('Saved Successfully');
        this.router.navigate(['/releiver/list']);
      } else {
        this.loading = false;
        this.toaster.error(x.Message);
        this.router.navigate(['/releiver/list']);
      }
    })
  }
  _fetchData=(id: string)=>{
    this.loading = true;
    this.subSink.sink = this.releiverService.getById(id).subscribe(
      (res) => {
        if (res.Success) {
          this.aModel = res.Data;
          this.loadAdvanceRequisition(this.aModel);
          this.loading = false;
        }
        else {
          this.toaster.error(res['Message'], "Error");
          this.router.navigate(['/advances/pending-list']);
          this.loading = false;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
        this.loading = false;
      }
    );
  }

  loadAdvanceRequisition(aModel: any) {
    this.formGroup.patchValue({
      Id: aModel.Id,
      PublicId: aModel.PublicId,
      ReleiveFromDate: this.stringToNgbDate(aModel.ReleiveFromDate),
      ReleiveToDate: this.stringToNgbDate(aModel.ReleiveToDate),
      ReleiverId: aModel.ReleiverId,
      Justification: aModel.Justification
    });
  }
}