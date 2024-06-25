import { Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { SubSink } from 'subsink/dist/subsink';
import { ToastrService } from 'ngx-toastr';
import { PortalUserViewModel } from '../../../core/models/auth.models';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { BankAccountComponent } from 'src/app/shared/ui/bank-account/bank-account.component';
import { TASettlementListModel, TASettlementSearchModel, TASettlementViewModel } from 'src/app/core/models/travel-authorisation-model/travelAuthorisationSettlement.model';
import { TASettlementService } from 'src/app/core/services/TravelAuthorization/travelAuthSettlement.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationStatus } from 'src/app/core/enums/constants';
import { FoodAllowanceCalculationComponent } from '../food-allowance-calculation/food-allowance-calculation.component';
import { TravelAllowanceCalculationComponent } from '../travel-allowance-calculation/travel-allowance-calculation.component';

@Component({
  selector: 'app-approver-entry',
  templateUrl: './approver-entry.component.html'
})

export class ApproverEntryComponent extends BaseComponent implements OnInit, OnDestroy {

  taId:number;
  basicForm: FormGroup;
  innerWidth: any;
  totalAllowance:string;
  totalSettlement: string;
  isDue: boolean = false;
  isRefund: boolean = false;
  totalDueStr: string;
  totalRefundStr: string;
  totalDue: number = 0;
  totalRefund: number = 0;
  CanViewBankInfo: boolean = false;
  finVoucherNo: string;
  reqId: string;
  pageTitle: string;
  requesterUserId: number;
  formGroup: FormGroup;
  recommenderFormGroup: FormGroup;
  isFinanceCheck:boolean = false;
  isFinanceComplete:boolean = false;
  subSink: SubSink;
  VoucherNo: string = "";
  bankFormGroup: FormGroup;
  canViewFinanceGroup: boolean;
  aModel: TASettlementViewModel;
  initModel: TASettlementSearchModel;
  IsWithAdvance: boolean = false;
  isCollapsed: boolean = false;
  portalUserViewModel: PortalUserViewModel;
  loading: boolean = false;
  @ViewChild('dp', { static: true }) datePicker: any;
  profilePicAsByteArrayAsBase64 : any;
  @ViewChild('bankAccountComponent', { static: true })
	bankAccountComponent: BankAccountComponent;
  supervisorLevelName :string ="Bill Reviewer";
  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private travelAuthService: TASettlementService,
    private entryFormBuilder: FormBuilder) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    if (cn && cn.extras.state) {
      if (cn.extras.state.id != null && cn.extras.state.id != undefined && cn.extras.state.id != '') {
        this.pageTitle = 'Basic Information';
        this.reqId = cn.extras.state.id;
      }
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.createForm();
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    this.isFinanceCheck = this.portalUserViewModel.Is_Finance_Check;
    this.isFinanceComplete = this.portalUserViewModel.Is_Finance_Complete;
    this._fetchData();
    if(this.portalUserViewModel.SupervisorId.length > 0) 
      this.supervisorLevelName =this.portalUserViewModel.SupervisorId[0]['Text'] == "True" ? "Approver" : this.supervisorLevelName;

  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  createForm() {
    this.basicForm = this.fb.group({
      TAId:[this.taId],
      RequestNo:[''],
      TARefNo:[''],
      SupervisorId: [null],
      UserId: [null],
      Justification: ['',Validators.required],
      TotalAmount: [''],
      TotalCost: [''],
      FileUploader: [''],
      DepositedRefund: [''],
      DepositedDue: [''],
      Balance: [''],
      Items: this.fb.array([])
    });
    this.bankFormGroup = this.entryFormBuilder.group({
      UserBankDetails: ['']
    });
    this.formGroup = this.entryFormBuilder.group({
      VoucherNo:[''],
      ApproverRemarks:['']
    });
    this.recommenderFormGroup = this.entryFormBuilder.group({
      AcknowledgerId: [null],
      VerifierId: [null],
      RecommenderId: [null, Validators.required]
    });
  }
  get voucherNoFC() {
		return this.formGroup ? this.formGroup.get('VoucherNo') : null;
	}
  get taItems(): FormArray {
		return this.basicForm.get('Items') as FormArray;
	}
  get approverRemarksFC() {
		return this.formGroup ? this.formGroup.get('ApproverRemarks') : null;
	}
  get acknowledgerFC() {
		return this.recommenderFormGroup ? this.recommenderFormGroup.get('AcknowledgerId') : null;
	}
  get verifierFC() {
		return this.recommenderFormGroup ? this.recommenderFormGroup.get('VerifierId') : null;
	}
  get recommenderFC() {
		return this.recommenderFormGroup ? this.recommenderFormGroup.get('RecommenderId') : null;
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
  //#endregion

  _fetchData = () => {
    this.loading = true;
    this.subSink.sink = this.travelAuthService.getById(this.reqId).subscribe(
      (res) => {
        if (res.Success) {
          this.aModel = res.Data;
          this.initModel = res.Data.InitModel;
          this.totalAllowance = this.aModel?.TASettlementDetailsItemViewModel?.reduce((sum, item) => sum + item.Total, 0).toLocaleString();
          this.totalSettlement = this.aModel?.TASettlementDetailsItemViewModel?.reduce((sum, item) => sum + item.TotalCost, 0).toLocaleString();
          this.canViewFinanceGroup = this.portalUserViewModel.Is_Finance_Check || this.portalUserViewModel.Is_Finance_Complete;
          this.loadData(this.aModel);
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

          if(this.aModel?.AcknowledgerUsers?.length>0)
          this.acknowledgerFC.setValue(this.aModel?.AcknowledgerUsers[0].Id);
        
          if(this.aModel?.VerifierUsers?.length>0)
          this.verifierFC.setValue(this.aModel?.VerifierUsers[0].Id);

          if(this.aModel?.RecommenderUsers?.length>0)
          this.recommenderFC.setValue(this.aModel?.RecommenderUsers[0].Id);

          this.loading = false;
          if(this.aModel.ProfilePicUrl){
            this.profilePicAsByteArrayAsBase64 = "data:image/png;base64," + this.aModel.ProfilePicUrl;
          }
          else{
            this.profilePicAsByteArrayAsBase64 = "assets/images/users/avatar-1.jpg";
          }
        }
        else {
          this.toaster.error(res['Message'], "Error");
          this.router.navigate(['/taSettlement/myapprovals']);
          this.loading = false;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
        this.loading = false;
      }
    );
  }
  patchItem(item: any) {

    if(item.AllowancecPerDay == null)
    {
      var workingDistrict = this.initModel.DistrictList.find(x => x.Id === item.WorkingDistrictId);
      item.AllowancecPerDay = workingDistrict.IsMajor ? this.initModel?.TADAList[0].TotalAllownaceMajor : this.initModel?.TADAList[0].TotalAllownaceMinor;
    }
		return this.fb.group({
			  Id: item.Id,
        IsTravelAllowance: item.IsTravelAllowance,
        IsFoodAllowance: item.IsFoodAllowance,
        WorkingDistrictId: item.WorkingDistrictId,
        WorkingDistrictType: item.WorkingDistrictType,
        LocationFromDistrictId: item.LocationFromDistrictId,
        LocationToDistrictId: item.LocationToDistrictId,
        TaskTypeId: item.TaskTypeId,
        TaskTypeDetailsId: item.TaskTypeDetailsId,
        StartDate: item.StartDate,
        EndDate: item.EndDate,
        NoOfDays: item.NoOfDays,
        AllowancecPerDay: item.AllowancecPerDay,
        Total: item.Total,
        TotalCost: item.TotalCost,
        IsActive: item.IsActive,
        BreakFastAllowance: item.BreakFastAllowance,
        LunchAllowance: item.LunchAllowance,
        SnacksAllowance: item.SnacksAllowance,
        DinnerAllowance: item.DinnerAllowance,
        NightAllowance: item.NightAllowance,
        HotelAllowance: item.HotelAllowance,
        LocalTravelAllowance: item.LocalTravelAllowance,
        TotalBreakFast: item.TotalBreakFast,
        TotalLunch: item.TotalLunch,
        TotalSnacks: item.TotalSnacks,
        TotalDinner: item.TotalDinner,
        TotalNight: item.TotalNight,
        TotalHotelStay: item.TotalHotelStay,
        TotalLocalTravel: item.TotalLocalTravel,
        ActualBreakFast: item.ActualBreakFast,
        ActualLunch: item.ActualLunch,
        ActualSnacks: item.ActualSnacks,
        ActualDinner: item.ActualDinner,
        ActualNight: item.ActualNight,
        ActualHotelStay: item.ActualHotelStay,
        ActualLocalTravel: item.ActualLocalTravel,
        TotalBreakFastAmount: item.TotalBreakFastAmount,
        TotalLunchAmount: item.TotalLunchAmount,
        TotalSnacksAmount: item.TotalSnacksAmount,
        TotalDinnerAmount: item.TotalDinnerAmount,
        TotalNightAmount: item.TotalNightAmount,
        TotalHotelStayAmount: item.TotalHotelStayAmount,
        TotalLocalTravelAmount: item.TotalLocalTravelAmount,
        TotalDistance : item.TotalDistance,
        SiteCode: item.SiteCode,
        TravelCost : item.TravelCost,
        EntertainmentCost : item.EntertainmentCost,
        MiscellaneousCost : item.MiscellaneousCost,
        LocalConveyanceAmount: item.LocalConveyanceAmount,
        DeductionRemarks : item.DeductionRemarks,
        IsStayOnHotel : item.IsStayOnHotel,
        HasOwnAccomodation: item.HasOwnAccomodation,
        HasLocalConveyance: item.HasLocalConveyance,
        IsOfficeVehicleUsed : item.IsOfficeVehicleUsed,
        TotalOfficeVehicle : item.TotalOfficeVehicle,
        TotalLocalConveyance: item.TotalLocalConveyance,
        FileId: item.FileId,
        FileName: item.FileName
		});
	}
  public allowanceDetails(index: number) {
    const control =  this.basicForm.get('Items') as FormArray;
    var itemObj = control.value[index];
    if(itemObj.IsTravelAllowance){
      const modalRef = this.modalService.open(TravelAllowanceCalculationComponent, { size: 'xl', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.ItemObj = itemObj;
      modalRef.componentInstance.initModel = this.initModel;
      modalRef.componentInstance.CanEdit = false;
      modalRef.result.then((result) => {
        if (result) {
        }
      }, (reason) => {
        console.log('Dismissed action: ' + reason);
      });
    }
    else{
      const modalRef = this.modalService.open(FoodAllowanceCalculationComponent, { size: 'xl', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.ItemObj = itemObj;
      modalRef.componentInstance.initModel = this.initModel;
      modalRef.componentInstance.CanEdit = false;
      modalRef.result.then((result) => {
        if (result) {
        }
      }, (reason) => {
        console.log('Dismissed action: ' + reason);
      });
    }
  }
  loadData(aModel: TASettlementViewModel) {
    this.bankAccountComponent.value = aModel;
    this.requesterUserId = aModel.RequesterUserId;
    this.basicForm.patchValue({
      TAId: aModel.TAId,
      RequestNo: aModel.RequestNo,
      TARefNo: aModel.TARefNo,
      TotalAmount: aModel.TotalAmount,
      TotalCost: aModel.TotalCost,
      SupervisorId: aModel.SupervisorId,
      DepositedRefund:aModel.DepositedRefund,
      DepositedDue:aModel.DepositedDue,
      Balance:aModel.Balance
    });
    aModel.TASettlementDetailsItemViewModel.forEach(x=>{
      (this.basicForm.get("Items") as FormArray).push(this.patchItem(x));
    });
    this.totalAllowance = this.taItems.value.reduce((sum, item) => sum + item.Total, 0).toLocaleString();
    this.totalSettlement = this.taItems.value.reduce((sum, item) => sum + item.TotalCost, 0).toLocaleString();
    var totalAdvance = this.taItems.value.reduce((sum, item) => sum + item.Total, 0);
    var totalCost = this.taItems.value.reduce((sum, item) => sum + item.TotalCost, 0);
    if(Number(totalAdvance) < Number(totalCost))
        {
          this.isDue = true;
          this.isRefund = false;
          this.totalDue = (Number(totalCost) - Number(totalAdvance));
          this.totalDueStr = this.totalDue.toLocaleString();
          this.totalRefund = 0;
        }
        else{
          this.isDue = false;
          this.isRefund = true;
          this.totalDue = 0;
          this.totalRefund = (Number(totalAdvance) - Number(totalCost));
          this.totalRefundStr = this.totalRefund.toLocaleString();
        }
  }
  public getParamId() {
      this.subSink.sink = this.activatedRoute.params.subscribe(params => {
      this.reqId = params['id'];
    });
  }
  onInitalizeBankAccount(component: BankAccountComponent) {
		this.bankAccountComponent = component;
	}
  viewTA(){
    this.router.navigateByUrl(`travelauthorisation/detail`, {
      state: {
        id: this.aModel.TAId,
      }
    });
  }
  packageForm(): TASettlementViewModel {
    let data = new TASettlementViewModel();
    data = new TASettlementViewModel({
      Id: this.aModel?.Id > 0 ? this.aModel.Id : 0,
      ApproverRemarks : this.approverRemarksFC.value,
      DepositedRefund: this.depositedRefundFormControl.value,
      DepositedDue: this.depositedDueFormControl.value,
      Balance: this.balanceFormControl.value,
    });
    if(this.isFinanceCheck)
    {
      data.VoucherNo = this.voucherNoFC.value;
    }
    return data;
  }
  onVerifyAndSubmit() {
    if(this.aModel?.Is_Supervisor_Pending && this.recommenderFormGroup.invalid && this.aModel?.RecommenderUsers.length > 0)
    {
      this.toaster.error('Please add a Recommender','error');
      return;
    }
    if((!this.voucherNoFC.value || this.voucherNoFC.value == this.finVoucherNo) && this.isFinanceCheck && this.isDue){
      this.toaster.error('Please Provide a Voucher No');
      return;
    }
    if(this.balanceFormControl.value != 0 && this.isFinanceCheck){
      this.toaster.error('Balance Should be zero','error');
      return;
    }
    this.loading = true;
    let inv = this.packageForm();
    if(this.aModel?.Is_Supervisor_Pending)
    {
      inv.AcknowledgerId = this.acknowledgerFC.value;
      inv.VerifierId = this.verifierFC.value;
      inv.RecommenderId = this.recommenderFC.value;
    }
    inv.ApproverStatusId = ApplicationStatus.Completed;
    this.subSink.sink = this.travelAuthService.updateApproverFeedBack(inv).subscribe((x) => {
      if (x.Success) {
        this.loading = false;
        this.toaster.success('approved successfully');
        this.router.navigate(['/taSettlement/myapprovals']);
      } else {
        this.loading = false;
        this.toaster.error(x.Message);
      }
    })
  }
  onReturn() {
    this.loading = true;
    let inv = this.packageForm();
    inv.ApproverStatusId = ApplicationStatus.Return;
    this.subSink.sink = this.travelAuthService.updateApproverFeedBack(inv).subscribe((x) => {
      if (x.Success) {
        this.loading = false;
        this.toaster.success('return successfully');
        this.router.navigate(['/taSettlement/myapprovals']);
      } else {
        this.loading = false;
        this.toaster.error(x.Message);
      }
    })
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