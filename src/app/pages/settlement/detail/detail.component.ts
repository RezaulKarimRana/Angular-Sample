import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CodeNamePair } from "src/app/core/models/mastersetup-model/codenamepair.model";
import { ApproverList } from "src/app/core/models/group-model/approver.model";
import { ApproverSubGroupUserService } from "src/app/core/services/ApproverGroup/approverSubGroupUser.service";
import { ApproverSubGroupUsersViewModel } from "src/app/core/models/group-model/approver.subGroupUser.model";
import { GroupUserListComponent } from "../../adminsetup/groupUser/group-user-list/group-user-list.component";
import { BaseService } from "src/app/core/base/base.service";
import { BaseComponent } from "src/app/core/base/component/base/base.component";
import { PortalUserViewModel } from "src/app/core/models/auth.models";
import { AdvanceType } from "src/app/core/enums/constants";
import {
  AdvanceSettlementDetailsItemViewModel,
  AdvanceSettlementViewModel,
  SettlementFileViewModel,
} from "src/app/core/models/settlement-model/settlement.model";
import { AdvanceSettlementService } from "src/app/core/services/Settlement/advanceSettlement.service";
import { RunningApproverMatrixViewModel } from "src/app/core/models/runningApproverMatrix.model";
@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  subSink: SubSink;
  firstFormGroup: FormGroup;
  data: AdvanceSettlementViewModel;
  CanViewBankInfo: boolean = false;
  particularList: CodeNamePair[];
  advanceDetailsItemList: AdvanceSettlementDetailsItemViewModel[] = [];
  advanceDetailsItem: AdvanceSettlementDetailsItemViewModel;
  SettlementFiles: Array<SettlementFileViewModel> =
    new Array<SettlementFileViewModel>();
  isPettyCashSelected: boolean = false;
  isAdvanceSelected: boolean = false;
  totalExpense: string;
  canViewFinanceGroup: boolean;
  totalAmount: number = 0;
  totalCost: number = 0;
  totalDue: number = 0;
  totalRefund: number = 0;
  isDue: boolean = false;
  isRefund: boolean = false;
  isFinanceGroup: boolean;
  ApproverlistData: ApproverList[];
  InternalControllistData: ApproverList[];
  publicId: string;
  advanceViewModel: AdvanceSettlementViewModel;
  approverSubGroupUsersViewModel: ApproverSubGroupUsersViewModel[] = [];
  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  RequestNo: string = "";
  VoucherNo: string = "";
  isOutStationSelected: boolean = false;
  portalUserViewModel: PortalUserViewModel;
  loading: boolean = false;
  profilePicAsByteArrayAsBase64: any;
  supervisorLevelName: string = "Bill Reviewer";

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private advanceService: AdvanceSettlementService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private approverSubGroupUserService: ApproverSubGroupUserService,
    private entryFormBuilder: FormBuilder
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    this._fetchData(cn.extras.state.id);
  }

  ngOnInit() {
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
    this.isFinanceGroup =
      this.portalUserViewModel.Is_Finance_Check ||
      this.portalUserViewModel.Is_Finance_Complete;
    this.createForm();
    if (this.portalUserViewModel.SupervisorId.length > 0) {
      if (this.portalUserViewModel.SupervisorId[0]["Text"] == "True")
        this.supervisorLevelName = "Approver";
    }
  }
  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }
  viewAdvance() {
    this.router.navigateByUrl(`advances/detail`, {
      state: {
        id: this.data.AdvanceRequisitionId,
      },
    });
  }
  createForm() {
    this.firstFormGroup = this.entryFormBuilder.group({
      AdvanceRequisitionNo: [""],
      PettyCashAmount: [""],
      ActualCost: [""],
      SupervisorName: [""],
      Justification: [""],
      SettlementDetailsItem: this.entryFormBuilder.array([]),
    });
  }
  get settlementDetailsItem(): FormArray {
    return this.firstFormGroup.get("SettlementDetailsItem") as FormArray;
  }
  _fetchData = (id: any) => {
    this.loading = true;
    this.subSink.sink = this.advanceService.getById(id).subscribe(
      (res) => {
        if (res.Success) {
          this.data = res.Data;
          this.canViewFinanceGroup = this.isFinanceGroup;
          this.VoucherNo = this.isFinanceGroup ? this.data?.VoucherNo : "";
          this.loadAdvanceRequisition(this.data);
          this.loading = false;
          if (this.data.ProfilePicUrl) {
            this.profilePicAsByteArrayAsBase64 =
              "data:image/png;base64," + this.data.ProfilePicUrl;
          } else {
            this.profilePicAsByteArrayAsBase64 =
              "assets/images/users/avatar-1.jpg";
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
  };

  patchItem(item: any) {
    return this.entryFormBuilder.group({
      ParticularId: item.ParticularId,
      ParticularName: item.ParticularName,
      AdvanceAmount: item.AdvanceAmount,
      ActualCost: item.ActualCost,
      IsActive: item.IsActive,
    });
  }
  loadAdvanceRequisition(aModel: any) {
    this.firstFormGroup.patchValue({
      AdvanceRequisitionNo: aModel.AdvanceRequisitionNo,
      SupervisorName: aModel.SupervisorName,
      PettyCashAmount: aModel.TotalAmount,
      ActualCost: aModel.TotalCost,
      Justification: aModel.Justification,
    });
    if (aModel?.AdvanceTypeId == AdvanceType.Advance) {
      this.isPettyCashSelected = false;
      this.isAdvanceSelected = true;
      aModel?.Items.forEach((x) => {
        (this.firstFormGroup.get("SettlementDetailsItem") as FormArray).push(
          this.patchItem(x)
        );
      });
      this.totalAmount = aModel?.Items.reduce(
        (sum, item) => sum + item.AdvanceAmount,
        0
      );
      this.totalCost = aModel?.Items.reduce(
        (sum, item) => sum + item.ActualCost,
        0
      );
      this.totalDue = aModel?.TotalDue;
      this.totalRefund = aModel?.TotalRefund;
      this.isDue = this.totalDue > 0;
      this.isRefund = this.totalRefund > 0;
    } else {
      this.isPettyCashSelected = true;
      this.isAdvanceSelected = false;
    }
    this.CanViewBankInfo = aModel.CanViewBankInfo;
    this.ApproverlistData = aModel.RunningApproverMatrixViewModel;
    this.InternalControllistData = aModel.InternalControlMatrixViewModel;
    this.totalExpense = aModel?.Items.reduce(
      (sum, item) => sum + item.AdvanceAmount,
      0
    ).toLocaleString();
    this.approvedStatusCount = this.ApproverlistData?.filter(
      (t) => t["StatusName"] == "Approved"
    ).length;
    this.pendingStatusCount = this.ApproverlistData?.filter(
      (t) => t["StatusName"] == "Pending"
    ).length;
    this.dueStatusCount = this.ApproverlistData?.filter(
      (t) => t["StatusName"] == "Due"
    ).length;
  }

  showInternalGroup(_advanceDetails: RunningApproverMatrixViewModel) {
    let subGroupId = _advanceDetails.ApproverSubGroupId;
    this.subSink.sink = this.approverSubGroupUserService
      .getApproverGroupInfo(subGroupId)
      .subscribe(
        (res) => {
          this.approverSubGroupUsersViewModel = res;
          this.openModalItem(this.approverSubGroupUsersViewModel);
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
}
