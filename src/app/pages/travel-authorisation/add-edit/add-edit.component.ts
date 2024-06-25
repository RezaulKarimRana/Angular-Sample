import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base/base.service';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { ApplicationConstant, ApplicationStatus, TravelAuthorizationType } from 'src/app/core/enums/constants';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { TAdAModel } from 'src/app/core/models/mastersetup-model/TAdAModel.model';
import { NameIdPair } from 'src/app/core/models/mastersetup-model/codenamepair.model';
import { TaskTypeDetailsModel } from 'src/app/core/models/mastersetup-model/tasktypedetails.model';
import { TravelAuthListModel, TravelAuthorization, TravelAuthorizationDetailsItem, TravelAuthorizationViewModel } from 'src/app/core/models/travel-authorisation-model/travelAuthorisation.model';
import { TravelAuthorizationService } from 'src/app/core/services/TravelAuthorization/travelAuth.service';
import { BankAccountComponent } from 'src/app/shared/ui/bank-account/bank-account.component';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent extends BaseComponent implements OnInit, OnDestroy {

  isCollapsed: boolean = false;
  todaysDate: object = new Date();
  subSink: SubSink;
  pageTitle: string;
  lastLocationFromId: number;
  loading: boolean = false;
  portalUserViewModel: PortalUserViewModel;
  isCheckerSet: boolean = false;
  formGroup: FormGroup;
  withAdvanceForm = {} as FormGroup;
  withoutAdvanceForm = {} as FormGroup;
  travelAuthTypeForm: FormGroup;
  recommenderFormGroup: FormGroup;
  bankFormGroup: FormGroup;
  initModel: TravelAuthListModel;
  projectList: TaskTypeDetailsModel[];
  implementationList: TaskTypeDetailsModel[];
  operationList: TaskTypeDetailsModel[];
  TravelAuthorizationTypeId: number;
  aModel: TravelAuthorizationViewModel;
  totalAllowance: number = 0;
  canAddItem:boolean = true;
  perDayAllowance: TAdAModel;
  isFinanceCheck:boolean = false;
  isFinanceComplete:boolean = false;
  finVoucherNo: string;
  rioId: number = 0;
  profilePicAsByteArrayAsBase64 : any;
  isRioChanged: boolean = false;
  tentativeSettlementMaxDate: Date = new Date();
  tentativeSettlementMinDate: Date = new Date();
  isValidationFailed: boolean = false;
  requesterUserId: number;
  innerWidth: any;
  @ViewChild('bankAccountComponent', { static: true })
	bankAccountComponent: BankAccountComponent;

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private travelAuthService: TravelAuthorizationService,
    private fb: FormBuilder
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    if (cn && cn.extras.state) {
      if (cn.extras.state.id != null && cn.extras.state.id != undefined && cn.extras.state.id != '') {
        this._fetchData(cn.extras.state.id);
        this.pageTitle = 'Edit Travel Authorization';
      }
    }
    else{
      this.pageTitle = 'Create Travel Authorization';
    }
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    var date = new Date();
    var obj = { year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate() };
    this.todaysDate = obj;
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    this.isFinanceCheck = this.portalUserViewModel.Is_Finance_Check;
    this.isFinanceComplete = this.portalUserViewModel.Is_Finance_Complete;
    this.rioId = this.portalUserViewModel.RIOId;
    this.travelAuthTypeForm = this.fb.group({
      Id: [null],
      PublicId: [''],
      TravelAuthorizationTypeId: [null, Validators.required],
      TravelAuthorizationTypeName: [''],
      SupervisorId: [null, Validators.required],
      SupervisorName:[''],
      StatusId:[ApplicationStatus.Pending],
      UserId: [null],
    });
    this.withAdvanceForm = this.fb.group({
      TravelAuthorizationDate: [{ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }],
      AdvanceRequisitionDate: [{ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }],
      TentativeSettlementDate: [null, Validators.required],
      Justification: ['',Validators.required],
      TotalAmount: [''],
			TravelAuthorizationDetailsItem: this.fb.array([])
		});
    this.withoutAdvanceForm = this.fb.group({
      TravelAuthorizationDate: [{ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() }],
      Justification: ['',Validators.required],
			TravelAuthorizationDetailsItem: this.fb.array([])
		});
    this.formGroup = this.fb.group({
      VoucherNo: [''],
      Remarks: ['']
    });
    this.recommenderFormGroup = this.fb.group({
      RecommenderId: [null, Validators.required]
    });
    this.bankFormGroup = this.fb.group({
      UserBankDetails: ['']
    });
    this.loadInitData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth + 'Resize');
  }

  get approverRemarksFC() {
		return this.formGroup ? this.formGroup.get('Remarks') : null;
	}
  get voucherNoFC() {
		return this.formGroup ? this.formGroup.get('VoucherNo') : null;
	}
  get recommenderFC() {
		return this.recommenderFormGroup ? this.recommenderFormGroup.get('RecommenderId') : null;
	}
  get userBankDetailsFormControl() {
		return this.bankFormGroup ? this.bankFormGroup.get('UserBankDetails') : null;
	}
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  createWithAdvanceItemsFormGroup() {
		return this.fb.group({
			WorkingDistrictId: [null, Validators.required],
      WorkingDistrictType:[''],
      LocationFromDistrictId: [null, Validators.required],
      LocationToDistrictId: [null, Validators.required],
      TaskTypeId: [null, Validators.required],
      TaskTypeDetailsId: [null, Validators.required],
      TaskTypeDetailsList: this.fb.array([]),
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Remarks: [''],
      NoOfDays: [''],
      AllowancecPerDay: [''],
      TotalDailyAllowance:[''],
      TravelAllowance:[''],
      EntertainmentAllowance:[''],
      MiscellaneousAllowance:[''],
      Total: [''],
      IsActive:[true]
		})
	}
  createWithoutAdvanceItemsFormGroup() {
		return this.fb.group({
			WorkingDistrictId: [null, Validators.required],
      WorkingDistrictType:[''],
      TaskTypeId: [null, Validators.required],
      TaskTypeDetailsId: [null, Validators.required],
      TaskTypeDetailsList: this.fb.array([]),
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Remarks: [''],
      IsActive:[true]
		})
	}
  get TravelAuthorizationTypeFc() {
    return this.travelAuthTypeForm ? this.travelAuthTypeForm.get('TravelAuthorizationTypeId') : null;
  }
  get supervisorFC() {
    return this.travelAuthTypeForm ? this.travelAuthTypeForm.get('SupervisorId') : null;
  }
  get supervisorNameFC() {
    return this.travelAuthTypeForm ? this.travelAuthTypeForm.get('SupervisorName') : null;
  }
  get withAdvJustificationFC() {
    return this.withAdvanceForm ? this.withAdvanceForm.get('Justification') : null;
  }
  get withoutAdvJustificationFC() {
    return this.withoutAdvanceForm ? this.withoutAdvanceForm.get('Justification') : null;
  }
  get withAdvanceItemsFormControl() {
		return this.withAdvanceForm ? this.withAdvanceForm.get('TravelAuthorizationDetailsItem') : null;
	}
  get withoutAdvanceItemsFormControl() {
		return this.withoutAdvanceForm ? this.withoutAdvanceForm.get('TravelAuthorizationDetailsItem') : null;
	}
  private loadInitData() {
    this.subSink.sink = this.travelAuthService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
          this.supervisorFC.setValue(this.initModel.SupervisorId);
          this.supervisorNameFC.setValue(this.initModel.SupervisorName);
          if(!this.initModel.ProfilePicUrl){
            this.toaster.info('You have no Profile Picture, Please Upload Your Profile Picture');
            this.router.navigate(['/travelauthorisation/list']);
          }
          if(this.initModel.BankAccountList.length == 0){
            this.toaster.info('You have no Bank Account, Please Contact with IT for add Bank Account');
            this.router.navigate(['/travelauthorisation/list']);
          }
          else{
            this.setBankInfo();
          }
          this.implementationList = this.initModel?.TaskTypeDetailsList.filter(x=> x.TaskTypeId == 3);
          this.projectList = this.initModel?.TaskTypeDetailsList.filter(x=> x.TaskTypeId == 2);
          this.operationList = this.initModel?.TaskTypeDetailsList.filter(x=> x.TaskTypeId == 1);
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
  setBankInfo(){
    this.bankAccountComponent.value = this.initModel.BankAccountList[0];
  }
  onInitalizeBankAccount(component: BankAccountComponent) {
		this.bankAccountComponent = component;
	}
  get WithTravelAuthorizationDetailsItem(): FormArray {
		return this.withAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
	}
  get WithoutTravelAuthorizationDetailsItem(): FormArray {
		return this.withoutAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
	}
  travelAuthTypeChange(){
    if(this.TravelAuthorizationTypeFc.value == TravelAuthorizationType.WithAdvance){
      let row = this.createWithAdvanceItemsFormGroup();
      row.controls['LocationFromDistrictId'].setValue(this.initModel.OfficeLocationDistrictId);
      this.WithTravelAuthorizationDetailsItem.push(row);
    }
    else{
      let row = this.createWithoutAdvanceItemsFormGroup();
      this.WithoutTravelAuthorizationDetailsItem.push(row);
    }
  }
  onChangeTaskType(event:any, index: number){
    if(this.TravelAuthorizationTypeFc.value == TravelAuthorizationType.WithAdvance){
      this.withAdvanceItemsFormControl.value[index].TaskTypeDetailsList = [];
      this.withAdvanceItemsFormControl.value[index].TaskTypeDetailsList = this.GenerateTaskTypeDetails(event.Id);
    }
    else{
      this.withoutAdvanceItemsFormControl.value[index].TaskTypeDetailsList = [];
      this.withoutAdvanceItemsFormControl.value[index].TaskTypeDetailsList = this.GenerateTaskTypeDetails(event.Id);
    }
  }
  GenerateTaskTypeDetails(id: number){
    var itemList : NameIdPair[] = [];
    this.initModel?.TaskTypeDetailsList.filter(x=> x.TaskTypeId == id).forEach(x => {
      itemList.push({
        Id: x.Id,
        Name : x.Name
      });
    });
    return itemList;
  }
  onChangeWorkingDistrict(event:any, index: number){
    if(this.aModel?.Id > 0)
    {
      this.perDayAllowance = this.aModel?.TADAList[0];
    }
    else{
      this.perDayAllowance = this.initModel.TADAList.find(x => x.DesignationId === this.portalUserViewModel.DesignationId);
    }
    var workingDistrict = this.initModel.DistrictList.find(x => x.Id === event.Id);
    var allowanceAmount = 0;
    if(this.initModel.OfficeLocationDistrictId == event.Id && this.portalUserViewModel.HrId != 'EZSTL194')
    {
      allowanceAmount = workingDistrict.IsMajor ? this.perDayAllowance?.TotalFoodMajor : this.perDayAllowance?.TotalFoodMinor;
    }else{
      allowanceAmount = workingDistrict.IsMajor ? this.perDayAllowance?.TotalAllownaceMajor : this.perDayAllowance?.TotalAllownaceMinor;
    }
    this.lastLocationFromId = event.Id;
    if(this.TravelAuthorizationTypeFc.value == TravelAuthorizationType.WithAdvance){
      const control =  this.withAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
      control.controls[index].get('WorkingDistrictType')?.setValue(workingDistrict.IsMajor ? 'Major City' : 'Minor City');
      control.controls[index].get('LocationToDistrictId')?.setValue(event.Id);
      control.controls[index].get('AllowancecPerDay')?.setValue(allowanceAmount);
      this.calculateTotalAmount(index);
    }
    else{
      const control =  this.withoutAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
      control.controls[index].get('WorkingDistrictType')?.setValue(workingDistrict.IsMajor ? 'Major City' : 'Minor City');
    }
  };
  onChangeStartDate(event: any, index: number){
    if(this.TravelAuthorizationTypeFc.value == TravelAuthorizationType.WithAdvance){
      const control =  this.withAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
      var startDate = new Date(this.formatDate(control.controls[index].get('StartDate')?.value));
      var endDate = new Date(this.formatDate(control.controls[index].get('EndDate')?.value));
      var dayDiff = Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) ) /(1000 * 60 * 60 * 24));
      if(dayDiff < 0)
      {
        this.toaster.info('Start date must be less or equal to start date','info');
        control.controls[index].get('StartDate')?.setValue('');
        control.controls[index].get('NoOfDays')?.setValue(0);
        control.controls[index].get('TotalDailyAllowance')?.setValue(0);
      }
      else if(dayDiff >= 0){
        var totalDay = dayDiff + 1;
        control.controls[index].get('NoOfDays')?.setValue(totalDay);
        this.calculateTotalAmount(index);
      }
    }
    else{
      const control =  this.withoutAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
      var startDate = new Date(this.formatDate(control.controls[index].get('StartDate')?.value));
      var endDate = new Date(this.formatDate(control.controls[index].get('EndDate')?.value));
      var dayDiff = Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) ) /(1000 * 60 * 60 * 24));
      if(dayDiff < 0)
      {
        this.toaster.info('Start date must be less or equal to start date','info');
        control.controls[index].get('StartDate')?.setValue('');
      }
    }
  }
  onChangeEndDate(event: any, index: number){
    if(this.TravelAuthorizationTypeFc.value == TravelAuthorizationType.WithAdvance){
      const control =  this.withAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
      var startDate = new Date(this.formatDate(control.controls[index].get('StartDate')?.value));
      var endDate = new Date(this.formatDate(control.controls[index].get('EndDate')?.value));
      var dayDiff = Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) ) /(1000 * 60 * 60 * 24));
      if(dayDiff < 0)
      {
        this.toaster.info('End date must be greater or equal to start date','info');
        control.controls[index].get('EndDate')?.setValue('');
        control.controls[index].get('NoOfDays')?.setValue(0);
        control.controls[index].get('TotalDailyAllowance')?.setValue(0);
      }
      else if(dayDiff >= 0){
        var totalDay = dayDiff + 1;
        control.controls[index].get('NoOfDays')?.setValue(totalDay);
        this.calculateTotalAmount(index);
      }
    }
    else{
      const control =  this.withoutAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
      var startDate = new Date(this.formatDate(control.controls[index].get('StartDate')?.value));
      var endDate = new Date(this.formatDate(control.controls[index].get('EndDate')?.value));
      var dayDiff = Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) ) /(1000 * 60 * 60 * 24));
      if(dayDiff < 0)
      {
        this.toaster.info('End date must be greater or equal to start date','info');
        control.controls[index].get('EndDate')?.setValue('');
      }
    }
  }
  calculateTotalAmount(index: number){
    const control =  this.withAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
    var totalDay = control.controls[index].get('NoOfDays')?.value;
    var perDayAllowance = control.controls[index].get('AllowancecPerDay')?.value;
    var totalDailyAllowance = perDayAllowance * totalDay;
    var travelAllowance = control.controls[index].get('TravelAllowance')?.value;
    var entAllowance = control.controls[index].get('EntertainmentAllowance')?.value;
    var miscAllowance = control.controls[index].get('MiscellaneousAllowance')?.value;
    var totalAllowance = Number(totalDailyAllowance) + Number(travelAllowance) + Number(entAllowance) + Number(miscAllowance);
    control.controls[index].get('TotalDailyAllowance')?.setValue(totalDailyAllowance);
    control.controls[index].get('Total')?.setValue(totalAllowance);
    var advItems = this.WithTravelAuthorizationDetailsItem.value;
    this.totalAllowance = advItems.reduce((sum, item) => sum + item.Total, 0).toLocaleString();
  }
  addAdvItems(){
    var lastItemIndex = this.WithTravelAuthorizationDetailsItem.value.length - 1;
    if(lastItemIndex == -1)
    {
      let row = this.createWithAdvanceItemsFormGroup();
      row.controls['LocationFromDistrictId'].setValue(this.initModel.OfficeLocationDistrictId);
      this.WithTravelAuthorizationDetailsItem.push(row);
    }
    else{
      var lastItem = this.WithTravelAuthorizationDetailsItem.value[lastItemIndex];
  
      if(this.WithTravelAuthorizationDetailsItem.invalid && lastItem.IsActive)
      {
        this.toaster.error('Please fill required field','error');
        return;
      }
      if(lastItem.Remarks == '' && (Number(lastItem.TravelAllowance) > 0 || Number(lastItem.EntertainmentAllowance) > 0 || Number(lastItem.MiscellaneousAllowance) > 0))
      {
        this.toaster.error('Remarks Mandatory for other allowance','error');
        return;
      }
      var dateOverlapped = 0;
      this.WithTravelAuthorizationDetailsItem.value.forEach(x => {
        if(this.dateCheck(x.StartDate,x.EndDate,lastItem.StartDate) || this.dateCheck(x.StartDate,x.EndDate,lastItem.EndDate))
        dateOverlapped ++ ;
      });
      if(dateOverlapped > 1)
      {
        {
          this.toaster.error('Duplicate Entry','error');
          return;
        }
      }
      let row = this.createWithAdvanceItemsFormGroup();
      row.controls['LocationFromDistrictId'].setValue(this.lastLocationFromId);
      this.WithTravelAuthorizationDetailsItem.push(row);
    }
  }
  dateCheck(from,to,check) {
    var fDate,lDate,cDate;
    fDate = Date.parse(this.formatDate(from));
    lDate = Date.parse(this.formatDate(to));
    cDate = Date.parse(this.formatDate(check));
    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
}
  deleteAdvItems(idx: number){
    const control =  this.withAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
    if(control.controls[idx].get('Id')?.value == null)
    {
      this.WithTravelAuthorizationDetailsItem.removeAt(idx);
      var advItems = this.WithTravelAuthorizationDetailsItem.value;
      this.totalAllowance = advItems.reduce((sum, item) => sum + item.Total, 0).toLocaleString();
    }
    else{
      control.controls[idx].get('IsActive')?.setValue(false);
      var advItems = this.WithTravelAuthorizationDetailsItem.value.filter(x=> x.IsActive);
      this.totalAllowance = advItems.reduce((sum, item) => sum + item.Total, 0).toLocaleString();
    }
  }
  addItems(){

    var lastItemIndex = this.WithoutTravelAuthorizationDetailsItem.value.length - 1;

    if(lastItemIndex == -1)
    {
      let row = this.createWithoutAdvanceItemsFormGroup();
      this.WithoutTravelAuthorizationDetailsItem.push(row);
    }
    else{
      var lastItem = this.WithoutTravelAuthorizationDetailsItem.value[lastItemIndex];

      if(this.WithoutTravelAuthorizationDetailsItem.invalid && lastItem.IsActive)
      {
        this.toaster.error('Please fill required field','error');
        return;
      }
      var dateOverlapped = 0;
      this.WithoutTravelAuthorizationDetailsItem.value.forEach(x => {
        if(this.dateCheck(x.StartDate,x.EndDate,lastItem.StartDate) || this.dateCheck(x.StartDate,x.EndDate,lastItem.EndDate))
        dateOverlapped ++ ;
      });
      if(dateOverlapped > 1)
      {
        {
          this.toaster.error('Duplicate Entry','error');
          return;
        }
      }
      let row = this.createWithoutAdvanceItemsFormGroup();
      this.WithoutTravelAuthorizationDetailsItem.push(row);
    }
  }
  deleteItems(idx: number){
    const control =  this.withoutAdvanceForm.get('TravelAuthorizationDetailsItem') as FormArray;
    if(control.controls[idx].get('Id')?.value == null)
    {
      this.WithoutTravelAuthorizationDetailsItem.removeAt(idx);
    }
    else{
      control.controls[idx].get('IsActive')?.setValue(false);
    }
  }
  onSubmit() {
    if(this.travelAuthTypeForm.invalid && this.aModel?.Id == undefined)
    {
      this.toaster.error('Please fill required field','error');
      return;
    }
    if(this.aModel?.Id == undefined && this.TravelAuthorizationTypeFc.value == TravelAuthorizationType.WithAdvance && this.withAdvanceForm.invalid)
    {
      this.toaster.error('Please fill required field','error');
      return;
    }
    if(this.aModel?.Id == undefined && this.TravelAuthorizationTypeFc.value == TravelAuthorizationType.WithoutAdvance && this.withoutAdvanceForm.invalid)
    {
      this.toaster.error('Please fill required field','error');
      return;
    }
    this.isValidationFailed = false;
    var items = this.TravelAuthorizationTypeFc.value == TravelAuthorizationType.WithAdvance ? this.WithTravelAuthorizationDetailsItem.value : this.WithoutTravelAuthorizationDetailsItem.value;
    items.forEach(element => {
      if((element.Remarks == undefined || element.Remarks == '') && (Number(element.TravelAllowance) > 0 || Number(element.EntertainmentAllowance) > 0 || Number(element.MiscellaneousAllowance) > 0))
      {
        this.toaster.error('Remarks Mandatory for other allowance','error');
        this.isValidationFailed = true;
        return;
      }
      let rio = this.initModel?.DistrictList.filter(x=> x.Id == element.WorkingDistrictId)[0];
      if(rio.RIOId != this.rioId)
      this.isRioChanged = true;
      if(new Date(this.formatDate(element.EndDate)) > new Date(this.tentativeSettlementMaxDate))
      this.tentativeSettlementMaxDate = element.EndDate;
    });
    if(this.isValidationFailed)
    return;
    this.loading = true;
    let inv = this.packageForm();
    inv.IsRioChanged = this.initModel?.IsRioApplicable ? this.isRioChanged : false;
    this.subSink.sink = this.travelAuthService.save(inv).subscribe((x) => {
      if (x.Success) {
        this.loading = false;
        this.toaster.success('saved successfully');
        this.router.navigate(['/travelauthorisation/list']);
      } else {
        this.loading = false;
        this.toaster.error(x.Message);
      }
    })
  }
  packageForm(): TravelAuthorization {
    let bankAccountModel = this.bankAccountComponent.value;
    var isWithAdvance = this.TravelAuthorizationTypeFc.value == TravelAuthorizationType.WithAdvance;
    let data = new TravelAuthorization();
    if(isWithAdvance)
    {
      data = new TravelAuthorization({
          Id: this.aModel?.Id > 0 ? this.aModel.Id : 0,
          UserId: this.aModel?.Id > 0 ? this.aModel.UserId : this.portalUserViewModel.Id,
          TravelAuthorizationTypeId: this.TravelAuthorizationTypeFc.value,
          SupervisorId: this.supervisorFC.value,
          SupervisorName: this.supervisorNameFC.value,
          TravelAuthorizationDate: this.formatDate(this.withAdvanceForm.value.TravelAuthorizationDate),
          AdvanceRequisitionDate: this.formatDate(this.withAdvanceForm.value.AdvanceRequisitionDate),
          TentativeSettlementDate: this.formatDate(this.withAdvanceForm.value.TentativeSettlementDate),
          Justification: this.withAdvJustificationFC.value,
          TravelAuthorizationDetailsItem: this.GenerateDetailsItem(this.WithTravelAuthorizationDetailsItem.value),
          TotalAmount: this.totalAllowance,
          AccountHolderName: bankAccountModel.AccountHolderName,
          AccountHolderCompany: bankAccountModel.AccountHolderCompany,
          BankName: bankAccountModel.BankName,
          AccountNo: bankAccountModel.AccountNo,
          AccountType: bankAccountModel.AccountType,
          RouterNo: bankAccountModel.RouterNo,
          Condition: bankAccountModel.Condition,
          MobileNo: bankAccountModel.MobileNo,
        });
    }
    else{
      data = new TravelAuthorization({
          Id: this.aModel?.Id > 0 ? this.aModel.Id : 0,
          UserId: this.aModel?.Id > 0 ? this.aModel.UserId : this.portalUserViewModel.Id,
          TravelAuthorizationTypeId: this.TravelAuthorizationTypeFc.value,
          SupervisorId: this.supervisorFC.value,
          TravelAuthorizationDate: this.formatDate(this.withoutAdvanceForm.value.TravelAuthorizationDate),
          Justification: this.withoutAdvJustificationFC.value,
          AccountHolderName: bankAccountModel.AccountHolderName,
          AccountHolderCompany: bankAccountModel.AccountHolderCompany,
          BankName: bankAccountModel.BankName,
          AccountNo: bankAccountModel.AccountNo,
          AccountType: bankAccountModel.AccountType,
          RouterNo: bankAccountModel.RouterNo,
          Condition: bankAccountModel.Condition,
          MobileNo: bankAccountModel.MobileNo,
          TravelAuthorizationDetailsItem: this.GenerateDetailsItem(this.WithoutTravelAuthorizationDetailsItem.value),
        });
    }
    if(this.aModel?.Is_Approver)
    {
      data.ApproverRemarks = this.approverRemarksFC.value;
      if(this.isFinanceCheck || this.isFinanceComplete)
      {
        data.VoucherNo = this.voucherNoFC.value;
      }
    }
    return data;
  }
  GenerateDetailsItem(detailsItem: any){
    var itemList : TravelAuthorizationDetailsItem[] = [];
    detailsItem.forEach(x => {
      itemList.push({
        Id: x.Id,
        LocationFromDistrictId: x.LocationFromDistrictId,
        LocationToDistrictId: x.LocationToDistrictId,
        WorkingDistrictId: x.WorkingDistrictId,
        WorkingDistrictType: x.WorkingDistrictType,
        TaskTypeId: x.TaskTypeId,
        TaskTypeDetailsId: x.TaskTypeDetailsId,
        StartDate: this.formatDate(x.StartDate),
        EndDate: this.formatDate(x.EndDate),
        Remarks: x.Remarks,
        NoOfDays: x.NoOfDays,
        AllowancecPerDay: x.AllowancecPerDay,
        TotalDailyAllowance: x.TotalDailyAllowance,
        TravelAllowance: x.TravelAllowance,
        EntertainmentAllowance: x.EntertainmentAllowance,
        MiscellaneousAllowance: x.MiscellaneousAllowance,
        Total: x.Total,
        IsActive: x.IsActive
      });
    });
    return itemList;
  }
  _fetchData = (id: string) => {
    this.loading = true;
    this.subSink.sink = this.travelAuthService.getById(id).subscribe(
      (res) => {
        if (res.Success) {
          this.aModel = res.Data;
          this.loadData(this.aModel);
          this.loading = false;
          this.isCheckerSet = true;
          if(this.aModel.ProfilePicUrl){
            this.profilePicAsByteArrayAsBase64 = "data:image/png;base64," + this.aModel.ProfilePicUrl;
          }
          else{
            this.profilePicAsByteArrayAsBase64 = "assets/images/users/avatar-1.jpg";
          }
        }
        else {
          this.toaster.error(res['Message'], "Error");
          this.router.navigate(['/travelauthorisation/list']);
          this.loading = false;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
        this.loading = false;
      }
    );
  }
  loadData(aModel: TravelAuthorizationViewModel) {
    this.bankAccountComponent.value = aModel;
    this.travelAuthTypeForm.patchValue({
      Id: aModel.Id,
      PublicId: aModel.PublicId,
      StatusId: aModel.StatusId,
      UserId: aModel.UserId,
      TravelAuthorizationTypeId: aModel.TravelAuthorizationTypeId,
      TravelAuthorizationTypeName: aModel.TravelAuthorizationTypeName,
      SupervisorId: aModel.SupervisorId,
      SupervisorName: aModel.SupervisorName
    });
    if(aModel.TravelAuthorizationTypeId == TravelAuthorizationType.WithAdvance)
    {
      this.withAdvanceForm.patchValue({
        TravelAuthorizationDate: this.stringToNgbDate(aModel.TravelAuthorizationDate),
        AdvanceRequisitionDate: this.stringToNgbDate(aModel.AdvanceRequisitionDate),
        TentativeSettlementDate: this.stringToNgbDate(aModel.TentativeSettlementDate),
        Justification: aModel.Justification
      });
      aModel.TravelAuthorizationDetailsItemViewModel.forEach(x=>{
        (this.withAdvanceForm.get("TravelAuthorizationDetailsItem") as FormArray).push(this.patchWithAdvanceValue(x))
      });
      var advItems = this.WithTravelAuthorizationDetailsItem.value;
      this.totalAllowance = advItems.reduce((sum, item) => sum + item.Total, 0).toLocaleString();
    }
    else if(aModel.TravelAuthorizationTypeId == TravelAuthorizationType.WithoutAdvance)
    {
      this.withoutAdvanceForm.patchValue({
        TravelAuthorizationDate: this.stringToNgbDate(aModel.TravelAuthorizationDate),
        Justification: aModel.Justification
      });
      aModel.TravelAuthorizationDetailsItemViewModel.forEach(x=>{
        (this.withoutAdvanceForm.get("TravelAuthorizationDetailsItem") as FormArray).push(this.patchWithoutAdvanceValue(x))
      });
    }
    if(!aModel?.CanEdit)
    {
      this.travelAuthTypeForm.disable();
      this.withAdvanceForm.disable();
      this.withoutAdvanceForm.disable();
    }
    this.canAddItem = aModel.CanEdit && aModel.UserId == this.portalUserViewModel.Id;
    if(this.isFinanceCheck)
    {
      var dt = new Date();
      var year  = dt.getFullYear().toString().substring(2);
      var month = (dt.getMonth() + 1).toString().padStart(2, "0");
      var day   = dt.getDate().toString().padStart(2, "0");
      this.finVoucherNo = 'JV_'+year+''+month+''+day+'/';
      this.voucherNoFC.setValue(this.finVoucherNo);
    }
    if(this.aModel?.VoucherNo != null)
      {
        this.voucherNoFC.setValue(this.aModel?.VoucherNo);
      }
    this.isRioChanged = this.aModel?.IsRioChanged;
    if(this.aModel?.Is_Supervisor_Pending){
      this.recommenderFC.setValue(this.aModel?.RecommenderUsers[0].Id);
    }

    this.requesterUserId = aModel.RequesterUserId;
  }
  patchWithAdvanceValue(item: any) {
		return this.fb.group({
			Id: item.Id,
      TravelAuthRefId: item.TravelAuthRefId,
      WorkingDistrictId: item.WorkingDistrictId,
      WorkingDistrictType:item.WorkingDistrictType,
      LocationFromDistrictId: item.LocationFromDistrictId,
      LocationToDistrictId: item.LocationToDistrictId,
      TaskTypeId: item.TaskTypeId,
      TaskTypeDetailsId: item.TaskTypeDetailsId,
      StartDate: this.stringToNgbDate(item.StartDate),
      EndDate: this.stringToNgbDate(item.EndDate),
      Remarks: item.Remarks,
      NoOfDays: item.NoOfDays,
      AllowancecPerDay: item.AllowancecPerDay,
      TotalDailyAllowance:item.TotalDailyAllowance,
      TravelAllowance:item.TravelAllowance,
      EntertainmentAllowance:item.EntertainmentAllowance,
      MiscellaneousAllowance:item.MiscellaneousAllowance,
      Total: item.Total,
      IsActive: item.IsActive
		});
	}
  patchWithoutAdvanceValue(item: any) {
		return this.fb.group({
			Id: item.Id,
      TravelAuthRefId: item.TravelAuthRefId,
			WorkingDistrictId: item.WorkingDistrictId,
      WorkingDistrictType:item.WorkingDistrictType,
      TaskTypeId: item.TaskTypeId,
      TaskTypeDetailsId: item.TaskTypeDetailsId,
      StartDate: this.stringToNgbDate(item.StartDate),
      EndDate: this.stringToNgbDate(item.EndDate),
      Remarks: item.Remarks,
      IsActive: item.IsActive
		});
	}
  onVerifyAndSubmit() {
    if(this.aModel?.Is_Supervisor_Pending && this.recommenderFormGroup.invalid)
    {
      this.toaster.error('Please add a Recommender','error');
      return;
    }
    if((!this.voucherNoFC.value || this.voucherNoFC.value == this.finVoucherNo) && this.isFinanceCheck){
      this.toaster.error('Please Provide a Voucher No');
      return;
    }
    this.loading = true;
    let inv = this.packageForm();
    inv.IsApproverApproved = true;
    inv.RequesterUserId= this.requesterUserId;
    
    if(this.aModel?.Is_Supervisor_Pending)
    inv.RecommenderId = this.recommenderFormGroup.value.RecommenderId;
    this.subSink.sink = this.travelAuthService.save(inv).subscribe((x) => {
      if (x.Success) {
        this.loading = false;
        this.toaster.success('approved successfully');
        this.router.navigate(['/travelauthorisation/supervisorlist']);
      } else {
        this.loading = false;
        this.toaster.error(x.Message);
      }
    })
  }
  onReturn() {
    this.loading = true;
    let inv = this.packageForm();
    inv.IsApproverDeclined = true;
    this.subSink.sink = this.travelAuthService.save(inv).subscribe((x) => {
      if (x.Success) {
        this.loading = false;
        this.toaster.success('return successfully');
        this.router.navigate(['/travelauthorisation/supervisorlist']);
      } else {
        this.loading = false;
        this.toaster.error(x.Message);
      }
    })
  }
}
