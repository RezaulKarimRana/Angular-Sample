import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PortalUserViewModel } from "../../../../core/models/auth.models";
import { ApproverGroupModel } from "../../../../core/models/group-model/approverGroup.model";
import { AdvanceViewModel } from "../../../../core/models/advance-model/advance.model";
import { AdvanceRunningApproverMatrixSupervisorViewModel } from "../../../../core/models/advance-model/advanceRunningApproverMatrix.model";
import { ApproverSubGroupUsersViewModel } from "../../../../core/models/group-model/approver.subGroupUser.model";
import { AdvanceService } from "../../../../core/services/Advance/advance.service";
import { UserProfileService } from "../../../../core/services/MasterSetup/user.service";
import { AdvanceRunningApproverMatrixService } from "../../../../core/services/Advance/advanceRunningApproverMatrix.service";
import { ApproverSubGroupUserService } from "../../../../core/services/ApproverGroup/approverSubGroupUser.service";
import { GroupUserListComponent } from "../../../../pages/adminsetup/groupUser/group-user-list/group-user-list.component";
import { BaseService } from "src/app/core/base/base.service";
import { BaseComponent } from "src/app/core/base/component/base/base.component";
import { ApproverActionFormComponent } from "src/app/shared/ui/approver-action-form/approver-action-form.component";
import { RunningApproverMatrixViewModel } from "src/app/core/models/runningApproverMatrix.model";
@Component({
  selector: "app-supervisor-entry",
  templateUrl: "./supervisor-entry.component.html",
  styleUrls: ["./supervisor-entry.component.scss"],
})
export class AdvanceSupervisorEntryComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  subSink: SubSink;
  formGroup: FormGroup;
  advanceViewModel: AdvanceViewModel;

  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  totalExpense: string;
  isAlreadyGroupEntry: boolean = false;
  isCollapsed: boolean = false;
  isProjectShow: boolean = false;
  isTaskTypedetailsShow: boolean = false;
  publicId: string;
  approverTypeList: ApproverGroupModel[];
  approverRunningMatrixList: RunningApproverMatrixViewModel[] = [];
  portalUserViewModel: PortalUserViewModel;
  advanceRunningApproverMatrixSupervisorModel: AdvanceRunningApproverMatrixSupervisorViewModel;
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
    private advanceService: AdvanceService,
    private userService: UserProfileService,
    private advanceRunningApproverMatrixService: AdvanceRunningApproverMatrixService,
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
    this.getDetails();
    this.createForm();
  }
  public getDetails() {
    this.loading = true;
    this.subSink.sink = this.advanceService
      .getByIdforSupvisor(this.publicId)
      .subscribe(
        (res) => {
          if (res.Success) {
            this.advanceViewModel = res.Data;
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
            this.totalExpense = this.advanceViewModel.AdvanceDetailsItem.reduce(
              (sum, item) => sum + item.AdvanceAmount,
              0
            ).toLocaleString();
            this.loading = false;
            if (this.advanceViewModel.ProfilePicUrl) {
              this.profilePicAsByteArrayAsBase64 =
                "data:image/png;base64," + this.advanceViewModel.ProfilePicUrl;
            } else {
              this.profilePicAsByteArrayAsBase64 =
                "assets/images/users/avatar-1.jpg";
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
  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }

  createForm() {
    this.formGroup = this.entryFormBuilder.group({
      ApproverRemarks: [""],
    });
  }

  get approverRemarksFC() {
    return this.formGroup ? this.formGroup.get("ApproverRemarks") : null;
  }

  onSubmit() {
    this.loading = true;
    let aModel = this.prepareData();

    this.subSink.sink = this.advanceRunningApproverMatrixService
      .saveAsApproved(aModel)
      .subscribe((x) => {
        if (x.Success) {
          this.loading = false;
          this.toaster.success("saved successfully");
          this.router.navigate(["/advances/pending-list"]);
        } else {
          this.loading = false;
          this.toaster.error(x.Message);
          this.router.navigate(["/advances/pending-list"]);
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
          this.router.navigate(["/advances/pending-list"]);
        } else {
          this.toaster.error(x.Message);
        }
      });
  }

  prepareData(): AdvanceRunningApproverMatrixSupervisorViewModel {
    this.advanceRunningApproverMatrixSupervisorModel =
      new AdvanceRunningApproverMatrixSupervisorViewModel();
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

  prepareSupervisorData(): AdvanceRunningApproverMatrixSupervisorViewModel {
    var approverEntry = this.formGroup.value.ApproverRemarks;

    this.advanceRunningApproverMatrixSupervisorModel =
      new AdvanceRunningApproverMatrixSupervisorViewModel();
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
  onInitalizeApproverRemarks(component: ApproverActionFormComponent) {
    this.approverActionFormComponent = component;
  }
}
