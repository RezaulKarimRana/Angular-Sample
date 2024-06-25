import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PortalUserViewModel } from "../../../../core/models/auth.models";
import { ApproverGroupModel } from "../../../../core/models/group-model/approverGroup.model";
import { ApproverSubGroupUsersViewModel } from "../../../../core/models/group-model/approver.subGroupUser.model";
import { UserProfileService } from "../../../../core/services/MasterSetup/user.service";
import { ApproverSubGroupUserService } from "../../../../core/services/ApproverGroup/approverSubGroupUser.service";
import { GroupUserListComponent } from "../../../../pages/adminsetup/groupUser/group-user-list/group-user-list.component";
import { BaseService } from "src/app/core/base/base.service";
import { BaseComponent } from "src/app/core/base/component/base/base.component";
import { ApproverActionFormComponent } from "src/app/shared/ui/approver-action-form/approver-action-form.component";
import { AdvanceSettlementService } from "src/app/core/services/Settlement/advanceSettlement.service";
import { AdvanceSettlementRunningApproverMatrixService } from "src/app/core/services/Settlement/advanceSettlementRunningApproverMatrix.service";
import { AdvanceSettlementViewModel } from "src/app/core/models/settlement-model/settlement.model";
import { AdvanceSettlementRunningApproverMatrixSupervisorViewModel } from "src/app/core/models/settlement-model/advanceSettlementRunningApproverMatrix.model";
import { RunningApproverMatrixViewModel } from "src/app/core/models/runningApproverMatrix.model";
@Component({
  selector: "app-approver-entry",
  templateUrl: "./approver-entry.component.html",
  styleUrls: ["./approver-entry.component.scss"],
})
export class SettlementApproverEntryComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  subSink: SubSink;
  formGroup: FormGroup;
  recommenderFormGroup: FormGroup;
  advanceViewModel: AdvanceSettlementViewModel;
  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  totalAmount: number = 0;
  totalCost: number = 0;
  totalDue: number = 0;
  totalRefund: number = 0;
  isDue: boolean = false;
  isRefund: boolean = false;
  finVoucherNo: string;
  isAlreadyGroupEntry: boolean = false;
  isFinanceCheck: boolean = false;
  isFinanceComplete: boolean = false;
  isCollapsed: boolean = false;
  isProjectShow: boolean = false;
  isTaskTypedetailsShow: boolean = false;
  publicId: string;
  advanceRunningApproverMatrixModel: AdvanceSettlementRunningApproverMatrixSupervisorViewModel;
  approverTypeList: ApproverGroupModel[];
  approverRunningMatrixList: RunningApproverMatrixViewModel[] = [];
  portalUserViewModel: PortalUserViewModel;
  advanceRunningApproverMatrixSupervisorModel: AdvanceSettlementRunningApproverMatrixSupervisorViewModel;
  approverSubGroupUserModel: ApproverSubGroupUsersViewModel[] = [];
  loading: boolean = false;
  isOutStationSelected: boolean = false;
  profilePicAsByteArrayAsBase64: any;
  sortModel: RunningApproverMatrixViewModel[];
  @ViewChild("approverActionFormComponent", { static: true })
  approverActionFormComponent: ApproverActionFormComponent;

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private advanceService: AdvanceSettlementService,
    private userService: UserProfileService,
    private advanceRunningApproverMatrixService: AdvanceSettlementRunningApproverMatrixService,
    private approverSubGroupUserService: ApproverSubGroupUserService,
    private modalService: NgbModal,
    private entryFormBuilder: FormBuilder
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    if (cn && cn.extras.state) {
      this.publicId = cn.extras.state.id;
    }
  }

  ngOnInit() {
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
    this.isFinanceCheck = this.portalUserViewModel.Is_Finance_Check;
    this.isFinanceComplete = this.portalUserViewModel.Is_Finance_Complete;
    this.getDetails();
    this.createForm();
  }
  public getDetails() {
    this.loading = true;
    this.subSink.sink = this.advanceService
      .getByIdforApprover(this.publicId)
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

            var hasApproverEntry =
              this.advanceViewModel.RunningApproverMatrixViewModel.find(
                (x) => x.ApproverGroupName === "FINANCE CHECK"
              );
            this.isAlreadyGroupEntry = hasApproverEntry != null;
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
            this.totalAmount = this.advanceViewModel?.Items.reduce(
              (sum, item) => sum + item.AdvanceAmount,
              0
            );
            this.totalCost = this.advanceViewModel?.Items.reduce(
              (sum, item) => sum + item.ActualCost,
              0
            );
            this.totalDue = this.advanceViewModel?.TotalDue;
            this.totalRefund = this.advanceViewModel?.TotalRefund;
            this.isDue = this.totalDue > 0;
            this.isRefund = this.totalRefund > 0;
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
              if (this.advanceViewModel?.AcknowledgerUsers.length == 1) {
                this.acknowledgerFC.setValue(
                  this.advanceViewModel?.AcknowledgerUsers[0].Id
                );
              }
              if (this.advanceViewModel?.VerifierUsers.length == 1) {
                this.verifierFC.setValue(
                  this.advanceViewModel?.VerifierUsers[0].Id
                );
              }
              if (this.advanceViewModel?.RecommenderUsers.length == 1) {
                this.recommenderFC.setValue(
                  this.advanceViewModel?.RecommenderUsers[0].Id
                );
              }
            }
          } else {
            this.toaster.error(res["Message"], "Error");
            this.router.navigate(["/advanceSettlement/myapprovals"]);
            this.loading = false;
          }
        },
        (err) => {
          this.toaster.error(err, "Error");
          this.router.navigate(["/advanceSettlement/myapprovals"]);
          this.loading = false;
        }
      );
  }
  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }

  createForm() {
    this.formGroup = this.entryFormBuilder.group({
      ApproverRemarks: [""],
    });
    this.recommenderFormGroup = this.entryFormBuilder.group({
      AcknowledgerId: [null],
      VerifierId: [null],
      RecommenderId: [null, Validators.required],
    });
  }

  get approverRemarksFC() {
    return this.formGroup ? this.formGroup.get("ApproverRemarks") : null;
  }
  get acknowledgerFC() {
    return this.recommenderFormGroup
      ? this.recommenderFormGroup.get("AcknowledgerId")
      : null;
  }
  get verifierFC() {
    return this.recommenderFormGroup
      ? this.recommenderFormGroup.get("VerifierId")
      : null;
  }
  get recommenderFC() {
    return this.recommenderFormGroup
      ? this.recommenderFormGroup.get("RecommenderId")
      : null;
  }
  onSubmit() {
    if (
      this.advanceViewModel?.Is_Recommender_Group_Pending &&
      this.recommenderFormGroup.invalid &&
      this.advanceViewModel?.RecommenderUsers?.length > 0
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
          this.router.navigate(["/advanceSettlement/myapprovals"]);
        } else {
          this.toaster.error(x.Message);
          this.loading = false;
          this.router.navigate(["/advanceSettlement/myapprovals"]);
        }
      });
  }

  onReturn() {
    this.loading = true;
    let data = this.prepareSupervisorData();
    this.subSink.sink = this.advanceRunningApproverMatrixService
      .saveAsApproverReturn(data)
      .subscribe((x) => {
        if (x.Success) {
          this.loading = false;
          this.toaster.success("Return successfully");
          this.router.navigate(["/advanceSettlement/myapprovals"]);
        } else {
          this.toaster.error(x.Message);
        }
      });
  }

  prepareData(): AdvanceSettlementRunningApproverMatrixSupervisorViewModel {
    this.advanceRunningApproverMatrixSupervisorModel =
      new AdvanceSettlementRunningApproverMatrixSupervisorViewModel();
    let approverMatrix = this.advanceViewModel.RunningApproverMatrixViewModel;
    approverMatrix.forEach((x) => {
      let model = new RunningApproverMatrixViewModel();
      (model.Id = x.Id),
        (model.Level = x.Level),
        (model.RefId = this.advanceViewModel.Id),
        (model.ApproverGroupId = x.ApproverGroupId),
        (model.ApproverSubGroupId = x.ApproverSubGroupId),
        (model.ApproverGroupName = x.ApproverGroupName),
        (model.UserId = x.UserId),
        (model.DepartmentId = this.portalUserViewModel.DepartmentId),
        (model.WorkFlowId = x.WorkFlowId);
      this.approverRunningMatrixList.push(model);
    });
    let data = this.prepareSupervisorData();
    data.RunningApproverMatrixViewModel = this.approverRunningMatrixList;
    return this.advanceRunningApproverMatrixSupervisorModel;
  }

  prepareSupervisorData(): AdvanceSettlementRunningApproverMatrixSupervisorViewModel {
    var approverEntry = this.formGroup.value.ApproverRemarks;

    this.advanceRunningApproverMatrixSupervisorModel =
      new AdvanceSettlementRunningApproverMatrixSupervisorViewModel();
    this.advanceRunningApproverMatrixSupervisorModel.RefId =
      this.advanceViewModel.Id;
    this.advanceRunningApproverMatrixSupervisorModel.Remarks =
      approverEntry.Remarks;
    this.advanceRunningApproverMatrixSupervisorModel.DepartmentId =
      this.advanceViewModel.DepartmentId;
    this.advanceRunningApproverMatrixSupervisorModel.WorkFlowId =
      this.advanceViewModel.WorkFlowId;
    this.advanceRunningApproverMatrixSupervisorModel.UserId =
      this.advanceViewModel.SupervisorId;
    return this.advanceRunningApproverMatrixSupervisorModel;
  }
  prepareApproverData(): AdvanceSettlementRunningApproverMatrixSupervisorViewModel {
    var approverEntry = this.formGroup.value.ApproverRemarks;
    var currentPendingApprover =
      this.advanceViewModel?.RunningApproverMatrixViewModel.find(
        (x) => x.StatusName === "Pending"
      );
    this.advanceRunningApproverMatrixModel =
      new AdvanceSettlementRunningApproverMatrixSupervisorViewModel();
    this.advanceRunningApproverMatrixModel.RefId = this.advanceViewModel.Id;
    this.advanceRunningApproverMatrixModel.Remarks = approverEntry.Remarks;
    this.advanceRunningApproverMatrixModel.DepartmentId =
      this.advanceViewModel.DepartmentId;
    this.advanceRunningApproverMatrixModel.WorkFlowId =
      this.advanceViewModel.WorkFlowId;
    this.advanceRunningApproverMatrixModel.UserId = this.portalUserViewModel.Id;
    this.advanceRunningApproverMatrixModel.AdvanceDetailsItemViewModel =
      this.advanceViewModel.Items;
    this.advanceRunningApproverMatrixModel.VoucherNo = approverEntry.VoucherNo;
    this.advanceRunningApproverMatrixModel.Level = currentPendingApprover.Level;
    this.advanceRunningApproverMatrixModel.ApproverSubGroupId =
      currentPendingApprover.ApproverSubGroupId;
    this.advanceRunningApproverMatrixModel.Is_Finance_Check =
      this.portalUserViewModel.Is_Finance_Check;
    if (this.advanceViewModel?.Is_Recommender_Group_Pending)
      this.advanceRunningApproverMatrixModel.AcknowledgerId =
        this.acknowledgerFC.value;
    this.advanceRunningApproverMatrixModel.VerifierId = this.verifierFC.value;
    this.advanceRunningApproverMatrixModel.RecommenderId =
      this.recommenderFC.value;
    return this.advanceRunningApproverMatrixModel;
  }
  showGroupApprover(subGroupId: number) {
    this.subSink.sink = this.approverSubGroupUserService
      .getApproverGroupInfo(subGroupId)
      .subscribe(
        (res) => {
          this.approverSubGroupUserModel = res;
          this.openModalItem(this.approverSubGroupUserModel);
        },
        (err) => {
          this.toaster.error(err, "Error");
          this.router.navigate(["/advanceSettlement/myapprovals"]);
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
  onInitalizeApproverRemarks(component: ApproverActionFormComponent) {
    this.approverActionFormComponent = component;
  }
}
