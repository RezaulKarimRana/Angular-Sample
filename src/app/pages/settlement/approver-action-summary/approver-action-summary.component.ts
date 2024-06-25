import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import {
  ApplicationStatus,
  ApproversGroupName,
} from "src/app/core/enums/constants";
import { ToastrService } from "ngx-toastr";
import { BaseComponent } from "src/app/core/base/component/base/base.component";
import { BaseService } from "src/app/core/base/base.service";
import { SubSink } from "subsink/dist/subsink";
import { PortalUserViewModel } from "src/app/core/models/auth.models";
import Swal from "sweetalert2";
import { DataService } from "src/app/core/services/EventEmitter/data.service";
import { AdvanceSettlementRunningApproverMatrixSupervisorViewModel } from "src/app/core/models/settlement-model/advanceSettlementRunningApproverMatrix.model";
import { AdvanceSettlementInternalControlService } from "src/app/core/services/Settlement/advanceSettlementInternalControl.service";

@Component({
  selector: "app-approver-action-summary",
  templateUrl: "./approver-action-summary.component.html",
  styleUrls: ["./approver-action-summary.component.scss"],
})
export class ApproverActionSummaryComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  subSink: SubSink;
  id: string;
  requestNo: string;
  canEdit: boolean = false;
  publicId: string;
  is_Approver_Pending: boolean;
  is_Completed: boolean;
  is_Pending: boolean;
  filenName: string;
  hasNoAction: boolean;
  canSendToHR: boolean;
  canSendToInternalControl: boolean;
  canFinanceCheckSentToHR: boolean = false;
  canFinanceCompleteSentToHR: boolean = false;
  portalUserViewModel: PortalUserViewModel;
  runningModel: AdvanceSettlementRunningApproverMatrixSupervisorViewModel;

  constructor(
    private router: Router,
    baseService: BaseService,
    toaster: ToastrService,
    private dataService: DataService,
    private internalControlService: AdvanceSettlementInternalControlService
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
  }

  agInit(params) {
    this.id = params.data.Id;
    this.publicId = params.data.PublicId;
    this.requestNo = params.data.RequestNo;
    this.filenName = params.data.RequestNo;
    this.canEdit =
      (params.data.Status == ApplicationStatus.Return &&
        params.data.UserId == this.portalUserViewModel.Id) ||
      (params.data.Is_Approver_Pending &&
        this.portalUserViewModel.Id == params.data.SupervisorId) ||
      (params.data.Status == ApplicationStatus.Pending &&
        this.portalUserViewModel.Id == 4125);
    this.hasNoAction =
      params.data.Status == ApplicationStatus["Internal Control Pending"];
    this.is_Pending =
      params.data.Status == ApplicationStatus.Pending ? true : false;
    this.is_Completed =
      params.data.Status == ApplicationStatus.Completed ? true : false;
    this.is_Approver_Pending =
      params.data.Is_Approver_Pending && this.is_Pending;
    this.canSendToInternalControl =
      this.portalUserViewModel.Is_Finance_Complete &&
      !params.data.IsInternalControlNeed &&
      params.data.Status == ApplicationStatus.Pending &&
      params.data.ApproverStatus != ApplicationStatus["HR Pending"];

    this.canFinanceCheckSentToHR =
      this.portalUserViewModel.Is_Finance_Check &&
      params.data.ApproverGroupName == ApproversGroupName["FINANCE CHECK"] &&
      params.data.ApproverStatus == ApplicationStatus.Pending;

    this.canFinanceCompleteSentToHR =
      this.portalUserViewModel.Is_Finance_Complete &&
      params.data.ApproverGroupName == ApproversGroupName["FINANCE COMPLETE"] &&
      params.data.Status == ApplicationStatus.Pending &&
      params.data.ApproverStatus != ApplicationStatus["HR Pending"];
  }

  ngOnInit(): void {}
  onDetails() {
    this.router.navigateByUrl(`advanceSettlement/detail`, {
      state: {
        id: this.publicId,
      },
    });
  }
  onEdit() {
    this.router.navigateByUrl(`advanceSettlement/edit`, {
      state: {
        id: this.publicId,
      },
    });
  }
  onCheck() {
    this.router.navigateByUrl(`advanceSettlement/approver-entry`, {
      state: {
        id: this.publicId,
      },
    });
  }
  onExcelDownload() {
    this.downloadExcelFile(this.id, this.filenName, "Advance_Settlement");
  }
  onSenttoHR() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to send this the HR!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, sent it!",
    }).then((result) => {
      if (result.value) {
        let data = this.prepareSentToInternalData();
        this.subSink.sink = this.internalControlService
          .createTaskForHRGroup(data)
          .subscribe((x) => {
            if (x.Success) {
              Swal.fire(
                "Sent!",
                "This Settlement has been send to HR.",
                "success"
              );
              this.dataService.emitUserSettlementRequisitionListUpdated(true);
              this.router.navigate(["/advanceSettlement/myapprovals"]);
            } else {
              Swal.fire(
                "Some Thing error!",
                "Please contact with IT Team.",
                "error"
              );
            }
          });
      }
    });
  }
  onDownloadPDF() {
    this.downloadPDFFile(this.id, this.filenName, "Advance_Settlement");
  }
  onSentFinanceCompletetoVerifyHR() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to send this the HR!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, sent it!",
    }).then((result) => {
      if (result.value) {
        let data = this.prepareSentToInternalData();
        this.subSink.sink = this.internalControlService
          .createTaskFinanceCompleteToVerifyHRGroup(data)
          .subscribe((x) => {
            if (x.Success) {
              Swal.fire(
                "Sent!",
                "This Settlement has been send to HR.",
                "success"
              );
              this.dataService.emitUserSettlementRequisitionListUpdated(true);
              this.router.navigate(["/advanceSettlement/myapprovals"]);
            } else {
              Swal.fire(
                "Some Thing error!",
                "Please contact with IT Team.",
                "error"
              );
            }
          });
      }
    });
  }

  onSenttoInternal() {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to send this the Internal Control Group!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Yes, sent it!",
    }).then((result) => {
      if (result.value) {
        let data = this.prepareSentToInternalData();
        this.subSink.sink = this.internalControlService
          .createInternalGroupTask(data)
          .subscribe((x) => {
            if (x.Success) {
              Swal.fire(
                "Sent!",
                "This Settlement has been send to internal control.",
                "success"
              );
              this.dataService.emitARSettlementChanged(true);
              this.router.navigate(["/advanceSettlement/myapprovals"]);
            } else {
              Swal.fire(
                "Some Thing error!",
                "Please contact with IT Team.",
                "error"
              );
            }
          });
      }
    });
  }

  prepareSentToInternalData(): AdvanceSettlementRunningApproverMatrixSupervisorViewModel {
    this.runningModel =
      new AdvanceSettlementRunningApproverMatrixSupervisorViewModel();
    this.runningModel.RefId = parseInt(this.id);
    this.runningModel.UserId = this.portalUserViewModel.Id;
    this.runningModel.Is_Finance_Check =
      this.portalUserViewModel.Is_Finance_Check;
    this.runningModel.Is_Finance_Complete =
      this.portalUserViewModel.Is_Finance_Complete;
    return this.runningModel;
  }
}
