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

@Component({
  selector: "app-edit-settlement",
  templateUrl: "./edit-settlement.component.html",
})
export class EditSettlementComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  taId: number;
  SettlementFiles: Array<TASettlementFileViewModel> =
    new Array<TASettlementFileViewModel>();
  basicForm: FormGroup;
  innerWidth: any;
  totalAllowance: number;
  totalAllowanceStr: string;
  isDue: boolean = false;
  isRefund: boolean = false;
  DateRangeList: any = [];
  totalDueStr: string;
  totalRefundStr: string;
  totalDue: number = 0;
  totalRefund: number = 0;
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
  initModel: TASettlementSearchModel;
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
    private activatedRoute: ActivatedRoute,
    private taSettlementService: TASettlementService,
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
  public uploader: FileUploader = new FileUploader({
    maxFileSize: FileTypeSize.fileSize,
    allowedMimeType: FileTypeSize.fileTypes,
  });
  public onFileSelected(files: any) {
    var isSameFile = false;
    if (this.isFileSizeExceed) {
      this.isFileSizeExceed = !this.isFileSizeExceed;
      return;
    } else {
      for (var i = 0; i < files.length; i++) {
        var totalSize = this.totalFileSize + files.item(i).size;
        if (totalSize > FileTypeSize.fileSize) {
          this.toaster.info("Total file size is more than 10 MB");
          return;
        } else {
          this.SettlementFile = new TASettlementFileViewModel();
          this.SettlementFile.File = files.item(i);
          this.SettlementFile.IsNew = true;
          this.SettlementFile.FileName = files.item(i).name;
          this.SettlementFile.FileSize = files.item(i).size;
          this.SettlementFiles.forEach((x) => {
            if (x.FileName == this.SettlementFile.FileName) {
              isSameFile = true;
            }
          });
          if (!isSameFile) {
            this.SettlementFiles.push(this.SettlementFile);
            this.totalFileSize = this.totalFileSize + files.item(i).size;
          }
        }
      }
    }
  }
  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.createForm();
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
    this.isFinanceCheck = this.portalUserViewModel.Is_Finance_Check;
    this.isFinanceComplete = this.portalUserViewModel.Is_Finance_Complete;
    this._fetchData();
    if (this.portalUserViewModel.SupervisorId.length > 0)
      this.supervisorLevelName =
        this.portalUserViewModel.SupervisorId[0]["Text"] == "True"
          ? "Approver"
          : this.supervisorLevelName;
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
  }
  get taItems(): FormArray {
    return this.basicForm.get("Items") as FormArray;
  }
  get depositedRefundFormControl() {
    return this.basicForm ? this.basicForm.get("DepositedRefund") : null;
  }
  get depositedDueFormControl() {
    return this.basicForm ? this.basicForm.get("DepositedDue") : null;
  }
  get balanceFormControl() {
    return this.basicForm ? this.basicForm.get("Balance") : null;
  }
  _fetchData = () => {
    this.loading = true;
    this.subSink.sink = this.taSettlementService.getById(this.reqId).subscribe(
      (res) => {
        if (res.Success) {
          this.aModel = res.Data;
          this.initModel = res.Data.InitModel;
          this.totalAllowance =
            this.aModel?.TASettlementDetailsItemViewModel?.reduce(
              (sum, item) => sum + item.Total,
              0
            );
          this.totalSettlement =
            this.aModel?.TASettlementDetailsItemViewModel?.reduce(
              (sum, item) => sum + item.TotalCost,
              0
            );
          this.totalAllowanceStr = this.totalAllowance.toLocaleString();
          this.totalSettlementStr = this.totalSettlement.toLocaleString();
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
      AllowancecPerDay: item.AllowancecPerDay,
      Total: isDuplicate ? 0 : item.Total,
      TotalCost: isDuplicate ? 0 : item.TotalCost,
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
      HasOwnAccomodation: item.HasOwnAccomodation,
      HasLocalConveyance: item.HasLocalConveyance,
      IsOfficeVehicleUsed: item.IsOfficeVehicleUsed,
      TotalOfficeVehicle: item.TotalOfficeVehicle,
      TotalLocalConveyance: item.TotalLocalConveyance,
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
    if (Number(this.totalAllowance) < Number(this.totalSettlement)) {
      this.isDue = true;
      this.isRefund = false;
      this.totalDue =
        Number(this.totalSettlement) - Number(this.totalAllowance);
      this.totalDueStr = this.totalDue.toLocaleString();
      this.totalRefund = 0;
    } else {
      this.isDue = false;
      this.isRefund = true;
      this.totalDue = 0;
      this.totalRefund =
        Number(this.totalAllowance) - Number(this.totalSettlement);
      this.totalRefundStr = this.totalRefund.toLocaleString();
    }
  }
  removeFile(index: number) {
    this.totalFileSize =
      this.totalFileSize - this.SettlementFiles[index].FileSize;
    this.SettlementFiles.splice(index, 1);
  }
  deleteExistingAttachment(index: number, id: number) {
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
        this.subSink.sink = this.taSettlementService
          .deleteExistingAttachment(id)
          .subscribe((x) => {
            if (x.Success) {
              this.aModel?.UploadedFiles.splice(index, 1);
              this.toaster.success("deleted successfully");
            } else {
              this.toaster.error(x.Message);
            }
          });
      }
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
    this.requesterUserId = aModel.RequesterUserId;
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
      (this.basicForm.get("Items") as FormArray).push(this.patchItem(x, false));
    });
    var advItems = this.taItems.value;
    var totalAdvance = advItems.reduce((sum, item) => sum + item.Total, 0);
    this.totalAllowance = Number(totalAdvance);
    this.totalAllowanceStr = totalAdvance.toLocaleString();
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
    var totalCost = this.taItems.value.reduce(
      (sum, item) => sum + item.TotalCost,
      0
    );
    if (Number(this.totalAllowance) < Number(totalCost)) {
      this.isDue = true;
      this.isRefund = false;
      this.totalDue = Number(totalCost) - Number(this.totalAllowance);
      this.totalDueStr = this.totalDue.toLocaleString();
      this.totalRefund = 0;
    } else {
      this.isDue = false;
      this.isRefund = true;
      this.totalDue = 0;
      this.totalRefund = Number(this.totalAllowance) - Number(totalCost);
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
    if (this.balanceFormControl.value != 0 && this.isRefund) {
      this.toaster.error("Balance Should be zero", "error");
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
          .update(inv)
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
    let data = new TASettlement();
    this.SettlementFiles.forEach((x) => {
      if (x.IsNew) this.fileList.push(x.File);
    });
    data = new TASettlement({
      Id: this.aModel.Id,
      UserId: this.requesterUserId,
      TotalAmount: this.totalAllowance,
      TotalCost: this.totalSettlement,
      TotalDue: this.totalDue,
      TotalRefund: this.totalRefund,
      DepositedRefund: this.depositedRefundFormControl.value,
      DepositedDue: this.depositedDueFormControl.value,
      Balance: this.balanceFormControl.value,
      Items: this.GeneratetaItems(this.taItems.value),
      UploadedFiles: this.SettlementUploadedFiles,
      Files: this.fileList,
    });
    return this.modelToFormData(data);
  }
  modelToFormData(data: TASettlement): FormData {
    const formData = new FormData();
    let modelData = JSON.stringify(data);
    formData.set("model", modelData);
    for (let file of data.Files)
      formData.append("refundFiles", file, file.name);
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
  onChangeDate(index: number) {
    const control = this.basicForm.get("Items") as FormArray;
    control.controls[index].get("TotalCost")?.setValue(0);
  }
  public travelAllowanceCalculation(index: number) {
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
    const modalRef = this.modalService.open(
      TravelAllowanceCalculationComponent,
      { size: "xl", backdrop: "static", keyboard: false }
    );
    modalRef.componentInstance.ItemObj = itemObj;
    modalRef.componentInstance.initModel = this.initModel;
    modalRef.componentInstance.CanEdit = true;
    modalRef.result.then(
      (result) => {
        if (result) {
          control.controls[index]
            .get("IsStayOnHotel")
            ?.setValue(result.IsStayOnHotel);
          control.controls[index]
            .get("HasOwnAccomodation")
            ?.setValue(result.HasOwnAccomodation);
          control.controls[index]
            .get("HasLocalConveyance")
            ?.setValue(result.HasLocalConveyance);
          control.controls[index]
            .get("TotalLocalConveyance")
            ?.setValue(result.TotalLocalConveyance);
          control.controls[index]
            .get("LocalConveyanceAmount")
            ?.setValue(result.LocalConveyanceAmount);

          control.controls[index]
            .get("IsOfficeVehicleUsed")
            ?.setValue(result.IsOfficeVehicleUsed);
          control.controls[index]
            .get("TotalOfficeVehicle")
            ?.setValue(result.TotalOfficeVehicle);
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
            .get("HotelAllowance")
            ?.setValue(result.HotelAllowance);
          control.controls[index]
            .get("LocalTravelAllowance")
            ?.setValue(result.LocalTravelAllowance);

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
            .get("ActualHotelStay")
            ?.setValue(result.ActualHotelStay);
          control.controls[index]
            .get("ActualLocalTravel")
            ?.setValue(result.ActualLocalTravel);

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
            .get("TotalHotelStay")
            ?.setValue(result.TotalHotelStay);
          control.controls[index]
            .get("TotalLocalTravel")
            ?.setValue(result.TotalLocalTravel);

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
            .get("TotalHotelStayAmount")
            ?.setValue(result.TotalHotelStayAmount);
          control.controls[index]
            .get("TotalLocalTravelAmount")
            ?.setValue(result.TotalLocalTravelAmount);

          control.controls[index].get("TotalCost")?.setValue(result.TotalCost);

          control.controls[index].get("IsTravelAllowance")?.setValue(true);
          control.controls[index].get("IsFoodAllowance")?.setValue(false);

          var totalCost = 0;
          var items = this.taItems.value;
          items.forEach((element) => {
            if (element.IsActive == true) {
              totalCost += Number(element.TotalCost);
            }
          });
          this.totalSettlement = totalCost;
          this.totalSettlementStr = this.totalSettlement.toLocaleString();
          if (Number(this.totalAllowance) < Number(this.totalSettlement)) {
            this.isDue = true;
            this.isRefund = false;
            this.totalDue =
              Number(this.totalSettlement) - Number(this.totalAllowance);
            this.totalDueStr = this.totalDue.toLocaleString();
            this.totalRefund = 0;
          } else {
            this.isDue = false;
            this.isRefund = true;
            this.totalDue = 0;
            this.totalRefund =
              Number(this.totalAllowance) - Number(this.totalSettlement);
            this.totalRefundStr = this.totalRefund.toLocaleString();
          }
          this.balanceCalculation();
        }
      },
      (reason) => {
        console.log("Dismissed action: " + reason);
      }
    );
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
          if (Number(this.totalAllowance) < Number(this.totalSettlement)) {
            this.isDue = true;
            this.isRefund = false;
            this.totalDue =
              Number(this.totalSettlement) - Number(this.totalAllowance);
            this.totalDueStr = this.totalDue.toLocaleString();
            this.totalRefund = 0;
          } else {
            this.isDue = false;
            this.isRefund = true;
            this.totalDue = 0;
            this.totalRefund =
              Number(this.totalAllowance) - Number(this.totalSettlement);
            this.totalRefundStr = this.totalRefund.toLocaleString();
          }
          this.balanceCalculation();
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
  balanceCalculation() {
    if (this.isRefund) {
      this.balanceFormControl.setValue(
        Number(this.totalRefund) - Number(this.depositedRefundFormControl.value)
      );
    } else {
      this.balanceFormControl.setValue(
        Number(this.totalDue) - Number(this.depositedDueFormControl.value)
      );
    }
  }
}
