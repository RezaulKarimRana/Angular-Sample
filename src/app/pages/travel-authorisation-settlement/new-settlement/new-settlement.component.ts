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
  TASettlement,
  TASettlementSearchModel,
  TASettlementAttachment,
} from "src/app/core/models/travel-authorisation-model/travelAuthorisationSettlement.model";
import { TASettlementService } from "src/app/core/services/TravelAuthorization/travelAuthSettlement.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TravelAllowanceCalculationComponent } from "../travel-allowance-calculation/travel-allowance-calculation.component";
import { FoodAllowanceCalculationComponent } from "../food-allowance-calculation/food-allowance-calculation.component";
import Swal from "sweetalert2";
import { FileUploader } from "ng2-file-upload";
import { FileTypeSize } from "src/app/core/enums/constants";
import { ChildFileViewModel } from "src/app/core/models/settlement-model/settlement.model";
import { TAdAModel } from "src/app/core/models/mastersetup-model/TAdAModel.model";

@Component({
  selector: "app-new-settlement",
  templateUrl: "./new-settlement.component.html",
  styleUrls: ["./new-settlement.component.scss"],
})
export class NewSettlementComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  taId: number;
  SettlementFiles: Array<TASettlementFileViewModel> =
    new Array<TASettlementFileViewModel>();
  basicForm: FormGroup;
  innerWidth: any;
  lastLocationFromId: number;
  perDayAllowance: TAdAModel;
  DateRangeList: any = [];
  totalSettlement: number;
  CanViewBankInfo: boolean = false;
  reqId: string;
  pageTitle: string;
  requesterUserId: number;
  formGroup: FormGroup;
  recommenderFormGroup: FormGroup;
  isFinanceCheck: boolean = false;
  isFinanceComplete: boolean = false;
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
  isCollapsed: boolean = false;
  portalUserViewModel: PortalUserViewModel;
  loading: boolean = false;
  isFileSizeExceed: boolean;
  totalSettlementStr: string;
  onTouchTaskType: boolean = false;
  taskTypeDetailsList: TaskTypeDetailsModel[] = [];
  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  totalFileSize: number = 0;
  SettlementFile = new TASettlementFileViewModel();
  totalCost: number = 0;
  fileList: File[] = new Array<File>();
  SettlementUploadedFiles: Array<TASettlementFileViewModel> =
    new Array<TASettlementFileViewModel>();
  isChildFileSizeExceed: boolean;
  attachment = new TASettlementAttachment();
  ChildFiles: Array<ChildFileViewModel> = new Array<ChildFileViewModel>();
  ChildFile = new ChildFileViewModel();
  isFileSelected: boolean = false;
  uploadFileId: number = 0;
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
    private taSettlementService: TASettlementService,
    private entryFormBuilder: FormBuilder
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    this.pageTitle = "Basic Information";
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  public uploader: FileUploader = new FileUploader({
    maxFileSize: FileTypeSize.fileSize,
    allowedMimeType: FileTypeSize.fileTypes,
  });
  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.createForm();
    this.loadInitData();
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
  }
  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }
  createForm() {
    this.basicForm = this.fb.group({
      Id: [0],
      TAId: [null],
      RequestNo: [""],
      TARefNo: [""],
      SupervisorId: [null],
      SupervisorName: [""],
      UserId: [null],
      Justification: ["", Validators.required],
      TotalAmount: [""],
      TotalCost: [""],
      FileUploader: [""],
      Items: this.fb.array([]),
    });
    this.bankFormGroup = this.entryFormBuilder.group({
      UserBankDetails: [""],
    });
  }
  get supervisorFC() {
    return this.basicForm ? this.basicForm.get("SupervisorId") : null;
  }
  get supervisorNameFC() {
    return this.basicForm ? this.basicForm.get("SupervisorName") : null;
  }
  get taItems(): FormArray {
    return this.basicForm.get("Items") as FormArray;
  }
  loadInitData = () => {
    this.loading = true;
    this.subSink.sink = this.taSettlementService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
          this.bankAccountComponent.value = this.initModel.BankAccountList[0];
          this.totalSettlement = 0;
          this.supervisorFC.setValue(this.initModel.SupervisorId);
          this.supervisorNameFC.setValue(this.initModel.SupervisorName);
          this.totalSettlementStr = this.totalSettlement.toLocaleString();
          (this.basicForm.get("Items") as FormArray).push(
            this.createSingleRow()
          );
          if (!this.initModel.ProfilePicUrl) {
            this.toaster.info(
              "You have no Profile Picture, Please Upload Your Profile Picture"
            );
            this.router.navigate(["/taSettlement/list"]);
          }
          this.loading = false;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
        this.loading = false;
      }
    );
  };
  createSingleRow() {
    return this.fb.group({
      Id: [0],
      IsTravelAllowance: [false],
      IsFoodAllowance: [true],
      WorkingDistrictId: [null, Validators.required],
      WorkingDistrictType: [""],
      LocationFromDistrictId: [null, Validators.required],
      LocationToDistrictId: [null, Validators.required],
      TaskTypeId: [null, Validators.required],
      TaskTypeDetailsId: [null, Validators.required],
      StartDate: [null, Validators.required],
      EndDate: [null, Validators.required],
      NoOfDays: [null],
      AllowancecPerDay: [null],
      Total: [null],
      TotalCost: [null],
      IsActive: [true],
      BreakFastAllowance: [""],
      LunchAllowance: [""],
      SnacksAllowance: [""],
      DinnerAllowance: [""],
      NightAllowance: [""],
      HotelAllowance: [""],
      LocalTravelAllowance: [""],
      TotalBreakFast: [""],
      TotalLunch: [""],
      TotalSnacks: [""],
      TotalDinner: [""],
      TotalNight: [""],
      TotalHotelStay: [""],
      TotalLocalTravel: [""],
      ActualBreakFast: [""],
      ActualLunch: [""],
      ActualSnacks: [""],
      ActualDinner: [""],
      ActualNight: [""],
      ActualHotelStay: [""],
      ActualLocalTravel: [""],
      TotalBreakFastAmount: [""],
      TotalLunchAmount: [""],
      TotalSnacksAmount: [""],
      TotalDinnerAmount: [""],
      TotalNightAmount: [""],
      TotalHotelStayAmount: [""],
      TotalLocalTravelAmount: [""],
      TotalDistance: [""],
      SiteCode: [""],
      TravelCost: [""],
      EntertainmentCost: [""],
      MiscellaneousCost: [""],
      LocalConveyanceAmount: [""],
      DeductionRemarks: [""],
      IsStayOnHotel: [""],
      HasOwnAccomodation: [""],
      HasLocalConveyance: [""],
      IsOfficeVehicleUsed: [""],
      TotalOfficeVehicle: [""],
      TotalLocalConveyance: [""],
      FileId: [""],
      FileName: [""],
      FileType: [""],
      FilePath: [""],
    });
  }
  patchItem(item: any, isDuplicate: boolean) {
    if (item.AllowancecPerDay == null) {
      var workingDistrict = this.initModel.DistrictList.find(
        (x) => x.Id === item.WorkingDistrictId
      );
      item.AllowancecPerDay = workingDistrict.IsMajor
        ? this.initModel?.TADAList[0].TotalAllownaceMajor
        : this.initModel?.TADAList[0].TotalAllownaceMinor;
    }
    return this.fb.group({
      Id: isDuplicate ? 0 : item.Id,
      IsTravelAllowance: isDuplicate ? false : item.IsTravelAllowance,
      IsFoodAllowance: isDuplicate ? false : item.IsFoodAllowance,
      WorkingDistrictId: item.WorkingDistrictId,
      WorkingDistrictType: item.WorkingDistrictType,
      LocationFromDistrictId: item.LocationFromDistrictId,
      LocationToDistrictId: item.LocationToDistrictId,
      TaskTypeId: item.TaskTypeId,
      TaskTypeDetailsId: item.TaskTypeDetailsId,
      StartDate: item.StartDate,
      EndDate: item.EndDate,
      NoOfDays: item.NoOfDays,
      AllowancecPerDay: isDuplicate ? 0 : item.AllowancecPerDay,
      Total: isDuplicate ? 0 : item.Total,
      TotalCost: isDuplicate ? 0 : item.TotalCost,
      IsActive: item.IsActive,
      BreakFastAllowance: isDuplicate ? 0 : item.BreakFastAllowance,
      LunchAllowance: isDuplicate ? 0 : item.LunchAllowance,
      SnacksAllowance: isDuplicate ? 0 : item.SnacksAllowance,
      DinnerAllowance: isDuplicate ? 0 : item.DinnerAllowance,
      NightAllowance: isDuplicate ? 0 : item.NightAllowance,
      HotelAllowance: isDuplicate ? 0 : item.HotelAllowance,
      LocalTravelAllowance: isDuplicate ? 0 : item.LocalTravelAllowance,
      TotalBreakFast: isDuplicate ? 0 : item.TotalBreakFast,
      TotalLunch: isDuplicate ? 0 : item.TotalLunch,
      TotalSnacks: isDuplicate ? 0 : item.TotalSnacks,
      TotalDinner: isDuplicate ? 0 : item.TotalDinner,
      TotalNight: isDuplicate ? 0 : item.TotalNight,
      TotalHotelStay: isDuplicate ? 0 : item.TotalHotelStay,
      TotalLocalTravel: isDuplicate ? 0 : item.TotalLocalTravel,
      ActualBreakFast: isDuplicate ? 0 : item.ActualBreakFast,
      ActualLunch: isDuplicate ? 0 : item.ActualLunch,
      ActualSnacks: isDuplicate ? 0 : item.ActualSnacks,
      ActualDinner: isDuplicate ? 0 : item.ActualDinner,
      ActualNight: isDuplicate ? 0 : item.ActualNight,
      ActualHotelStay: isDuplicate ? 0 : item.ActualHotelStay,
      ActualLocalTravel: isDuplicate ? 0 : item.ActualLocalTravel,
      TotalBreakFastAmount: isDuplicate ? 0 : item.TotalBreakFastAmount,
      TotalLunchAmount: isDuplicate ? 0 : item.TotalLunchAmount,
      TotalSnacksAmount: isDuplicate ? 0 : item.TotalSnacksAmount,
      TotalDinnerAmount: isDuplicate ? 0 : item.TotalDinnerAmount,
      TotalNightAmount: isDuplicate ? 0 : item.TotalNightAmount,
      TotalHotelStayAmount: isDuplicate ? 0 : item.TotalHotelStayAmount,
      TotalLocalTravelAmount: isDuplicate ? 0 : item.TotalLocalTravelAmount,
      TotalDistance: isDuplicate ? 0 : item.TotalDistance,
      SiteCode: isDuplicate ? "" : item.SiteCode,
      TravelCost: isDuplicate ? 0 : item.TravelCost,
      EntertainmentCost: isDuplicate ? 0 : item.EntertainmentCost,
      MiscellaneousCost: isDuplicate ? 0 : item.MiscellaneousCost,
      LocalConveyanceAmount: isDuplicate ? 0 : item.LocalConveyanceAmount,
      DeductionRemarks: isDuplicate ? 0 : item.DeductionRemarks,
      IsStayOnHotel: isDuplicate ? false : item.IsStayOnHotel,
      HasOwnAccomodation: isDuplicate ? 0 : item.HasOwnAccomodation,
      HasLocalConveyance: isDuplicate ? 0 : item.HasLocalConveyance,
      IsOfficeVehicleUsed: isDuplicate ? 0 : item.IsOfficeVehicleUsed,
      TotalOfficeVehicle: isDuplicate ? 0 : item.TotalOfficeVehicle,
      TotalLocalConveyance: isDuplicate ? 0 : item.TotalLocalConveyance,
      FileId: isDuplicate ? null : item.FileId,
      FileName: isDuplicate ? "" : item.FileName,
      FileType: isDuplicate ? "" : item.FileType,
      FilePath: isDuplicate ? "" : item.FilePath,
    });
  }
  deleteItems(idx: number) {
    const control = this.basicForm.get("Items") as FormArray;
    if (control.controls[idx].get("Id")?.value == null) {
      this.taItems.removeAt(idx);
    } else {
      control.controls[idx].get("IsActive")?.setValue(false);
    }
    var totalCost = 0;
    var items = this.taItems.value;
    items.forEach((element) => {
      if (element.IsActive == true) {
        totalCost += Number(element.TotalCost);
      }
    });
    this.totalSettlement = totalCost;
    this.totalSettlementStr = this.totalSettlement.toLocaleString();
  }
  onInitalizeBankAccount(component: BankAccountComponent) {
    this.bankAccountComponent = component;
  }
  onSubmit() {
    var items = this.taItems.value;
    var isvalid = true;
    var isCalculated = true;
    items.forEach((element) => {
      if (
        (element.WorkingDistrictId <= 0 ||
          element.LocationFromDistrictId <= 0 ||
          element.LocationToDistrictId <= 0 ||
          element.TaskTypeId <= 0 ||
          element.TaskTypeDetailsId <= 0 ||
          element.StartDate == null ||
          element.EndDate == null) &&
        element.IsActive
      ) {
        isvalid = false;
        return;
      }
    });
    if (!isvalid) {
      this.toaster.error("Please fill required field", "error");
      return;
    }
    items.forEach((element) => {
      if (
        (element.TotalCost == 0 || element.TotalCost == undefined) &&
        element.IsActive
      ) {
        isCalculated = false;
        return;
      }
    });
    if (!isCalculated) {
      this.toaster.error("Please Complete Calculation", "error");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You want to submit, Please Upload necessary document(Refund,Bus Ticket,Local Conveyance Sheet, Purchase Voucher etc..)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, submit it!",
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        let inv = this.packageForm();
        this.subSink.sink = this.taSettlementService
          .create(inv)
          .subscribe((x) => {
            if (x.Success) {
              this.loading = false;
              this.toaster.success("saved successfully");
              this.router.navigate(["/taSettlement/list"]);
            } else {
              this.loading = false;
              this.toaster.error(x.Message);
            }
          });
      }
    });
  }
  packageForm(): FormData {
    let bankAccountModel = this.bankAccountComponent.value;
    let data = new TASettlement();
    data = new TASettlement({
      Id: 0,
      UserId: this.requesterUserId,
      SupervisorId: this.supervisorFC.value,
      SupervisorName: this.supervisorNameFC.value,
      TotalAmount: 0,
      TotalCost: this.totalSettlement,
      TotalDue: 0,
      TotalRefund: 0,
      DepositedRefund: 0,
      DepositedDue: 0,
      Balance: 0,
      AccountHolderName: bankAccountModel.AccountHolderName,
      AccountHolderCompany: bankAccountModel.AccountHolderCompany,
      BankName: bankAccountModel.BankName,
      AccountNo: bankAccountModel.AccountNo,
      AccountType: bankAccountModel.AccountType,
      RouterNo: bankAccountModel.RouterNo,
      Condition: bankAccountModel.Condition,
      MobileNo: bankAccountModel.MobileNo,
      Items: this.GeneratetaItems(this.taItems.value),
    });
    return this.modelToFormData(data);
  }
  modelToFormData(data: TASettlement): FormData {
    const formData = new FormData();
    let modelData = JSON.stringify(data);
    formData.set("model", modelData);
    this.ChildFiles.forEach((x) => {
      if (x.IsNew) {
        formData.append("files", x.File, x.UploadFileIdWithFileName);
      }
    });
    return formData;
  }
  GeneratetaItems(taItems: any) {
    var itemList: TASettlementDetailsItem[] = [];
    taItems.forEach((x) => {
      itemList.push({
        Id: 0,
        IsTravelAllowance: false,
        IsFoodAllowance: true,
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
        Total: 0,
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
        TotalDistance: x.TotalDistance,
        SiteCode: x.SiteCode,
        TravelCost: x.TravelCost,
        EntertainmentCost: x.EntertainmentCost,
        MiscellaneousCost: x.MiscellaneousCost,
        LocalConveyanceAmount: x.LocalConveyanceAmount,
        DeductionRemarks: x.DeductionRemarks,
        IsNightStay: x.IsNightStay,
        IsStayOnHotel: x.IsStayOnHotel,
        HasOwnAccomodation: x.HasOwnAccomodation,
        HasLocalConveyance: x.HasLocalConveyance,
        IsOfficeVehicleUsed: x.IsOfficeVehicleUsed,
        TotalOfficeVehicle: x.TotalOfficeVehicle,
        TotalLocalConveyance: x.TotalLocalConveyance,
        FileId: x.FileId,
        FileName: x.FileName,
        FileType: x.FileType,
        FilePath: x.FilePath,
      });
    });
    return itemList;
  }
  onChangeWorkingDistrict(event: any, index: number) {
    if (this.aModel?.Id > 0) {
      this.perDayAllowance = this.aModel?.TADAList[0];
    } else {
      this.perDayAllowance = this.initModel.TADAList.find(
        (x) => x.DesignationId === this.portalUserViewModel.DesignationId
      );
    }
    var workingDistrict = this.initModel.DistrictList.find(
      (x) => x.Id === event.Id
    );
    var allowanceAmount = 0;
    if (
      this.initModel.OfficeLocationDistrictId == event.Id &&
      this.portalUserViewModel.HrId != "EZSTL194"
    ) {
      allowanceAmount = workingDistrict.IsMajor
        ? this.perDayAllowance?.TotalFoodMajor
        : this.perDayAllowance?.TotalFoodMinor;
    } else {
      allowanceAmount = workingDistrict.IsMajor
        ? this.perDayAllowance?.TotalAllownaceMajor
        : this.perDayAllowance?.TotalAllownaceMinor;
    }
    this.lastLocationFromId = event.Id;
    const control = this.basicForm.get("Items") as FormArray;
    control.controls[index]
      .get("WorkingDistrictType")
      ?.setValue(workingDistrict.IsMajor ? "Major City" : "Minor City");
    control.controls[index].get("LocationToDistrictId")?.setValue(event.Id);
    control.controls[index].get("AllowancecPerDay")?.setValue(allowanceAmount);
  }
  onChangeDate(index: number) {
    const control = this.basicForm.get("Items") as FormArray;
    control.controls[index].get("TotalCost")?.setValue(0);
  }
  public foodAllowanceCalculation(index: number) {
    const control = this.basicForm.get("Items") as FormArray;
    var startDate = new Date(control.controls[index].get("StartDate")?.value);
    var endDate = new Date(control.controls[index].get("EndDate")?.value);
    var dayDiff = Math.floor(
      (Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) -
        Date.UTC(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
    if (dayDiff < 0) {
      this.toaster.info(
        "End date must be greater or equal to start date",
        "info"
      );
      return;
    } else if (dayDiff >= 0) {
      var totalDay = dayDiff + 1;
      control.controls[index].get("NoOfDays")?.setValue(totalDay);
    }
    var itemObj = control.value[index];
    const modalRef = this.modalService.open(FoodAllowanceCalculationComponent, {
      size: "xl",
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.ItemObj = itemObj;
    modalRef.componentInstance.initModel = this.initModel;
    modalRef.componentInstance.CanEdit = true;
    modalRef.result.then(
      (result) => {
        if (result) {
          control.controls[index]
            .get("TotalDistance")
            ?.setValue(result.TotalDistance);
          control.controls[index].get("SiteCode")?.setValue(result.SiteCode);
          control.controls[index]
            .get("LocalConveyanceAmount")
            ?.setValue(result.LocalConveyanceAmount);

          control.controls[index]
            .get("TravelCost")
            ?.setValue(result.TravelCost);
          control.controls[index]
            .get("EntertainmentCost")
            ?.setValue(result.EntertainmentCost);
          control.controls[index]
            .get("MiscellaneousCost")
            ?.setValue(result.MiscellaneousCost);

          control.controls[index]
            .get("IsNightStay")
            ?.setValue(result.IsNightStay);
          control.controls[index]
            .get("DeductionRemarks")
            ?.setValue(result.DeductionRemarks);

          control.controls[index]
            .get("BreakFastAllowance")
            ?.setValue(result.BreakFastAllowance);
          control.controls[index]
            .get("LunchAllowance")
            ?.setValue(result.LunchAllowance);
          control.controls[index]
            .get("SnacksAllowance")
            ?.setValue(result.SnacksAllowance);
          control.controls[index]
            .get("DinnerAllowance")
            ?.setValue(result.DinnerAllowance);
          control.controls[index]
            .get("NightAllowance")
            ?.setValue(result.NightAllowance);

          control.controls[index]
            .get("TotalBreakFast")
            ?.setValue(result.TotalBreakFast);
          control.controls[index]
            .get("TotalLunch")
            ?.setValue(result.TotalLunch);
          control.controls[index]
            .get("TotalSnacks")
            ?.setValue(result.TotalSnacks);
          control.controls[index]
            .get("TotalDinner")
            ?.setValue(result.TotalDinner);
          control.controls[index]
            .get("TotalNight")
            ?.setValue(result.TotalNight);

          control.controls[index]
            .get("ActualBreakFast")
            ?.setValue(result.ActualBreakFast);
          control.controls[index]
            .get("ActualLunch")
            ?.setValue(result.ActualLunch);
          control.controls[index]
            .get("ActualSnacks")
            ?.setValue(result.ActualSnacks);
          control.controls[index]
            .get("ActualDinner")
            ?.setValue(result.ActualDinner);
          control.controls[index]
            .get("ActualNight")
            ?.setValue(result.ActualNight);

          control.controls[index]
            .get("TotalBreakFastAmount")
            ?.setValue(result.TotalBreakFastAmount);
          control.controls[index]
            .get("TotalLunchAmount")
            ?.setValue(result.TotalLunchAmount);
          control.controls[index]
            .get("TotalSnacksAmount")
            ?.setValue(result.TotalSnacksAmount);
          control.controls[index]
            .get("TotalDinnerAmount")
            ?.setValue(result.TotalDinnerAmount);
          control.controls[index]
            .get("TotalNightAmount")
            ?.setValue(result.TotalNightAmount);

          control.controls[index].get("TotalCost")?.setValue(result.TotalCost);

          control.controls[index].get("IsTravelAllowance")?.setValue(false);
          control.controls[index].get("IsFoodAllowance")?.setValue(true);
          var totalCost = 0;
          var items = this.taItems.value;
          items.forEach((element) => {
            if (element.IsActive == true) {
              totalCost += Number(element.TotalCost);
            }
          });
          this.totalSettlement = totalCost;
          this.totalSettlementStr = this.totalSettlement.toLocaleString();
        }
      },
      (reason) => {
        console.log("Dismissed action: " + reason);
      }
    );
  }
  duplicateRow(index: number) {
    const control = this.basicForm.get("Items") as FormArray;
    (this.basicForm.get("Items") as FormArray).push(
      this.patchItem(control.controls[index].value, true)
    );
  }
  removeLineAttachment(index: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "this attachement is permanently deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        const control = this.basicForm.get("Items") as FormArray;
        control.controls[index].get("FileId")?.setValue(null);
        control.controls[index].get("FileName")?.setValue("");
        control.controls[index].get("FileType")?.setValue("");
        control.controls[index].get("FilePath")?.setValue("");
      }
    });
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
      this.ChildFile.UploadFileIdWithFileName =
        files.item(0).name + ",#&," + this.uploadFileId;
      const currentDate = new Date();
      const control = this.basicForm.get("Items") as FormArray;
      control.controls[index].get("FileId")?.setValue(this.uploadFileId);
      control.controls[index].get("FileName")?.setValue(files[0].name);
      control.controls[index].get("FileType")?.setValue(files[0].type);
      control.controls[index]
        .get("FilePath")
        ?.setValue(currentDate.getMilliseconds() + "_" + files[0].name);
    }
    this.isChildFileSizeExceed = false;
  }
}
