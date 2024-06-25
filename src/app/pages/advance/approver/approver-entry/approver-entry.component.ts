import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { UserModel } from "../../../../core/models/mastersetup-model/user.model";
import { PortalUserViewModel } from "src/app/core/models/auth.models";
import { ApproverGroupModel } from "src/app/core/models/group-model/approverGroup.model";
import { AdvanceApproverMatrixModel } from "src/app/core/models/advance-model/advanceApproverMatrix.model";
import { AdvanceViewModel } from "../../../../core/models/advance-model/advance.model";
import { AdvanceRunningApproverMatrixSupervisorViewModel } from "src/app/core/models/advance-model/advanceRunningApproverMatrix.model";
import { AdvanceService } from "src/app/core/services/Advance/advance.service";
import { AdvanceRunningApproverMatrixService } from "src/app/core/services/Advance/advanceRunningApproverMatrix.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApproverSubGroupUserService } from "src/app/core/services/ApproverGroup/approverSubGroupUser.service";
import { ApproverSubGroupUsersViewModel } from "src/app/core/models/group-model/approver.subGroupUser.model";
import { GroupUserListComponent } from "src/app/pages/adminsetup/groupUser/group-user-list/group-user-list.component";
import { BaseComponent } from "src/app/core/base/component/base/base.component";
import { BaseService } from "src/app/core/base/base.service";
import { BankAccountComponent } from "src/app/shared/ui/bank-account/bank-account.component";
import { DateChangeHistoryComponent } from "../date-change-history/date-change-history.component";
import { ApproverActionFormComponent } from "src/app/shared/ui/approver-action-form/approver-action-form.component";
import { RunningApproverMatrixViewModel } from "src/app/core/models/runningApproverMatrix.model";

@Component({
  selector: "app-approver-entry",
  templateUrl: "./approver-entry.component.html",
  styleUrls: ["./approver-entry.component.scss"],
})
export class AdvanceApproverEntryComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  subSink: SubSink;
  formGroup: FormGroup;
  dateFormGroup: FormGroup;
  advanceViewModel: AdvanceViewModel;
  bankFormGroup: FormGroup;
  advanceRequisitionId: string;
  totalExpense: string;
  finVoucherNo: string;
  isCollapsed: boolean = false;
  isProjectShow: boolean = false;
  isFinanceCheck: boolean = false;
  isFinanceComplete: boolean = false;
  isTaskTypedetailsShow: boolean = false;
  publicId: string;
  approveruserModel: UserModel[] = [];
  userModel: UserModel;
  approverTypeList: ApproverGroupModel[];
  groupList: AdvanceApproverMatrixModel[];
  approverRunningMatrixList: RunningApproverMatrixViewModel[] = [];
  portalUserViewModel: PortalUserViewModel;
  advanceRunningApproverMatrixModel: AdvanceRunningApproverMatrixSupervisorViewModel;
  approverSubGroupUserModel: ApproverSubGroupUsersViewModel[] = [];
  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  loading: boolean = false;
  isOutStationSelected: boolean = false;
  recommenderFormGroup: FormGroup;
  ChangeAdvanceDate: boolean = false;
  supervisorLevelName: string = "Bill Reviewer";
  tentativeSettlementMaxDate: object = new Date();
  @ViewChild("bankAccountComponent", { static: true })
  bankAccountComponent: BankAccountComponent;
  @ViewChild("approverActionFormComponent", { static: true })
  approverActionFormComponent: ApproverActionFormComponent;
  profilePicAsByteArrayAsBase64: any;

  constructor(
    private advanceRunningApproverMatrixService: AdvanceRunningApproverMatrixService,
    private router: Router,
    private modalService: NgbModal,
    toaster: ToastrService,
    baseService: BaseService,
    private approverSubGroupUserService: ApproverSubGroupUserService,
    private advanceService: AdvanceService,
    private entryFormBuilder: FormBuilder
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    if (cn && cn.extras.state) {
      this.advanceRequisitionId = cn.extras.state.id;
    }
  }

  ngOnInit() {
    this.createForm();
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
    this.isFinanceCheck = this.portalUserViewModel.Is_Finance_Check;
    this.isFinanceComplete = this.portalUserViewModel.Is_Finance_Complete;
    if (this.portalUserViewModel.SupervisorId.length > 0) {
      if (this.portalUserViewModel.SupervisorId[0]["Text"] == "True")
        this.supervisorLevelName = "Approver";
    }
    this.getDetails();
  }

  public getDetails() {
    this.loading = true;
    this.subSink.sink = this.advanceService
      .getByIdforApprover(this.advanceRequisitionId)
      .subscribe(
        (res) => {
          if (res.Success) {
            this.advanceViewModel = res.Data;
            if (this.advanceViewModel.VoucherNo != null) {
              this.approverActionFormComponent.voucherNoFC.setValue(
                this.advanceViewModel.VoucherNo
              );
            }
            this.isTaskTypedetailsShow =
              this.advanceViewModel.TaskTypeDetailsName != "" &&
              this.advanceViewModel.TaskTypeDetailsName != null
                ? true
                : false;

            this.aRRequiredDateFormControl.setValue(
              this.stringToNgbDate(this.advanceViewModel.ARRequiredDate)
            );
            this.tentativeSettlementDateFormControl.setValue(
              this.stringToNgbDate(
                this.advanceViewModel.TentativeSettlementDate
              )
            );
            this.bankAccountComponent.value = this.advanceViewModel;
            this.totalExpense = this.advanceViewModel.AdvanceDetailsItem.reduce(
              (sum, item) => sum + item.AdvanceAmount,
              0
            ).toLocaleString();

            this.approvedStatusCount =
              this.advanceViewModel?.RunningApproverMatrixViewModel.filter(
                (t) => t["StatusName"] == "Approved"
              ).length;
            this.pendingStatusCount =
              this.advanceViewModel?.RunningApproverMatrixViewModel.filter(
                (t) => t["StatusName"] == "Pending"
              ).length;
            this.dueStatusCount =
              this.advanceViewModel?.RunningApproverMatrixViewModel.filter(
                (t) => t["StatusName"] == "Due"
              ).length;
            this.loading = false;
            if (this.advanceViewModel.ProfilePicUrl) {
              this.profilePicAsByteArrayAsBase64 =
                "data:image/png;base64," + this.advanceViewModel.ProfilePicUrl;
            } else {
              this.profilePicAsByteArrayAsBase64 =
                "assets/images/users/avatar-1.jpg";
            }
            if (this.isFinanceCheck) {
              var dt = new Date();
              var year = dt.getFullYear().toString().substring(2);
              var month = (dt.getMonth() + 1).toString().padStart(2, "0");
              var day = dt.getDate().toString().padStart(2, "0");
              this.finVoucherNo = "JV_" + year + "" + month + "" + day + "/";
              this.approverActionFormComponent.voucherNoFC.setValue(
                this.finVoucherNo
              );
            }
            if (this.advanceViewModel?.Is_Recommender_Group_Pending) {
              this.recommenderFC.setValue(
                this.advanceViewModel?.RecommenderUsers[0].Id
              );
            }
          } else {
            this.toaster.error(res["Message"], "Error");
            this.router.navigate(["/advances/pending-list"]);
            this.loading = false;
          }
        },
        (err) => {
          this.toaster.error(err, "Error");
          this.router.navigate(["/advances/pending-list"]);
          this.loading = false;
        }
      );
  }
  get aRRequiredDateFormControl() {
    return this.dateFormGroup ? this.dateFormGroup.get("ARRequiredDate") : null;
  }

  get tentativeSettlementDateFormControl() {
    return this.dateFormGroup
      ? this.dateFormGroup.get("TentativeSettlementDate")
      : null;
  }

  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }

  createForm() {
    this.formGroup = this.entryFormBuilder.group({
      ApproverRemarks: [""],
    });
    this.dateFormGroup = this.entryFormBuilder.group({
      ARRequiredDate: [new Date()],
      TentativeSettlementDate: [new Date()],
    });
    this.bankFormGroup = this.entryFormBuilder.group({
      UserBankDetails: [""],
    });
    this.recommenderFormGroup = this.entryFormBuilder.group({
      RecommenderId: [null, Validators.required],
    });
  }

  get recommenderFC() {
    return this.recommenderFormGroup
      ? this.recommenderFormGroup.get("RecommenderId")
      : null;
  }
  get approverRemarksFC() {
    return this.formGroup ? this.formGroup.get("ApproverRemarks") : null;
  }

  onSubmit() {
    if (
      this.advanceViewModel?.Is_Recommender_Group_Pending &&
      this.recommenderFormGroup.invalid
    ) {
      this.toaster.error("Please add a Recommender", "error");
      return;
    }
    if (
      (!this.approverRemarksFC.value.VoucherNo ||
        this.approverRemarksFC.value.VoucherNo == this.finVoucherNo) &&
      this.isFinanceCheck
    ) {
      this.toaster.error("Please Provide a Voucher No");
      return;
    }
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return null;
    }
    this.loading = true;
    let data = this.prepareApproverData();
    this.subSink.sink = this.advanceRunningApproverMatrixService
      .saveAsApproverApproved(data)
      .subscribe((x) => {
        if (x.Success) {
          this.loading = false;
          this.toaster.success("saved successfully");
          this.router.navigate(["/advances/pending-list"]);
        } else {
          this.toaster.error(x.Message);
          this.loading = false;
          this.router.navigate(["/advances/pending-list"]);
        }
      });
  }

  onReturn() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return null;
    }
    this.loading = true;
    let data = this.prepareApproverData();
    this.subSink.sink = this.advanceRunningApproverMatrixService
      .saveAsApproverReturn(data)
      .subscribe((x) => {
        if (x.Success) {
          this.loading = false;
          this.toaster.success("Return successfully");
          this.router.navigate(["/advances/pending-list"]);
        } else {
          this.toaster.error(x.Message);
          this.loading = false;
          this.router.navigate(["/advances/pending-list"]);
        }
      });
  }

  prepareApproverData(): AdvanceRunningApproverMatrixSupervisorViewModel {
    var approverEntry = this.formGroup.value.ApproverRemarks;
    var currentPendingApprover =
      this.advanceViewModel?.RunningApproverMatrixViewModel.find(
        (x) => x.StatusName === "Pending"
      );
    this.advanceRunningApproverMatrixModel =
      new AdvanceRunningApproverMatrixSupervisorViewModel();
    this.advanceRunningApproverMatrixModel.RefId = this.advanceViewModel.Id;
    this.advanceRunningApproverMatrixModel.Remarks = approverEntry.Remarks;
    this.advanceRunningApproverMatrixModel.DepartmentId =
      this.advanceViewModel.DepartmentId;
    this.advanceRunningApproverMatrixModel.WorkFlowId =
      this.advanceViewModel.WorkFlowId;
    this.advanceRunningApproverMatrixModel.UserId = this.portalUserViewModel.Id;
    this.advanceRunningApproverMatrixModel.AdvanceDetailsItemViewModel =
      this.advanceViewModel.AdvanceDetailsItem;
    this.advanceRunningApproverMatrixModel.VoucherNo = approverEntry.VoucherNo;
    this.advanceRunningApproverMatrixModel.Level = currentPendingApprover.Level;
    this.advanceRunningApproverMatrixModel.ApproverSubGroupId =
      currentPendingApprover.ApproverSubGroupId;
    this.advanceRunningApproverMatrixModel.Is_Finance_Check =
      this.portalUserViewModel.Is_Finance_Check;
    this.advanceRunningApproverMatrixModel.ChangeAdvanceDate =
      this.ChangeAdvanceDate;
    this.advanceRunningApproverMatrixModel.ARRequiredDate = this.formatDate(
      this.aRRequiredDateFormControl.value
    );
    this.advanceRunningApproverMatrixModel.TentativeSettlementDate =
      this.formatDate(this.tentativeSettlementDateFormControl.value);
    if (this.advanceViewModel?.Is_Recommender_Group_Pending)
      this.advanceRunningApproverMatrixModel.RecommenderId =
        this.recommenderFC.value;
    return this.advanceRunningApproverMatrixModel;
  }

  showGroupApprover(_advanceDetails: RunningApproverMatrixViewModel) {
    let subGroupId = _advanceDetails.ApproverSubGroupId;
    this.subSink.sink = this.approverSubGroupUserService
      .getApproverGroupInfo(subGroupId)
      .subscribe(
        (res) => {
          this.approverSubGroupUserModel = res;
          this.openModalItem(this.approverSubGroupUserModel);
        },
        (err) => {
          this.toaster.error(err, "Error");
          this.router.navigate(["/advances/pending-list"]);
        }
      );
  }

  public openModalItem(item: ApproverSubGroupUsersViewModel[]) {
    const modalRef = this.modalService.open(GroupUserListComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.aModelList = item;
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
  onInitalizeBankAccount(component: BankAccountComponent) {
    this.bankAccountComponent = component;
  }
  onInitalizeApproverRemarks(component: ApproverActionFormComponent) {
    this.approverActionFormComponent = component;
  }
  setTentativeMaxDate() {
    var year = this.aRRequiredDateFormControl.value.year;
    var month = this.aRRequiredDateFormControl.value.month;
    var day = this.aRRequiredDateFormControl.value.day;
    if (month == 12) {
      year += 1;
      month = 1;
    } else {
      month += 1;
    }
    var obj = { year: year, month: month, day: day };
    this.tentativeSettlementMaxDate = obj;
  }
  viewChangeHistory() {
    const modalRef = this.modalService.open(DateChangeHistoryComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
    });
    modalRef.componentInstance.aModelList =
      this.advanceViewModel?.AdvanceDateChangeHistoryViewModel;
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
