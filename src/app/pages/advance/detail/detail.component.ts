import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  AdvanceDetailsItemViewModel,
  AdvanceViewModel,
} from "../../../core/models/advance-model/advance.model";
import { CodeNamePair } from "src/app/core/models/mastersetup-model/codenamepair.model";
import { AdvanceService } from "src/app/core/services/Advance/advance.service";
import { ApproverList } from "src/app/core/models/group-model/approver.model";
import { ApproverSubGroupUserService } from "src/app/core/services/ApproverGroup/approverSubGroupUser.service";
import { ApproverSubGroupUsersViewModel } from "src/app/core/models/group-model/approver.subGroupUser.model";
import { GroupUserListComponent } from "../../adminsetup/groupUser/group-user-list/group-user-list.component";
import { BaseService } from "src/app/core/base/base.service";
import { BaseComponent } from "src/app/core/base/component/base/base.component";
import { PortalUserViewModel } from "src/app/core/models/auth.models";
import { BankAccountComponent } from "src/app/shared/ui/bank-account/bank-account.component";
import { DataService } from "src/app/core/services/EventEmitter/data.service";
import { AdvanceType } from "src/app/core/enums/constants";
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
  advanceRequisitionId: string;
  subSink: SubSink;
  firstFormGroup: FormGroup;
  bankFormGroup: FormGroup;
  data: AdvanceViewModel;
  CanViewBankInfo: boolean = false;
  taskTypeList: CodeNamePair[];
  taskTypeDetailsList: CodeNamePair[];
  distictList: CodeNamePair[];
  particularList: CodeNamePair[];
  advanceDetailsItemList: AdvanceDetailsItemViewModel[] = [];
  advanceDetailsItem: AdvanceDetailsItemViewModel;
  isProjectShow: boolean = false;
  isTaskTypedetailsShow: boolean = false;
  isOtherParticularsShow: boolean = true;
  isPettyCashSelected: boolean = false;
  isAdvanceSelected: boolean = false;
  totalExpense: string;
  isCollapsed: boolean = false;
  canViewFinanceGroup: boolean;
  isFinanceGroup: boolean;
  ApproverlistData: ApproverList[];
  InternalControllistData: ApproverList[];
  AdvanceDetailsItemListData: any = [];
  publicId: string;
  advanceViewModel: AdvanceViewModel;
  approverSubGroupUsersViewModel: ApproverSubGroupUsersViewModel[] = [];
  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  RequestNo: string = "";
  VoucherNo: string = "";
  isOutStationSelected: boolean = false;
  portalUserViewModel: PortalUserViewModel;
  @ViewChild("dp", { static: true }) datePicker: any;
  @ViewChild("bankAccountComponent", { static: true })
  bankAccountComponent: BankAccountComponent;
  loading: boolean = false;
  profilePicAsByteArrayAsBase64: any;

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private dataService: DataService,
    private advanceService: AdvanceService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private approverSubGroupUserService: ApproverSubGroupUserService,
    private entryFormBuilder: FormBuilder
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    if (cn && cn.extras.state) {
      this.advanceRequisitionId = cn.extras.state.id;
    } else {
      this.getParamId();
    }
  }

  ngOnInit() {
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
    this.isFinanceGroup =
      this.portalUserViewModel.Is_Finance_Check ||
      this.portalUserViewModel.Is_Finance_Complete;
    this.createForm();
    this._fetchData();
  }
  public getParamId() {
    this.subSink.sink = this.activatedRoute.params.subscribe((params) => {
      this.advanceRequisitionId = params["id"];
    });
  }
  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }

  createForm() {
    this.bankFormGroup = this.entryFormBuilder.group({
      UserBankDetails: [""],
    });
    this.firstFormGroup = this.entryFormBuilder.group({
      Id: [null],
      PublicId: [""],
      ARDate: [""],
      ARRequiredDate: [""],
      TentativeSettlementDate: [""],
      SupervisorName: [""],
      ProjectName: [""],
      Justification: [""],
      AdvanceTypeId: [],
      AdvanceTypeName: [],
      PettyCashAmount: [],
    });
  }
  get advanceTypeFC() {
    return this.firstFormGroup
      ? this.firstFormGroup.get("AdvanceTypeId")
      : null;
  }
  _fetchData = () => {
    this.loading = true;
    this.subSink.sink = this.advanceService
      .getById(this.advanceRequisitionId)
      .subscribe(
        (res) => {
          if (res.Success) {
            this.data = res.Data;
            this.canViewFinanceGroup = this.isFinanceGroup;
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
  };

  loadAdvanceRequisition(aModel: any) {
    this.bankAccountComponent.value = aModel;
    this.firstFormGroup.patchValue({
      Id: aModel.Id,
      PublicId: aModel.PublicId,
      ARDate: aModel.ARDateString,
      ARRequiredDate: aModel.ARRequiredDateString,
      TentativeSettlementDate: aModel.TentativeSettlementDateString,
      SupervisorName: aModel.SupervisorName,
      AdvanceTypeId: aModel.AdvanceTypeId,
      AdvanceTypeName: aModel.AdvanceTypeName,
      PettyCashAmount: aModel.PettyCashAmount,
      Justification: aModel.Justification,
      AuthRefId: aModel.AdvanceFiles[0]?.Id,
      AuthRefNo: aModel.AdvanceFiles[0]?.FileName,
    });
    this.VoucherNo = aModel.VoucherNo;
    this.CanViewBankInfo = aModel.CanViewBankInfo;
    this.ApproverlistData = aModel.RunningApproverMatrixViewModel;
    this.InternalControllistData = aModel.InternalControlMatrixViewModel;
    this.totalExpense = this.AdvanceDetailsItemListData.reduce(
      (sum, item) => sum + item.Total,
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
    this.isProjectShow =
      aModel.ProjectName != "" && aModel.ProjectName != null ? true : false;
    this.isTaskTypedetailsShow =
      aModel.TaskTypeDetailsName != "" && aModel.TaskTypeDetailsName != null
        ? true
        : false;
    if (aModel?.AdvanceTypeId == AdvanceType.Advance) {
      this.isPettyCashSelected = false;
      this.isAdvanceSelected = true;
      this.AdvanceDetailsItemListData = aModel.AdvanceDetailsItem;
      this.totalExpense = aModel?.AdvanceDetailsItem.reduce(
        (sum, item) => sum + item.AdvanceAmount,
        0
      ).toLocaleString();
    } else {
      this.isPettyCashSelected = true;
      this.isAdvanceSelected = false;
    }
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
          this.router.navigate(["/advances/supervisor-list"]);
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
}
