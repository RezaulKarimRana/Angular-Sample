import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { PortalUserViewModel } from "../../../core/models/auth.models";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "../../../core/base/component/base/base.component";
import { BaseService } from "src/app/core/base/base.service";
import { TaskTypeDetailsModel } from "src/app/core/models/mastersetup-model/tasktypedetails.model";
import { BankAccountComponent } from "src/app/shared/ui/bank-account/bank-account.component";
import {
  TASettlementListModel,
  TASettlementDetailsItem,
  TASettlementViewModel,
  TASettlementFileViewModel,
} from "src/app/core/models/travel-authorisation-model/travelAuthorisationSettlement.model";
import { TASettlementService } from "src/app/core/services/TravelAuthorization/travelAuthSettlement.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TravelAllowanceCalculationComponent } from "../travel-allowance-calculation/travel-allowance-calculation.component";
import { FoodAllowanceCalculationComponent } from "../food-allowance-calculation/food-allowance-calculation.component";

@Component({
  selector: "app-detail-travel",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  taId: number;
  SettlementFiles: Array<TASettlementFileViewModel> =
    new Array<TASettlementFileViewModel>();
  basicForm: FormGroup;
  innerWidth: any;
  totalAllowance: string;
  totalSettlement: string;
  CanViewBankInfo: boolean = false;
  reqId: string;
  pageTitle: string;
  subSink: SubSink;
  VoucherNo: string = "";
  bankFormGroup: FormGroup;
  taAdvanceInfoForm: FormGroup;
  canViewFinanceGroup: boolean;
  secondFormGroup: FormGroup;
  aModel: TASettlementViewModel;
  initModel: TASettlementListModel;
  travelAuthorizationDetailsItemList: TASettlementDetailsItem[] = [];
  travelAuthorizationDetailsItem: TASettlementDetailsItem;
  IsWithAdvance: boolean = false;
  isCollapsed: boolean = false;
  portalUserViewModel: PortalUserViewModel;
  loading: boolean = false;
  onTouchTaskType: boolean = false;
  taskTypeDetailsList: TaskTypeDetailsModel[] = [];
  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  isDue: boolean = false;
  isRefund: boolean = false;
  totalDueStr: string;
  totalRefundStr: string;
  totalDue: number = 0;
  totalRefund: number = 0;
  @ViewChild("dp", { static: true }) datePicker: any;
  profilePicAsByteArrayAsBase64: any;
  @ViewChild("bankAccountComponent", { static: true })
  bankAccountComponent: BankAccountComponent;
  supervisorLevelName: string = "Bill Reviewer";
  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private travelAuthService: TASettlementService,
    private entryFormBuilder: FormBuilder
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    if (cn && cn.extras.state) {
      if (
        cn.extras.state.id != null &&
        cn.extras.state.id != undefined &&
        cn.extras.state.id != ""
      ) {
        this.pageTitle = "Basic Information";
        this.reqId = cn.extras.state.id;
      }
    }
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.loadInitData();
    this.createForm();
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
    this._fetchData();
    if (this.portalUserViewModel.SupervisorId.length > 0)
      this.supervisorLevelName =
        this.portalUserViewModel.SupervisorId[0]["Text"] == "True"
          ? "Approver"
          : this.supervisorLevelName;
  }
  private loadInitData() {
    this.subSink.sink = this.travelAuthService.getInitData().subscribe(
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
  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }

  createForm() {
    this.basicForm = this.fb.group({
      TAId: [this.taId],
      RequestNo: [""],
      TARefNo: [""],
      SupervisorId: [null],
      UserId: [null],
      Justification: ["", Validators.required],
      TotalAmount: [""],
      TotalCost: [""],
      FileUploader: [""],
      DepositedRefund: [""],
      DepositedDue: [""],
      Balance: [""],
      Items: this.fb.array([]),
    });
    this.bankFormGroup = this.entryFormBuilder.group({
      UserBankDetails: [""],
    });
    this.taAdvanceInfoForm = this.entryFormBuilder.group({
      TAAdvanceInfo: [""],
    });

    this.secondFormGroup = this.entryFormBuilder.group({
      LocationDistrictId: ["", Validators.required],
      DurationToDate: [new Date(), Validators.required],
      DurationFromDate: [new Date(), Validators.required],
      Remarks: [""],
    });
  }

  get taAdvanceInfoFormControl() {
    return this.taAdvanceInfoForm
      ? this.taAdvanceInfoForm.get("TAAdvanceInfo")
      : null;
  }
  //#region SecondFromGroup

  get locationDistrictFormControl() {
    return this.secondFormGroup
      ? this.secondFormGroup.get("LocationDistrictId")
      : null;
  }

  get durationToDateFormControl() {
    return this.secondFormGroup
      ? this.secondFormGroup.get("DurationToDate")
      : null;
  }

  get durationFromDateFormControl() {
    return this.secondFormGroup
      ? this.secondFormGroup.get("DurationFromDate")
      : null;
  }

  get remarksFormControl() {
    return this.secondFormGroup ? this.secondFormGroup.get("Remarks") : null;
  }
  get itemsFC() {
    return this.basicForm ? this.basicForm.get("Items") : null;
  }
  get fileUploaderFormControl() {
    return this.basicForm ? this.basicForm.get("FileUploader") : null;
  }
  get taItems(): FormArray {
    return this.basicForm.get("Items") as FormArray;
  }
  //#endregion

  _fetchData = () => {
    this.loading = true;
    this.subSink.sink = this.travelAuthService.getById(this.reqId).subscribe(
      (res) => {
        if (res.Success) {
          this.aModel = res.Data;
          this.totalAllowance =
            this.aModel?.TASettlementDetailsItemViewModel?.reduce(
              (sum, item) => sum + item.Total,
              0
            ).toLocaleString();
          this.totalSettlement =
            this.aModel?.TASettlementDetailsItemViewModel?.reduce(
              (sum, item) => sum + item.TotalCost,
              0
            ).toLocaleString();
          this.canViewFinanceGroup =
            this.portalUserViewModel.Is_Finance_Check ||
            this.portalUserViewModel.Is_Finance_Complete;
          this.loadData(this.aModel);
          this.VoucherNo = this.aModel?.VoucherNo;
          this.loading = false;
          if (this.aModel.ProfilePicUrl) {
            this.profilePicAsByteArrayAsBase64 =
              "data:image/png;base64," + this.aModel.ProfilePicUrl;
          } else {
            this.profilePicAsByteArrayAsBase64 =
              "assets/images/users/avatar-1.jpg";
          }
        } else {
          this.toaster.error(res["Message"], "Error");
          this.router.navigate(["/taSettlement/list"]);
          this.loading = false;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
        this.loading = false;
      }
    );
  };
  patchItem(item: any) {
    if (item.AllowancecPerDay == null) {
      var workingDistrict = this.initModel.DistrictList.find(
        (x) => x.Id === item.WorkingDistrictId
      );
      item.AllowancecPerDay = workingDistrict.IsMajor
        ? this.initModel?.TADAList[0].TotalAllownaceMajor
        : this.initModel?.TADAList[0].TotalAllownaceMinor;
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
      TotalDistance: item.TotalDistance,
      SiteCode: item.SiteCode,
      TravelCost: item.TravelCost,
      EntertainmentCost: item.EntertainmentCost,
      MiscellaneousCost: item.MiscellaneousCost,
      LocalConveyanceAmount: item.LocalConveyanceAmount,
      DeductionRemarks: item.DeductionRemarks,
      IsStayOnHotel: item.IsStayOnHotel,
      IsNightStay: item.IsNightStay,
      HasOwnAccomodation: item.HasOwnAccomodation,
      HasLocalConveyance: item.HasLocalConveyance,
      IsOfficeVehicleUsed: item.IsOfficeVehicleUsed,
      TotalOfficeVehicle: item.TotalOfficeVehicle,
      TotalLocalConveyance: item.TotalLocalConveyance,
      FileId: item.FileId,
      FileName: item.FileName,
    });
  }
  public allowanceDetails(index: number) {
    const control = this.basicForm.get("Items") as FormArray;
    var itemObj = control.value[index];
    if (itemObj.IsTravelAllowance) {
      const modalRef = this.modalService.open(
        TravelAllowanceCalculationComponent,
        { size: "xl", backdrop: "static", keyboard: false }
      );
      modalRef.componentInstance.ItemObj = itemObj;
      modalRef.componentInstance.initModel = this.initModel;
      modalRef.componentInstance.CanEdit = false;
      modalRef.result.then(
        (result) => {
          if (result) {
          }
        },
        (reason) => {
          console.log("Dismissed action: " + reason);
        }
      );
    } else {
      const modalRef = this.modalService.open(
        FoodAllowanceCalculationComponent,
        { size: "xl", backdrop: "static", keyboard: false }
      );
      modalRef.componentInstance.ItemObj = itemObj;
      modalRef.componentInstance.initModel = this.initModel;
      modalRef.componentInstance.CanEdit = false;
      modalRef.result.then(
        (result) => {
          if (result) {
          }
        },
        (reason) => {
          console.log("Dismissed action: " + reason);
        }
      );
    }
  }
  loadData(aModel: TASettlementViewModel) {
    this.bankAccountComponent.value = aModel;
    this.basicForm.patchValue({
      TAId: aModel.TAId,
      RequestNo: aModel.RequestNo,
      TARefNo: aModel.TARefNo,
      TotalAmount: aModel.TotalAmount,
      TotalCost: aModel.TotalCost,
      SupervisorId: aModel.SupervisorId,
      DepositedRefund: aModel.DepositedRefund,
      DepositedDue: aModel.DepositedDue,
      Balance: aModel.Balance,
    });
    aModel.TASettlementDetailsItemViewModel.forEach((x) => {
      (this.basicForm.get("Items") as FormArray).push(this.patchItem(x));
    });
    var advItems = this.taItems.value;
    this.totalSettlement = advItems
      .reduce((sum, item) => sum + item.TotalCost, 0)
      .toLocaleString();
    this.approvedStatusCount = aModel.RunningApproverMatrixViewModel.filter(
      (t) => t["StatusName"] == "Approved"
    ).length;
    this.pendingStatusCount = aModel.RunningApproverMatrixViewModel.filter(
      (t) => t["StatusName"] == "Pending"
    ).length;
    this.dueStatusCount = aModel.RunningApproverMatrixViewModel.filter(
      (t) => t["StatusName"] == "Due"
    ).length;
    var totalAdvance = advItems.reduce((sum, item) => sum + item.Total, 0);
    var totalCost = advItems.reduce((sum, item) => sum + item.TotalCost, 0);
    if (Number(totalAdvance) < Number(totalCost)) {
      this.isDue = true;
      this.isRefund = false;
      this.totalDue = Number(totalCost) - Number(totalAdvance);
      this.totalDueStr = this.totalDue.toLocaleString();
      this.totalRefund = 0;
    } else {
      this.isDue = false;
      this.isRefund = true;
      this.totalDue = 0;
      this.totalRefund = Number(totalAdvance) - Number(totalCost);
      this.totalRefundStr = this.totalRefund.toLocaleString();
    }
  }
  public getParamId() {
    this.subSink.sink = this.activatedRoute.params.subscribe((params) => {
      this.reqId = params["id"];
    });
  }
  onInitalizeBankAccount(component: BankAccountComponent) {
    this.bankAccountComponent = component;
  }
  viewTA() {
    this.router.navigateByUrl(`travelauthorisation/detail`, {
      state: {
        id: this.aModel.TAId,
      },
    });
  }
}
