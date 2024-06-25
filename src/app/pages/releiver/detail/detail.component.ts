import { Component, OnInit, OnDestroy } from "@angular/core";
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
  ReleiverViewModel,
  ReleiverRunningApproverMatrixViewModel,
} from "src/app/core/models/releiver/releiver.model";
@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  releiverId: string;
  subSink: SubSink;
  formGroup: FormGroup;
  data: ReleiverViewModel;
  ApproverlistData: ApproverList[];
  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  RequestNo: string = "";
  portalUserViewModel: PortalUserViewModel;
  loading: boolean = false;
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

  createForm() {
    this.formGroup = this.formBuilder.group({
      ReleiveFromDate: [null, Validators.required],
      ReleiveToDate: [null, Validators.required],
      ReleiverName: [null, Validators.required],
      Justification: ["", Validators.required],
      Requester: [],
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
          this.router.navigate(["/releiver/list"]);
          this.loading = false;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
        this.router.navigate(["/releiver/list"]);
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
      Requester: aModel.UserName,
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
}
