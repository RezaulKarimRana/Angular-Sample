import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { PortalUserViewModel } from "../../../core/models/auth.models";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "../../../core/base/component/base/base.component";
import { BaseService } from "src/app/core/base/base.service";
import {
  TravelAuthListModel,
  TravelAuthorizationDetailsItem,
  TravelAuthorizationViewModel,
} from "src/app/core/models/travel-authorisation-model/travelAuthorisation.model";
import { TravelAuthorizationService } from "src/app/core/services/TravelAuthorization/travelAuth.service";
import { TaskTypeDetailsModel } from "src/app/core/models/mastersetup-model/tasktypedetails.model";
import { TravelAuthorizationAdvanceInfoComponent } from "src/app/shared/ui/travel-authorization-advance-info/travel-authorization-advance-info.component";
import { TravelAuthorizationType } from "src/app/core/enums/constants";
import { BankAccountComponent } from "src/app/shared/ui/bank-account/bank-account.component";

@Component({
  selector: "app-detail-travel",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  CanViewBankInfo: boolean = false;
  travelAuthId: string;
  totalExpense: string;
  pageTitle: string;
  subSink: SubSink;
  VoucherNo: string = "";
  bankFormGroup: FormGroup;
  taAdvanceInfoForm: FormGroup;
  canViewFinanceGroup: boolean;
  secondFormGroup: FormGroup;
  aModel: TravelAuthorizationViewModel;
  initModel: TravelAuthListModel;
  travelAuthorizationDetailsItemList: TravelAuthorizationDetailsItem[] = [];
  travelAuthorizationDetailsItem: TravelAuthorizationDetailsItem;
  IsWithAdvance: boolean = false;
  isCollapsed: boolean = false;
  portalUserViewModel: PortalUserViewModel;
  loading: boolean = false;
  onTouchTaskType: boolean = false;
  taskTypeDetailsList: TaskTypeDetailsModel[] = [];
  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  @ViewChild("dp", { static: true }) datePicker: any;
  profilePicAsByteArrayAsBase64: any;
  @ViewChild("travelAuthorizationAdvanceInfoComponent", { static: true })
  travelAuthorizationAdvanceInfoComponent: TravelAuthorizationAdvanceInfoComponent;
  @ViewChild("bankAccountComponent", { static: true })
  bankAccountComponent: BankAccountComponent;
  supervisorLevelName: string = "Bill Reviewer";
  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private travelAuthService: TravelAuthorizationService,
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
        this.pageTitle = "Edit";
        this.travelAuthId = cn.extras.state.id;
      }
    } else {
      this.pageTitle = "Create";
      this.getParamId();
    }
  }

  ngOnInit() {
    this.createForm();
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
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
    this.bankFormGroup = this.entryFormBuilder.group({
      UserBankDetails: [""],
    });
    this.taAdvanceInfoForm = this.entryFormBuilder.group({
      TAAdvanceInfo: [""],
    });

    this.secondFormGroup = this.entryFormBuilder.group({
      LocationDistrictId: ["", Validators.required],
      DurationToDate: [new Date(), Validators.required],
      DurationFromDate: [new Date(), Validators.required],
      Remarks: [""],
    });
  }

  get taAdvanceInfoFormControl() {
    return this.taAdvanceInfoForm
      ? this.taAdvanceInfoForm.get("TAAdvanceInfo")
      : null;
  }
  //#region SecondFromGroup

  get locationDistrictFormControl() {
    return this.secondFormGroup
      ? this.secondFormGroup.get("LocationDistrictId")
      : null;
  }

  get durationToDateFormControl() {
    return this.secondFormGroup
      ? this.secondFormGroup.get("DurationToDate")
      : null;
  }

  get durationFromDateFormControl() {
    return this.secondFormGroup
      ? this.secondFormGroup.get("DurationFromDate")
      : null;
  }

  get remarksFormControl() {
    return this.secondFormGroup ? this.secondFormGroup.get("Remarks") : null;
  }
  //#endregion

  _fetchData = () => {
    this.loading = true;
    this.subSink.sink = this.travelAuthService
      .getById(this.travelAuthId)
      .subscribe(
        (res) => {
          if (res.Success) {
            this.aModel = res.Data;
            this.totalExpense =
              this.aModel?.TravelAuthorizationDetailsItemViewModel?.reduce(
                (sum, item) => sum + item.Total,
                0
              ).toLocaleString();
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
            this.router.navigate(["/travelauthorisation/list"]);
            this.loading = false;
          }
        },
        (err) => {
          this.toaster.error(err, "Error");
          this.loading = false;
        }
      );
  };
  loadData(aModel: TravelAuthorizationViewModel) {
    this.bankAccountComponent.value = aModel;
    this.travelAuthorizationAdvanceInfoComponent.value = aModel;
    this.CanViewBankInfo = aModel.CanViewBankInfo;
    this.onTouchTaskType = true;
    this.IsWithAdvance =
      aModel.TravelAuthorizationTypeId == TravelAuthorizationType.WithAdvance;
    this.travelAuthorizationDetailsItemList =
      aModel.TravelAuthorizationDetailsItemViewModel;
    this.taskTypeDetailsList = aModel.TaskTypeDetailsList;
    this.approvedStatusCount = aModel.RunningApproverMatrixViewModel.filter(
      (t) => t["StatusName"] == "Approved"
    ).length;
    this.pendingStatusCount = aModel.RunningApproverMatrixViewModel.filter(
      (t) => t["StatusName"] == "Pending"
    ).length;
    this.dueStatusCount = aModel.RunningApproverMatrixViewModel.filter(
      (t) => t["StatusName"] == "Due"
    ).length;
  }
  public getParamId() {
    this.subSink.sink = this.activatedRoute.params.subscribe((params) => {
      this.travelAuthId = params["id"];
    });
  }
  onInitalizeTAAdvanceInfo(component: TravelAuthorizationAdvanceInfoComponent) {
    this.travelAuthorizationAdvanceInfoComponent = component;
  }
  onInitalizeBankAccount(component: BankAccountComponent) {
    this.bankAccountComponent = component;
  }
}
