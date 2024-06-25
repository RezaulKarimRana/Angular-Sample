import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base/base.service';
import { FileLikeObject, FileUploader } from 'ng2-file-upload';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { FileTypeSize } from 'src/app/core/enums/constants';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { TAdAModel } from 'src/app/core/models/mastersetup-model/TAdAModel.model';
import { NameIdPair } from 'src/app/core/models/mastersetup-model/codenamepair.model';
import { TravelAuthorizationViewModel } from 'src/app/core/models/travel-authorisation-model/travelAuthorisation.model';
import { TASettlementFileViewModel, TASettlementListModel, TASettlement, TASettlementDetailsItem, TASettlementAttachment } from 'src/app/core/models/travel-authorisation-model/travelAuthorisationSettlement.model';
import { TravelAuthorizationService } from 'src/app/core/services/TravelAuthorization/travelAuth.service';
import { TASettlementService } from 'src/app/core/services/TravelAuthorization/travelAuthSettlement.service';
import { BankAccountComponent } from 'src/app/shared/ui/bank-account/bank-account.component';
import { SubSink } from 'subsink/dist/subsink';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TravelAllowanceCalculationComponent } from '../travel-allowance-calculation/travel-allowance-calculation.component';
import { FoodAllowanceCalculationComponent } from '../food-allowance-calculation/food-allowance-calculation.component';
import { ChildFileViewModel } from 'src/app/core/models/settlement-model/settlement.model';

@Component({
  selector: 'app-create-settlement',
  templateUrl: './create-settlement.component.html'
})
export class CreateSettlementComponent extends BaseComponent implements OnInit, OnDestroy {

  taId:number;
  isCollapsed: boolean = false;
  todaysDate: object = new Date();
  subSink: SubSink;
  pageTitle: string;
  SettlementFiles: Array<TASettlementFileViewModel> = new Array<TASettlementFileViewModel>();
  SettlementUploadedFiles: Array<TASettlementFileViewModel> = new Array<TASettlementFileViewModel>();
  fileList: File[] = new Array<File>();
  SettlementFile= new TASettlementFileViewModel();
  lastLocationFromId: number;
  loading: boolean = false;
  portalUserViewModel: PortalUserViewModel;
  formGroup: FormGroup;
  isFileSizeExceed: boolean;
  totalFileSize: number = 0;
  basicForm: FormGroup;
  recommenderFormGroup: FormGroup;
  bankFormGroup: FormGroup;
  initModel: TASettlementListModel;
  TravelAuthorizationTypeId: number;
  aModel: TravelAuthorizationViewModel;
  perDayAllowance: TAdAModel;
  tentativeSettlementMaxDate: Date = new Date();
  tentativeSettlementMinDate: Date = new Date();
  isValidationFailed: boolean = false;
  totalAllowance: number = 0;
  totalSettlement: number = 0;
  totalDue: number = 0;
  totalRefund: number = 0;
  totalAllowanceStr: string;
  totalSettlementStr: string;
  totalDueStr: string;
  totalRefundStr: string;
  innerWidth: any;
  isDue: boolean = false;
  isRefund: boolean = false;
  requesterUserId: number;
  isChildFileSizeExceed: boolean;
  attachment = new TASettlementAttachment();
  ChildFiles: Array<ChildFileViewModel> = new Array<ChildFileViewModel>();
  ChildFile = new ChildFileViewModel();
  isFileSelected: boolean = false;
  uploadFileId: number = 0;
  @ViewChild('bankAccountComponent', { static: true })
	bankAccountComponent: BankAccountComponent;

  public uploader: FileUploader = new FileUploader({
		maxFileSize: FileTypeSize.fileSize,
		allowedMimeType: FileTypeSize.fileTypes
	});
  
  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private modalService: NgbModal,
    private taService: TravelAuthorizationService,
    private taSettlementService: TASettlementService,
    private fb: FormBuilder
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    this.pageTitle = 'Create Settlement';
    this._fetchData(cn.extras.state.id);
    this.taId = cn.extras.state.id;
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    var date = new Date();
    var obj = { year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate() };
    this.todaysDate = obj;

    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    this.basicForm = this.fb.group({
      TAId:[this.taId],
      TARefNo:[''],
      SupervisorId: [null],
      SupervisorName:[''],
      UserId: [null],
      Justification: ['',Validators.required],
      TotalAmount: [''],
      FileUploader: [''],
      DepositedRefund: [''],
      DepositedDue: [''],
      Balance: [''],
      Items: this.fb.array([])
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
    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
  }
  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
    this.isFileSizeExceed = true;
    switch (filter.name) {
      case 'fileSize':
        this.toaster.warning(`Maximum upload size exceeded 10 MB`, 'File Size');
        break;
      case 'mimeType':
        this.toaster.warning(`File format is not supported`, 'File Type');
        break;
      default:
        this.toaster.warning(`Failed to load file`);
    }
    this.uploader.clearQueue();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth + 'Resize');
  }
  get userBankDetailsFormControl() {
		return this.bankFormGroup ? this.bankFormGroup.get('UserBankDetails') : null;
	}
  get itemsFC() {
		return this.basicForm ? this.basicForm.get('Items') : null;
	}
  get depositedRefundFormControl() {
    return this.basicForm ? this.basicForm.get('DepositedRefund') : null;
  }
  get depositedDueFormControl() {
    return this.basicForm ? this.basicForm.get('DepositedDue') : null;
  }
  get balanceFormControl() {
    return this.basicForm ? this.basicForm.get('Balance') : null;
  }
  get fileUploaderFormControl() {
    return this.basicForm ? this.basicForm.get('FileUploader') : null;
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  public onFileSelected(files: any) {
    var isSameFile = false;
    if(this.isFileSizeExceed)
    {
      this.isFileSizeExceed = !this.isFileSizeExceed;
      return;
    }
    else{
      for (var i = 0; i < files.length; i++) {
        var totalSize = this.totalFileSize + files.item(i).size;
        if( totalSize > FileTypeSize.fileSize)
        {
          this.toaster.info('Total file size is more than 10 MB');
          return;
        }
        else{
          this.SettlementFile = new TASettlementFileViewModel();
          this.SettlementFile.File = files.item(i);
          this.SettlementFile.IsNew = true;
          this.SettlementFile.FileName = files.item(i).name;
          this.SettlementFile.FileSize = files.item(i).size;
          this.SettlementFiles.forEach(x=>{
            if(x.FileName == this.SettlementFile.FileName){
              isSameFile = true;
            }
          });
          if(!isSameFile){
            this.SettlementFiles.push(this.SettlementFile);
            this.totalFileSize = this.totalFileSize + files.item(i).size;
          }
        }
      }
    }
	}
  public onChildFileSelected(files: any, index: number) {
    if (!this.isChildFileSizeExceed) {
      this.attachment = new TASettlementAttachment();
      this.ChildFile = new ChildFileViewModel();
      this.attachment.FileName = files[0].name;
      this.ChildFile.File = files.item(0);
      this.ChildFile.IsNew = true;
      this.ChildFile.FileName = files.item(0).name;
      this.ChildFile.FileSize = files.item(0).size;
      this.ChildFiles.push(this.ChildFile);
      this.isFileSelected = true;
      this.uploadFileId = this.uploadFileId + 1;
      this.ChildFile.UploadFileIdWithFileName = files.item(0).name + ',#&,' + this.uploadFileId;
      const currentDate = new Date();
      const control =  this.basicForm.get('Items') as FormArray;
      control.controls[index].get('FileId')?.setValue(this.uploadFileId);
      control.controls[index].get('FileName')?.setValue(files[0].name);
      control.controls[index].get('FileType')?.setValue(files[0].type);
      control.controls[index].get('FilePath')?.setValue(currentDate.getMilliseconds()+'_'+files[0].name);
    }
    this.isChildFileSizeExceed = false;
  }
  get supervisorFC() {
    return this.basicForm ? this.basicForm.get('SupervisorId') : null;
  }
  get supervisorNameFC() {
    return this.basicForm ? this.basicForm.get('SupervisorName') : null;
  }
  setBankInfo(){
    this.bankAccountComponent.value = this.initModel.BankAccountList[0];
  }
  onInitalizeBankAccount(component: BankAccountComponent) {
		this.bankAccountComponent = component;
	}
  get taItems(): FormArray {
		return this.basicForm.get('Items') as FormArray;
	}
  onChangeTaskType(event:any, index: number){
    this.itemsFC.value[index].TaskTypeDetailsList = [];
      this.itemsFC.value[index].TaskTypeDetailsList = this.GenerateTaskTypeDetails(event.Id);
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
    this.perDayAllowance = this.initModel.TADAList.find(x => x.DesignationId === this.portalUserViewModel.DesignationId);
    var workingDistrict = this.initModel.DistrictList.find(x => x.Id === event.Id);
    var allowanceAmount = workingDistrict.IsMajor ? this.perDayAllowance?.TotalAllownaceMajor : this.perDayAllowance?.TotalAllownaceMinor;
    this.lastLocationFromId = event.Id;
    const control =  this.basicForm.get('Items') as FormArray;
    control.controls[index].get('WorkingDistrictType')?.setValue(workingDistrict.IsMajor ? 'Major City' : 'Minor City');
    control.controls[index].get('LocationToDistrictId')?.setValue(event.Id);
    control.controls[index].get('AllowancecPerDay')?.setValue(allowanceAmount);
    control.controls[index].get('TotalCost')?.setValue(0);
  };
  onChangeDate(index: number){
      const control =  this.basicForm.get('Items') as FormArray;
      control.controls[index].get('TotalCost')?.setValue(0);
  }
  dateCheck(from,to,check) {
    var fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);
    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
  }
  deleteItems(idx: number){
    const control =  this.basicForm.get('Items') as FormArray;
    if(control.controls[idx].get('Id')?.value == null)
    {
      this.taItems.removeAt(idx);
    }
    else{
      control.controls[idx].get('IsActive')?.setValue(false);
    }
    var totalCost = 0;
    var items = this.taItems.value;
    items.forEach(element => {
      if(element.IsActive == true)
      {
        totalCost += Number(element.TotalCost);
      }
    });
    this.totalSettlement = totalCost;
    this.totalSettlementStr = this.totalSettlement.toLocaleString();
    if(Number(this.totalAllowance) < Number(this.totalSettlement))
    {
      this.isDue = true;
      this.isRefund = false;
      this.totalDue = (Number(this.totalSettlement) - Number(this.totalAllowance));
      this.totalDueStr = this.totalDue.toLocaleString();
      this.totalRefund = 0;
    }
    else{
      this.isDue = false;
      this.isRefund = true;
      this.totalDue = 0;
      this.totalRefund = (Number(this.totalAllowance) - Number(this.totalSettlement));
      this.totalRefundStr = this.totalRefund.toLocaleString();
    }
  }
  onSubmit() {
    var items = this.taItems.value;
    var isvalid = true;
    var isCalculated = true;
    items.forEach(element => {
      if((element.WorkingDistrictId <= 0 || element.LocationFromDistrictId <= 0 || element.LocationToDistrictId <= 0 || element.TaskTypeId <= 0 || element.TaskTypeDetailsId <= 0 || element.StartDate == null || element.EndDate == null) && element.IsActive)
      {
        isvalid = false;
        return;
      }
    });
    if(this.balanceFormControl.value != 0 && this.isRefund){
      this.toaster.error('Balance Should be zero','error');
      return;
    }
    if(!isvalid){
      this.toaster.error('Please fill required field','error');
      return;
    }
    items.forEach(element => {
      if((element.TotalCost == 0 || element.TotalCost == undefined) && element.IsActive)
      {
        isCalculated = false;
        return;
      }
    });
    if(!isCalculated){
      this.toaster.error('Please Complete Calculation','error');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to submit, Please Upload necessary document(Refund,Bus Ticket,Local Conveyance Sheet, Purchase Voucher etc..)',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        let inv = this.packageForm();
        this.subSink.sink = this.taSettlementService.create(inv).subscribe((x) => {
          if (x.Success) {
            this.loading = false;
            this.toaster.success('saved successfully');
            this.router.navigate(['/taSettlement/list']);
          } else {
            this.loading = false;
            this.toaster.error(x.Message);
          }
        })
      }
    });
  }
  packageForm(): FormData {
    let bankAccountModel = this.bankAccountComponent.value;
    let data = new TASettlement();
    this.SettlementFiles.forEach(x => {
			if(x.IsNew)
			this.fileList.push(x.File);
		});
    data = new TASettlement({
      Id: 0,
      TAId: this.aModel.Id,
      TARefNo: this.aModel.RequestNo,
      UserId: this.portalUserViewModel.Id,
      SupervisorId: this.supervisorFC.value,
      SupervisorName: this.supervisorNameFC.value,
      TotalAmount: this.totalAllowance,
      TotalCost: this.totalSettlement,
      TotalDue: this.totalDue,
      TotalRefund: this.totalRefund,
      AccountHolderName: bankAccountModel.AccountHolderName,
      AccountHolderCompany: bankAccountModel.AccountHolderCompany,
      BankName: bankAccountModel.BankName,
      AccountNo: bankAccountModel.AccountNo,
      AccountType: bankAccountModel.AccountType,
      RouterNo: bankAccountModel.RouterNo,
      Condition: bankAccountModel.Condition,
      MobileNo: bankAccountModel.MobileNo,
      DepositedRefund: this.depositedRefundFormControl.value,
      DepositedDue: this.depositedDueFormControl.value,
      Balance: this.balanceFormControl.value,
      Items: this.GeneratetaItems(this.taItems.value),
      UploadedFiles: this.SettlementUploadedFiles,
      Files: this.fileList
    });
    return this.modelToFormData(data);
  }
  modelToFormData(data: TASettlement): FormData {

    const formData = new FormData();
		let modelData = JSON.stringify(data);
		formData.set('model', modelData);
		for (let file of data.Files)
			formData.append('refundFiles', file, file.name);
    this.ChildFiles.forEach(x => {
      if (x.IsNew) {
        formData.append('files', x.File, x.UploadFileIdWithFileName);
      }
    });
		return formData;
	}
  GeneratetaItems(taItems: any){
    var itemList : TASettlementDetailsItem[] = [];
    taItems.forEach(x => {
      if(x.IsActive)
      {
        itemList.push({
          Id: x.Id,
          IsTravelAllowance: x.IsTravelAllowance,
          IsFoodAllowance: x.IsFoodAllowance,
          WorkingDistrictId: x.WorkingDistrictId,
          WorkingDistrictType: x.WorkingDistrictType,
          LocationFromDistrictId: x.LocationFromDistrictId,
          LocationToDistrictId: x.LocationToDistrictId,
          TaskTypeId: x.TaskTypeId,
          TaskTypeDetailsId: x.TaskTypeDetailsId,
          StartDate: x.StartDate,
          EndDate: x.EndDate,
          NoOfDays: x.NoOfDays,
          AllowancecPerDay: x.AllowancecPerDay,
          Total: x.Total,
          TotalCost: x.TotalCost,
          IsActive: x.IsActive,
          BreakFastAllowance: x.BreakFastAllowance,
          LunchAllowance: x.LunchAllowance,
          SnacksAllowance: x.SnacksAllowance,
          DinnerAllowance: x.DinnerAllowance,
          NightAllowance: x.NightAllowance,
          HotelAllowance: x.HotelAllowance,
          LocalTravelAllowance: x.LocalTravelAllowance,
          TotalBreakFast: x.TotalBreakFast,
          TotalLunch: x.TotalLunch,
          TotalSnacks: x.TotalSnacks,
          TotalDinner: x.TotalDinner,
          TotalNight: x.TotalNight,
          TotalHotelStay: x.TotalHotelStay,
          TotalLocalTravel: x.TotalLocalTravel,
          ActualBreakFast: x.ActualBreakFast,
          ActualLunch: x.ActualLunch,
          ActualSnacks: x.ActualSnacks,
          ActualDinner: x.ActualDinner,
          ActualNight: x.ActualNight,
          ActualHotelStay: x.ActualHotelStay,
          ActualLocalTravel: x.ActualLocalTravel,
          TotalBreakFastAmount: x.TotalBreakFastAmount,
          TotalLunchAmount: x.TotalLunchAmount,
          TotalSnacksAmount: x.TotalSnacksAmount,
          TotalDinnerAmount: x.TotalDinnerAmount,
          TotalNightAmount: x.TotalNightAmount,
          TotalHotelStayAmount: x.TotalHotelStayAmount,
          TotalLocalTravelAmount: x.TotalLocalTravelAmount,
          TotalDistance : x.TotalDistance,
          SiteCode: x.SiteCode,
          TravelCost : x.TravelCost,
          EntertainmentCost : x.EntertainmentCost,
          MiscellaneousCost : x.MiscellaneousCost,
          LocalConveyanceAmount: x.LocalConveyanceAmount,
          DeductionRemarks : x.DeductionRemarks,
          IsNightStay : x.IsNightStay,
          IsStayOnHotel : x.IsStayOnHotel,
          HasOwnAccomodation : x.HasOwnAccomodation,
          HasLocalConveyance : x.HasLocalConveyance,
          IsOfficeVehicleUsed : x.IsOfficeVehicleUsed,
          TotalOfficeVehicle : x.TotalOfficeVehicle,
          TotalLocalConveyance : x.TotalLocalConveyance,
          FileId: x.FileId,
          FileName: x.FileName,
          FileType: x.FileType,
          FilePath: x.FilePath
        });
      }
    });
    return itemList;
  }
  _fetchData = (id: string) => {
    this.loading = true;
    this.subSink.sink = this.taService.getByIdForSettlement(id).subscribe(
      (res) => {
        if (res.Success) {
          this.aModel = res.Data.TAModel;
          this.initModel = res.Data.InitModel;
          this.supervisorFC.setValue(this.initModel.SupervisorId);
          this.supervisorNameFC.setValue(this.initModel.SupervisorName);
          this.loadData(this.aModel);
          this.setBankInfo();
          this.loading = false;
        }
        else {
          this.toaster.error(res['Message'], "Error");
          this.router.navigate(['/taSettlement/list']);
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
    this.basicForm.patchValue({
      TAId: aModel.Id,
      TARefNo: aModel.RequestNo,
      SupervisorId: aModel.SupervisorId
    });
    var index = 0;
    this.totalSettlement = 0;
    aModel.TravelAuthorizationDetailsItemViewModel?.forEach(x=>{
      (this.basicForm.get("Items") as FormArray).push(this.patchItem(x,false));
      index = index + 1;
    });
    var advItems = this.taItems.value;
    var totalAdvance = advItems.reduce((sum, item) => sum + item.Total, 0);
    this.totalAllowance = Number(totalAdvance);
    this.totalSettlement = 0;
    this.totalAllowanceStr = totalAdvance.toLocaleString();
    this.totalSettlementStr = this.totalSettlement.toLocaleString();
    this.isDue = false;
    this.isRefund = false;
    this.totalDue = 0;
    this.totalRefund = 0;
    this.requesterUserId = aModel.RequesterUserId;
  }
  patchItem(item: any, isDuplicate: boolean) {

    if(item.AllowancecPerDay == null)
    {
      var workingDistrict = this.initModel.DistrictList.find(x => x.Id === item.WorkingDistrictId);
      item.AllowancecPerDay = workingDistrict.IsMajor ? this.initModel?.TADAList[0].TotalAllownaceMajor : this.initModel?.TADAList[0].TotalAllownaceMinor;
    }
		return this.fb.group({
			Id: 0,
      IsTravelAllowance: false,
      IsFoodAllowance: false,
      WorkingDistrictId: item.WorkingDistrictId,
      WorkingDistrictType:item.WorkingDistrictType,
      LocationFromDistrictId: item.LocationFromDistrictId,
      LocationToDistrictId: item.LocationToDistrictId,
      TaskTypeId: item.TaskTypeId,
      TaskTypeDetailsId: item.TaskTypeDetailsId,
      StartDate: item.StartDate,
      EndDate: item.EndDate,
      NoOfDays: item.NoOfDays,
      AllowancecPerDay: item.AllowancecPerDay,
      Total: isDuplicate ? 0 : item.Total,
      TotalCost: 0,
      IsActive: true,
      BreakFastAllowance: 0,
      LunchAllowance: 0,
      SnacksAllowance: 0,
      DinnerAllowance: 0,
      NightAllowance: 0,
      HotelAllowance: 0,
      LocalTravelAllowance: 0,
      TotalBreakFast: 0,
      TotalLunch: 0,
      TotalSnacks: 0,
      TotalDinner: 0,
      TotalNight: 0,
      TotalHotelStay: 0,
      TotalLocalTravel: 0,
      ActualBreakFast: 0,
      ActualLunch: 0,
      ActualSnacks: 0,
      ActualDinner: 0,
      ActualNight: 0,
      ActualHotelStay: 0,
      ActualLocalTravel: 0,
      TotalBreakFastAmount: 0,
      TotalLunchAmount: 0,
      TotalSnacksAmount: 0,
      TotalDinnerAmount: 0,
      TotalNightAmount: 0,
      TotalHotelStayAmount: 0,
      TotalLocalTravelAmount: 0,
      TotalDistance : 0,
      SiteCode:'',
      TravelCost : 0,
      EntertainmentCost : 0,
      MiscellaneousCost : 0,
      LocalConveyanceAmount: 0,
      DeductionRemarks : '',
      IsNightStay: false,
      IsStayOnHotel : true,
      HasOwnAccomodation: false,
      HasLocalConveyance: false,
      IsOfficeVehicleUsed : false,
      TotalOfficeVehicle : 0,
      TotalLocalConveyance : 0,
      FileId: null,
      FileName:'',
      FileType:'',
      FilePath:'',
		});
	}
  viewTA(){
    this.router.navigateByUrl(`travelauthorisation/detail`, {
      state: {
        id: this.taId,
      }
    });
  }
  removeFile(index: number, id: number) {
    this.totalFileSize = this.totalFileSize - this.SettlementFiles[index].FileSize;
    this.SettlementFiles.splice(index, 1);
	}
  public travelAllowanceCalculation(index: number) {
    const control =  this.basicForm.get('Items') as FormArray;
    var startDate = new Date(control.controls[index].get('StartDate')?.value);
    var endDate = new Date(control.controls[index].get('EndDate')?.value);
    var dayDiff = Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) ) /(1000 * 60 * 60 * 24));
    if(dayDiff < 0)
    {
      this.toaster.info('End date must be greater or equal to start date','info');
      return;
    }
    else if(dayDiff >= 0){
      var totalDay = dayDiff + 1;
      control.controls[index].get('NoOfDays')?.setValue(totalDay);
    }
    var itemObj = control.value[index];
    const modalRef = this.modalService.open(TravelAllowanceCalculationComponent, { size: 'xl', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.ItemObj = itemObj;
    modalRef.componentInstance.initModel = this.initModel;
    modalRef.componentInstance.CanEdit = true;
    modalRef.result.then((result) => {
      if (result) {
        control.controls[index].get('IsStayOnHotel')?.setValue(result.IsStayOnHotel);
        control.controls[index].get('HasOwnAccomodation')?.setValue(result.HasOwnAccomodation);
        control.controls[index].get('HasLocalConveyance')?.setValue(result.HasLocalConveyance);
        control.controls[index].get('TotalLocalConveyance')?.setValue(result.TotalLocalConveyance);
        control.controls[index].get('LocalConveyanceAmount')?.setValue(result.LocalConveyanceAmount);

        control.controls[index].get('IsOfficeVehicleUsed')?.setValue(result.IsOfficeVehicleUsed);
        control.controls[index].get('TotalOfficeVehicle')?.setValue(result.TotalOfficeVehicle);
        control.controls[index].get('TravelCost')?.setValue(result.TravelCost);
        control.controls[index].get('EntertainmentCost')?.setValue(result.EntertainmentCost);
        control.controls[index].get('MiscellaneousCost')?.setValue(result.MiscellaneousCost);

        control.controls[index].get('DeductionRemarks')?.setValue(result.DeductionRemarks);

        control.controls[index].get('BreakFastAllowance')?.setValue(result.BreakFastAllowance);
        control.controls[index].get('LunchAllowance')?.setValue(result.LunchAllowance);
        control.controls[index].get('SnacksAllowance')?.setValue(result.SnacksAllowance);
        control.controls[index].get('DinnerAllowance')?.setValue(result.DinnerAllowance);
        control.controls[index].get('HotelAllowance')?.setValue(result.HotelAllowance);
        control.controls[index].get('LocalTravelAllowance')?.setValue(result.LocalTravelAllowance);

        control.controls[index].get('ActualBreakFast')?.setValue(result.ActualBreakFast);
        control.controls[index].get('ActualLunch')?.setValue(result.ActualLunch);
        control.controls[index].get('ActualSnacks')?.setValue(result.ActualSnacks);
        control.controls[index].get('ActualDinner')?.setValue(result.ActualDinner);
        control.controls[index].get('ActualHotelStay')?.setValue(result.ActualHotelStay);
        control.controls[index].get('ActualLocalTravel')?.setValue(result.ActualLocalTravel);

        control.controls[index].get('TotalBreakFast')?.setValue(result.TotalBreakFast);
        control.controls[index].get('TotalLunch')?.setValue(result.TotalLunch);
        control.controls[index].get('TotalSnacks')?.setValue(result.TotalSnacks);
        control.controls[index].get('TotalDinner')?.setValue(result.TotalDinner);
        control.controls[index].get('TotalHotelStay')?.setValue(result.TotalHotelStay);
        control.controls[index].get('TotalLocalTravel')?.setValue(result.TotalLocalTravel);

        control.controls[index].get('TotalBreakFastAmount')?.setValue(result.TotalBreakFastAmount);
        control.controls[index].get('TotalLunchAmount')?.setValue(result.TotalLunchAmount);
        control.controls[index].get('TotalSnacksAmount')?.setValue(result.TotalSnacksAmount);
        control.controls[index].get('TotalDinnerAmount')?.setValue(result.TotalDinnerAmount);
        control.controls[index].get('TotalHotelStayAmount')?.setValue(result.TotalHotelStayAmount);
        control.controls[index].get('TotalLocalTravelAmount')?.setValue(result.TotalLocalTravelAmount);

        control.controls[index].get('TotalCost')?.setValue(result.TotalCost);

        control.controls[index].get('IsTravelAllowance')?.setValue(true);
        control.controls[index].get('IsFoodAllowance')?.setValue(false);

        var totalCost = 0;
        var items = this.taItems.value;
        items.forEach(element => {
          if(element.IsActive == true)
          {
            totalCost += Number(element.TotalCost);
          }
        });
        this.totalSettlement = totalCost;
        this.totalSettlementStr = this.totalSettlement.toLocaleString();
        if(Number(this.totalAllowance) < Number(this.totalSettlement))
        {
          this.isDue = true;
          this.isRefund = false;
          this.totalDue = (Number(this.totalSettlement) - Number(this.totalAllowance));
          this.totalDueStr = this.totalDue.toLocaleString();
          this.totalRefund = 0;
        }
        else{
          this.isDue = false;
          this.isRefund = true;
          this.totalDue = 0;
          this.totalRefund = (Number(this.totalAllowance) - Number(this.totalSettlement));
          this.totalRefundStr = this.totalRefund.toLocaleString();
        }
        this.balanceCalculation();
      }
    }, (reason) => {
      console.log('Dismissed action: ' + reason);
    });
  }
  public foodAllowanceCalculation(index: number) {
    const control =  this.basicForm.get('Items') as FormArray;
    var startDate = new Date(control.controls[index].get('StartDate')?.value);
    var endDate = new Date(control.controls[index].get('EndDate')?.value);
    var dayDiff = Math.floor((Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) ) /(1000 * 60 * 60 * 24));
    if(dayDiff < 0)
    {
      this.toaster.info('End date must be greater or equal to start date','info');
      return;
    }
    else if(dayDiff >= 0){
      var totalDay = dayDiff + 1;
      control.controls[index].get('NoOfDays')?.setValue(totalDay);
    }
    var itemObj = control.value[index];
    const modalRef = this.modalService.open(FoodAllowanceCalculationComponent, { size: 'xl', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.ItemObj = itemObj;
    modalRef.componentInstance.initModel = this.initModel;
    modalRef.componentInstance.CanEdit = true;
    modalRef.result.then((result) => {
      if (result) {
        control.controls[index].get('TotalDistance')?.setValue(result.TotalDistance);
        control.controls[index].get('SiteCode')?.setValue(result.SiteCode);
        control.controls[index].get('LocalConveyanceAmount')?.setValue(result.LocalConveyanceAmount);

        control.controls[index].get('TravelCost')?.setValue(result.TravelCost);
        control.controls[index].get('EntertainmentCost')?.setValue(result.EntertainmentCost);
        control.controls[index].get('MiscellaneousCost')?.setValue(result.MiscellaneousCost);

        control.controls[index].get('IsNightStay')?.setValue(result.IsNightStay);
        control.controls[index].get('DeductionRemarks')?.setValue(result.DeductionRemarks);

        control.controls[index].get('BreakFastAllowance')?.setValue(result.BreakFastAllowance);
        control.controls[index].get('LunchAllowance')?.setValue(result.LunchAllowance);
        control.controls[index].get('SnacksAllowance')?.setValue(result.SnacksAllowance);
        control.controls[index].get('DinnerAllowance')?.setValue(result.DinnerAllowance);
        control.controls[index].get('NightAllowance')?.setValue(result.NightAllowance);

        control.controls[index].get('TotalBreakFast')?.setValue(result.TotalBreakFast);
        control.controls[index].get('TotalLunch')?.setValue(result.TotalLunch);
        control.controls[index].get('TotalSnacks')?.setValue(result.TotalSnacks);
        control.controls[index].get('TotalDinner')?.setValue(result.TotalDinner);
        control.controls[index].get('TotalNight')?.setValue(result.TotalNight);

        control.controls[index].get('ActualBreakFast')?.setValue(result.ActualBreakFast);
        control.controls[index].get('ActualLunch')?.setValue(result.ActualLunch);
        control.controls[index].get('ActualSnacks')?.setValue(result.ActualSnacks);
        control.controls[index].get('ActualDinner')?.setValue(result.ActualDinner);
        control.controls[index].get('ActualNight')?.setValue(result.ActualNight);

        control.controls[index].get('TotalBreakFastAmount')?.setValue(result.TotalBreakFastAmount);
        control.controls[index].get('TotalLunchAmount')?.setValue(result.TotalLunchAmount);
        control.controls[index].get('TotalSnacksAmount')?.setValue(result.TotalSnacksAmount);
        control.controls[index].get('TotalDinnerAmount')?.setValue(result.TotalDinnerAmount);
        control.controls[index].get('TotalNightAmount')?.setValue(result.TotalNightAmount);

        control.controls[index].get('TotalCost')?.setValue(result.TotalCost);
        
        control.controls[index].get('IsTravelAllowance')?.setValue(false);
        control.controls[index].get('IsFoodAllowance')?.setValue(true);
        var totalCost = 0;
        var items = this.taItems.value;
        items.forEach(element => {
          if(element.IsActive == true)
          {
            totalCost += Number(element.TotalCost);
          }
        });
        this.totalSettlement = totalCost;
        this.totalSettlementStr = this.totalSettlement.toLocaleString();
        if(Number(this.totalAllowance) < Number(this.totalSettlement))
        {
          this.isDue = true;
          this.isRefund = false;
          this.totalDue = (Number(this.totalSettlement) - Number(this.totalAllowance));
          this.totalDueStr = this.totalDue.toLocaleString();
          this.totalRefund = 0;
        }
        else{
          this.isDue = false;
          this.isRefund = true;
          this.totalDue = 0;
          this.totalRefund = (Number(this.totalAllowance) - Number(this.totalSettlement));
          this.totalRefundStr = this.totalRefund.toLocaleString();
        }
        this.balanceCalculation();
      }
    }, (reason) => {
      console.log('Dismissed action: ' + reason);
    });
  }
  duplicateRow(index: number) {
    const control =  this.basicForm.get('Items') as FormArray;
    (this.basicForm.get("Items") as FormArray).push(this.patchItem(control.controls[index].value,true));
	}
  removeLineAttachment(index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'this attachement is permanently deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        const control =  this.basicForm.get('Items') as FormArray;
        control.controls[index].get('FileId')?.setValue(null);
        control.controls[index].get('FileName')?.setValue('');
        control.controls[index].get('FileType')?.setValue('');
        control.controls[index].get('FilePath')?.setValue('');
      }
    });
  }
  balanceCalculation(){
    if(this.isRefund){
      this.balanceFormControl.setValue(Number(this.totalRefund) - Number(this.depositedRefundFormControl.value));
    }
    else{
      this.balanceFormControl.setValue(Number(this.totalDue) - Number(this.depositedDueFormControl.value));
    }
  }
}