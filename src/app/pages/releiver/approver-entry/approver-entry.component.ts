import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ApproverList } from "src/app/core/models/group-model/approver.model";
import { BaseService } from "src/app/core/base/base.service";
import { BaseComponent } from "src/app/core/base/component/base/base.component";
import { PortalUserViewModel } from "src/app/core/models/auth.models";
import { ReleiverService } from "src/app/core/services/releiver/releiver.service";
import {
  ReleiverRunningApproverMatrixViewModel,
  ReleiverViewModel,
} from "src/app/core/models/releiver/releiver.model";
import { ApplicationStatus } from "src/app/core/enums/constants";
import { ApproverActionFormComponent } from "src/app/shared/ui/approver-action-form/approver-action-form.component";
@Component({
  selector: "app-approver-entry",
  templateUrl: "./approver-entry.component.html",
  styleUrls: ["./approver-entry.component.scss"],
})
export class ApproverEntryComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  releiverId: string;
  subSink: SubSink;
  formGroup: FormGroup;
  justificationFormGroup: FormGroup;
  data: ReleiverViewModel;
  ApproverlistData: ApproverList[];
  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  RequestNo: string = "";
  runningApproverModel: ReleiverRunningApproverMatrixViewModel;
  portalUserViewModel: PortalUserViewModel;
  loading: boolean = false;
  @ViewChild("approverActionFormComponent", { static: true })
  approverActionFormComponent: ApproverActionFormComponent;
  ReleiverRunningApproverMatrixViewModel: ReleiverRunningApproverMatrixViewModel[];

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private releiverService: ReleiverService,
    private formBuilder: FormBuilder
  ) {
    super(toaster, baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    if (cn && cn.extras.state) {
      this.releiverId = cn.extras.state.id;
    }
  }

  ngOnInit() {
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
    this.createForm();
    this._fetchData();
  }
  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }
  get justificationFormControl() {
    return this.justificationFormGroup
      ? this.justificationFormGroup.get("ApproverRemarks")
      : null;
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      ReleiveFromDate: [null, Validators.required],
      ReleiveToDate: [null, Validators.required],
      ReleiverName: [null, Validators.required],
      Justification: ["", Validators.required],
    });
    this.justificationFormGroup = this.formBuilder.group({
      ApproverRemarks: [""],
    });
  }
  //#endregion
  _fetchData = () => {
    this.loading = true;
    this.subSink.sink = this.releiverService.getById(this.releiverId).subscribe(
      (res) => {
        if (res.Success) {
          this.data = res.Data;
          this.loadData(this.data);
          this.loading = false;
        } else {
          this.toaster.error(res["Message"], "Error");
          this.router.navigate(["/releiver/approval-pending"]);
          this.loading = false;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
        this.router.navigate(["/releiver/approval-pending"]);
        this.loading = false;
      }
    );
  };

  loadData(aModel: any) {
    this.ReleiverRunningApproverMatrixViewModel =
      aModel.ReleiverRunningApproverMatrixViewModel;
    this.formGroup.patchValue({
      ReleiveFromDate: aModel.ReleiveFromDateString,
      ReleiveToDate: aModel.ReleiveToDateString,
      ReleiverName: aModel.ReleiverName,
      Justification: aModel.Justification,
    });
    this.RequestNo = aModel.RequestNo;
    this.ApproverlistData = aModel.RunningApproverMatrixViewModel;
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
  onSubmit() {
    if (this.justificationFormGroup.invalid) {
      this.justificationFormGroup.markAllAsTouched();
      return null;
    }
    this.loading = true;
    let data = this.prepareData(ApplicationStatus.Completed);
    this.subSink.sink = this.releiverService
      .saveAsApproved(data)
      .subscribe((x) => {
        if (x.Success) {
          this.loading = false;
          this.toaster.success("saved successfully");
          this.router.navigate(["/releiver/approval-pending"]);
        } else {
          this.toaster.error(x.Message);
          this.loading = false;
          this.router.navigate(["/releiver/approval-pending"]);
        }
      });
  }

  onReturn() {
    if (this.justificationFormGroup.invalid) {
      this.justificationFormGroup.markAllAsTouched();
      return null;
    }
    this.loading = true;
    let data = this.prepareData(ApplicationStatus.Return);
    this.subSink.sink = this.releiverService
      .saveAsDeclined(data)
      .subscribe((x) => {
        if (x.Success) {
          this.loading = false;
          this.toaster.success("Return successfully");
          this.router.navigate(["/releiver/approval-pending"]);
        } else {
          this.toaster.error(x.Message);
          this.loading = false;
          this.router.navigate(["/releiver/approval-pending"]);
        }
      });
  }
  prepareData(statusId: number): ReleiverRunningApproverMatrixViewModel {
    var approverEntry = this.justificationFormGroup.value.ApproverRemarks;
    this.runningApproverModel = new ReleiverRunningApproverMatrixViewModel();
    this.runningApproverModel.ReferrenceId = this.data.Id;
    this.runningApproverModel.UserId = this.portalUserViewModel.Id;
    this.runningApproverModel.StatusId = statusId;
    this.runningApproverModel.Remarks = approverEntry.Remarks;
    return this.runningApproverModel;
  }
  onInitalizeApproverRemarks(component: ApproverActionFormComponent) {
    this.approverActionFormComponent = component;
  }
}
