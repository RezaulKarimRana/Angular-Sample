import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import {
  Advance,
  AdvanceDetailsItemViewModel,
  AdvancedListModel,
  AdvanceFileViewModel,
  TaskType,
} from "../../../core/models/advance-model/advance.model";
import { AdvanceService } from "../../../core/services/Advance/advance.service";
import { FileLikeObject, FileUploader } from "ng2-file-upload";
import {
  AdvanceType,
  ApplicationStatus,
  ApplicationConstant,
  FileTypeSize,
} from "../../../core/enums/constants";
import { PortalUserViewModel } from "../../../core/models/auth.models";
import { Router } from "@angular/router";
import { ApproverList } from "../../../core/models/group-model/approver.model";
import { BankAccountViewModel } from "../../../core/models/mastersetup-model/bankaccount.model";
import Swal from "sweetalert2";
import { BaseComponent } from "../../../core/base/component/base/base.component";
import { BaseService } from "src/app/core/base/base.service";
import { ApproverSubGroupUsersViewModel } from "src/app/core/models/group-model/approver.subGroupUser.model";
import { BankAccountComponent } from "src/app/shared/ui/bank-account/bank-account.component";

@Component({
  selector: "app-edit-advance",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"],
})
export class EditComponent extends BaseComponent implements OnInit, OnDestroy {
  todaysDate: object = new Date();
  canAddItem: boolean = true;
  pageTitle: string;
  subSink: SubSink;
  basicForm: FormGroup;
  bankFormGroup: FormGroup;
  aModel: Advance;
  initModel: AdvancedListModel;
  advanceDetailsItemList: AdvanceDetailsItemViewModel[] = [];
  approverSubGroupUsersViewModel: ApproverSubGroupUsersViewModel[] = [];
  isPettyCashSelected: boolean = false;
  isAdvanceSelected: boolean = false;
  approvedStatusCount: number = 0;
  pendingStatusCount: number = 0;
  dueStatusCount: number = 0;
  totalAmount: number = 0;
  isCollapsed: boolean = false;
  canViewApproverFlowDetails: boolean = false;
  AdvanceFiles: Array<AdvanceFileViewModel> = new Array<AdvanceFileViewModel>();
  AdvanceUploadedFiles: Array<AdvanceFileViewModel> =
    new Array<AdvanceFileViewModel>();
  fileList: File[] = new Array<File>();
  AdvanceFile = new AdvanceFileViewModel();
  ApproverlistData: ApproverList[];
  portalUserViewModel: PortalUserViewModel;
  showTentativeSettlementDate: boolean = false;
  isFileSizeExceed: boolean;
  totalFileSize: number = 0;
  tentativeSettlementMaxDate: object = new Date();
  loading: boolean = false;
  @ViewChild("dp", { static: true }) datePicker: any;

  @ViewChild("bankAccountComponent", { static: true })
  bankAccountComponent: BankAccountComponent;

  public uploader: FileUploader = new FileUploader({
    maxFileSize: FileTypeSize.fileSize,
    allowedMimeType: FileTypeSize.fileTypes,
  });

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private advanceService: AdvanceService,
    private fb: FormBuilder
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
        this.pageTitle = "Edit Advance Requisition";
        this._fetchData(cn.extras.state.id);
      }
    } else {
      this.pageTitle = "Create Advance Requisition";
    }
  }

  ngOnInit() {
    var date = new Date();
    var obj = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
    this.todaysDate = obj;
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
    this.loadInitData();
    this.createForm();
    this.uploader.onWhenAddingFileFailed = (item, filter, options) =>
      this.onWhenAddingFileFailed(item, filter, options);
  }

  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
    this.isFileSizeExceed = true;
    switch (filter.name) {
      case "fileSize":
        this.toaster.warning(`Maximum upload size exceeded 10 MB`, "File Size");
        break;
      case "mimeType":
        this.toaster.warning(`File format is not supported`, "File Type");
        break;
      default:
        this.toaster.warning(`Failed to load file`);
    }
    this.uploader.clearQueue();
  }

  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }

  createForm() {
    this.basicForm = this.fb.group({
      Id: [null],
      PublicId: [""],
      AdvanceTypeId: [null, Validators.required],
      AdvanceTypeName: [""],
      SupervisorId: [null, Validators.required],
      SupervisorName: [""],
      StatusId: [ApplicationStatus.Pending],
      UserId: [null],
      ARDate: [
        {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
        },
      ],
      ARRequiredDate: [null],
      TentativeSettlementDate: [null],
      PettyCashAmount: [],
      Justification: ["", Validators.required],
      FileUploader: [""],
      AdvanceAmountDetailsItem: this.fb.array([]),
    });
    this.bankFormGroup = this.fb.group({
      UserBankDetails: [""],
    });
  }
  advanceTypeChange() {
    if (this.advanceTypeFc.value == AdvanceType.Advance) {
      this.isPettyCashSelected = false;
      this.isAdvanceSelected = true;
      let row = this.createItemsFormGroup();
      this.advanceAmountDetailsItem.push(row);
    } else {
      this.isPettyCashSelected = true;
      this.isAdvanceSelected = false;
      this.pettyCashFC.setValue(this.initModel?.PettyCashUserLimit);
      this.pettyCashFC.disable();
    }
  }
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
          this.AdvanceFile = new AdvanceFileViewModel();
          this.AdvanceFile.File = files.item(i);
          this.AdvanceFile.IsNew = true;
          this.AdvanceFile.FileName = files.item(i).name;
          this.AdvanceFile.FileSize = files.item(i).size;
          this.AdvanceFiles.forEach((x) => {
            if (x.FileName == this.AdvanceFile.FileName) {
              isSameFile = true;
            }
          });
          if (!isSameFile) {
            this.AdvanceFiles.push(this.AdvanceFile);
            this.totalFileSize = this.totalFileSize + files.item(i).size;
          }
        }
      }
    }
  }

  packageForm(statusId: number): FormData {
    let userId = this.portalUserViewModel.Id;
    this.AdvanceFiles.forEach((x) => {
      if (x.IsNew) this.fileList.push(x.File);
    });
    let bankAccountModel = this.bankAccountComponent.value;
    let data = new Advance({
      Id: this.aModel?.Id > 0 ? this.aModel.Id : 0,
      AdvanceTypeId: this.advanceTypeFc.value,
      ARDate: this.formatDate(this.basicForm.value.ARDate),
      ARRequiredDate: this.formatDate(this.basicForm.value.ARRequiredDate),
      TentativeSettlementDate: this.formatDate(
        this.basicForm.value.TentativeSettlementDate
      ),
      Justification: this.basicForm.value.Justification,
      PettyCashAmount: this.pettyCashFC.value,
      TotalAmount: this.isAdvanceSelected
        ? this.totalAmount
        : this.pettyCashFC.value,
      Status: statusId,
      UserId: userId,
      AdvanceUploadedFiles: this.AdvanceUploadedFiles,
      AdvanceFiles: this.fileList,
      SupervisorId: this.supervisorFC.value,
      SupervisorName: this.supervisorNameFC.value,
      DepartmentId: this.portalUserViewModel.DepartmentId,
      AccountHolderName: bankAccountModel.AccountHolderName,
      AccountHolderCompany: bankAccountModel.AccountHolderCompany,
      BankName: bankAccountModel.BankName,
      AccountNo: bankAccountModel.AccountNo,
      AccountType: bankAccountModel.AccountType,
      RouterNo: bankAccountModel.RouterNo,
      Condition: bankAccountModel.Condition,
      MobileNo: bankAccountModel.MobileNo,
      RequestNo: this.aModel?.Id > 0 ? this.aModel.RequestNo : null,
      IsRevisedBill: this.aModel?.Id > 0 ? this.aModel.IsRevisedBill : false,
      AdvanceDetailsItem: this.GenerateDetailsItem(
        this.advanceAmountDetailsItem.value
      ),
    });
    return this.modelToFormData(data);
  }
  GenerateDetailsItem(detailsItem: any) {
    var itemList: AdvanceDetailsItemViewModel[] = [];
    detailsItem.forEach((x) => {
      itemList.push({
        Id: x.Id,
        ParticularId: x.ParticularId,
        ParticularName: x.ParticularName,
        Description: x.Description,
        SiteCode: x.SiteCode,
        AdvanceAmount: x.AdvanceAmount,
        IsActive: x.IsActive,
      });
    });
    return itemList;
  }
  modelToFormData(data: Advance): FormData {
    const formData = new FormData();
    let modelData = JSON.stringify(data);
    formData.set("model", modelData);
    for (let file of data.AdvanceFiles)
      formData.append("advanceFiles", file, file.name);
    return formData;
  }

  removeFile(index: number, id: number) {
    this.totalFileSize = this.totalFileSize - this.AdvanceFiles[index].FileSize;
    if (!isNaN(id)) {
      this.confirmDelete(index, id);
    } else {
      this.AdvanceFiles.splice(index, 1);
    }
  }

  confirmDelete(index: number, id: number) {
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
        this.AdvanceUploadedFiles.find((x) => x.Id == id).IsRemoved = true;
        this.AdvanceFiles.splice(index, 1);
      }
    });
  }

  private loadInitData() {
    this.subSink.sink = this.advanceService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
          this.supervisorFC.setValue(this.initModel.SupervisorId);
          this.supervisorNameFC.setValue(this.initModel.SupervisorName);
          if (!this.initModel.ProfilePicUrl) {
            this.toaster.info(
              "You have no Profile Picture, Please Upload Your Profile Picture"
            );
            this.router.navigate(["/advances/list"]);
          }
          if (this.initModel.BankAccountList.length == 0) {
            this.toaster.info(
              "You have no Bank Account, Please Contact with IT for add Bank Account"
            );
            this.router.navigate(["/advances/list"]);
          } else {
            this.bankAccountComponent.value = this.initModel.BankAccountList[0];
          }
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
  get userBankDetailsFormControl() {
    return this.bankFormGroup
      ? this.bankFormGroup.get("UserBankDetails")
      : null;
  }
  //#region FirstFromGroup
  get advanceTypeFc() {
    return this.basicForm ? this.basicForm.get("AdvanceTypeId") : null;
  }
  get supervisorFC() {
    return this.basicForm ? this.basicForm.get("SupervisorId") : null;
  }
  get supervisorNameFC() {
    return this.basicForm ? this.basicForm.get("SupervisorName") : null;
  }
  get aRDateFormControl() {
    return this.basicForm ? this.basicForm.get("ARDate") : null;
  }
  get aRRequiredDateFormControl() {
    return this.basicForm ? this.basicForm.get("ARRequiredDate") : null;
  }
  get tentativeSettlementDateFormControl() {
    return this.basicForm
      ? this.basicForm.get("TentativeSettlementDate")
      : null;
  }
  get pettyCashFC() {
    return this.basicForm ? this.basicForm.get("PettyCashAmount") : null;
  }
  get justificationFormControl() {
    return this.basicForm ? this.basicForm.get("Justification") : null;
  }
  get fileUploaderFormControl() {
    return this.basicForm ? this.basicForm.get("FileUploader") : null;
  }
  get advanceAmountDetailsItem(): FormArray {
    return this.basicForm.get("AdvanceAmountDetailsItem") as FormArray;
  }
  //#endregion

  onSubmit() {
    if (this.advanceAmountDetailsItem.invalid) {
      this.toaster.error("Please fill required field", "error");
      return;
    }
    if (
      this.isAdvanceSelected &&
      (this.aRRequiredDateFormControl.value == null ||
        this.tentativeSettlementDateFormControl.value == null)
    ) {
      this.toaster.error("Please fill required field", "error");
      return;
    }
    if (this.aModel?.Id == null && this.basicForm.invalid) {
      this.basicForm.markAllAsTouched();
      return null;
    }
    if (
      this.AdvanceFiles.length <= 0 &&
      this.advanceTypeFc.value == AdvanceType.Advance
    ) {
      this.toaster.error("Please Upload Attachment", "error");
      return;
    }
    this.loading = true;
    let inv = this.packageForm(ApplicationStatus.Pending);
    this.subSink.sink = this.advanceService.save(inv).subscribe((x) => {
      if (x.Success) {
        this.loading = false;
        this.toaster.success(x.Message);
        this.router.navigate(["/advances/list"]);
      } else {
        this.loading = false;
        this.router.navigate(["/advances/list"]);
        this.toaster.error(x.Message);
      }
    });
  }

  _fetchData = (id: string) => {
    this.loading = true;
    this.subSink.sink = this.advanceService.getById(id).subscribe(
      (res) => {
        if (res.Success) {
          this.aModel = res.Data;
          this.canViewApproverFlowDetails =
            this.aModel.Status == ApplicationStatus.Return;
          this.loadAdvanceRequisition(this.aModel);
          this.loading = false;
        } else {
          this.toaster.error(res["Message"], "Error");
          this.router.navigate(["/advances/pending-list"]);
          this.loading = false;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
        this.loading = false;
      }
    );
  };

  loadAdvanceRequisition(aModel: any) {
    this.bankAccountComponent.value = aModel;
    this.basicForm.patchValue({
      Id: aModel.Id,
      PublicId: aModel.PublicId,
      AdvanceTypeId: aModel.AdvanceTypeId,
      SupervisorName: aModel.SupervisorName,
      ARDate: this.stringToNgbDate(aModel.ARDate),
      ARRequiredDate: this.stringToNgbDate(aModel.ARRequiredDate),
      TentativeSettlementDate: this.stringToNgbDate(
        aModel.TentativeSettlementDate
      ),
      SupervisorId: aModel.SupervisorId,
      Justification: aModel.Justification,
    });
    this.AdvanceFiles = aModel.AdvanceFiles;
    this.AdvanceUploadedFiles = aModel.AdvanceUploadedFiles;
    this.ApproverlistData = aModel.RunningApproverMatrixViewModel;
    this.advanceDetailsItemList = aModel.AdvanceDetailsItem;
    this.approvedStatusCount = this.ApproverlistData.filter(
      (t) =>
        t["StatusName"] == "Approved" && t["ApproverGroupName"] != "CREATOR"
    ).length;
    this.pendingStatusCount = this.ApproverlistData.filter(
      (t) => t["StatusName"] == "Pending" && t["ApproverGroupName"] != "CREATOR"
    ).length;
    this.dueStatusCount = this.ApproverlistData.filter(
      (t) => t["StatusName"] == "Due" && t["ApproverGroupName"] != "CREATOR"
    ).length;
    this.showTentativeSettlementDate = true;
    if (aModel?.AdvanceTypeId == AdvanceType.Advance) {
      this.isPettyCashSelected = false;
      this.isAdvanceSelected = true;
      aModel?.AdvanceDetailsItem.forEach((x) => {
        (this.basicForm.get("AdvanceAmountDetailsItem") as FormArray).push(
          this.patchAdvanceItem(x)
        );
      });
      this.totalAmount = aModel?.AdvanceDetailsItem.reduce(
        (sum, item) => sum + item.AdvanceAmount,
        0
      ).toLocaleString();
    }
  }
  patchAdvanceItem(item: any) {
    return this.fb.group({
      Id: item.Id,
      ReferenceId: item.ReferenceId,
      ParticularId: item.ParticularId,
      Description: item.Description,
      SiteCode: item.SiteCode,
      AdvanceAmount: item.AdvanceAmount,
      IsActive: item.IsActive,
    });
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
    var obj = {
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
    };
    this.tentativeSettlementMaxDate = obj;
    this.showTentativeSettlementDate = true;
  }

  onInitalizeBankAccount(component: BankAccountComponent) {
    this.bankAccountComponent = component;
  }
  calculateTotalAmount() {
    this.totalAmount = this.advanceAmountDetailsItem.value
      .filter((x) => x.IsActive)
      .reduce((sum, item) => sum + Number(item.AdvanceAmount), 0)
      .toLocaleString();
  }
  deleteItems(idx: number) {
    const control = this.basicForm.get("AdvanceAmountDetailsItem") as FormArray;
    if (control.controls[idx].get("Id")?.value <= 0) {
      this.advanceAmountDetailsItem.removeAt(idx);
    } else {
      control.controls[idx].get("IsActive")?.setValue(false);
    }
    this.calculateTotalAmount();
  }
  addItems() {
    var lastItemIndex = this.advanceAmountDetailsItem.value.length - 1;
    var lastItem = this.advanceAmountDetailsItem.value[lastItemIndex];
    if (this.advanceAmountDetailsItem.invalid && lastItem.IsActive) {
      this.toaster.error("Please fill required field", "error");
      return;
    }
    let row = this.createItemsFormGroup();
    this.advanceAmountDetailsItem.push(row);
  }
  createItemsFormGroup() {
    return this.fb.group({
      ParticularId: [null, Validators.required],
      AdvanceAmount: ["", Validators.required],
      Description: ["", Validators.required],
      SiteCode: ["", Validators.required],
      IsActive: [true],
    });
  }
}
