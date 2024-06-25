import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { SubSink } from 'subsink/dist/subsink';
import { ToastrService } from 'ngx-toastr';
import { Advance } from '../../../core/models/advance-model/advance.model';
import { AdvanceService } from '../../../core/services/Advance/advance.service';
import { FileLikeObject, FileUploader } from 'ng2-file-upload';
import { AdvanceType, ApplicationStatus, FileTypeSize } from '../../../core/enums/constants';
import { PortalUserViewModel } from '../../../core/models/auth.models'; 
import { Router } from '@angular/router';
import { ApproverList } from '../../../core/models/group-model/approver.model';
import Swal from 'sweetalert2';
import { BaseComponent } from '../../../core/base/component/base/base.component';
import { BaseService } from 'src/app/core/base/base.service';
import { ApproverSubGroupUsersViewModel } from 'src/app/core/models/group-model/approver.subGroupUser.model';
import { BankAccountComponent } from 'src/app/shared/ui/bank-account/bank-account.component';
import { AdvanceSettlement, AdvanceSettlementAttachment, AdvanceSettlementFileViewModel, AdvanceSettlementViewModel, AdvancedSettlementListModel, ChildFileViewModel, SettlementDetailsItemViewModel, SettlementFileViewModel, SettlementListModel } from 'src/app/core/models/settlement-model/settlement.model';
import { AdvanceSettlementService } from 'src/app/core/services/Settlement/advanceSettlement.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends BaseComponent implements OnInit,OnDestroy {
  
  advanceId:number;
  pageTitle:string;
  subSink: SubSink;
  basicForm: FormGroup;
  bankFormGroup: FormGroup;
  aModel: AdvanceSettlementViewModel;
  initModel: AdvancedSettlementListModel;
  RefundFiles: Array<AdvanceSettlementFileViewModel> = new Array<AdvanceSettlementFileViewModel>();
  RefundFile = new AdvanceSettlementFileViewModel();
  settlementDetailsItemList: SettlementDetailsItemViewModel[] = [];
  approverSubGroupUsersViewModel: ApproverSubGroupUsersViewModel[] =[];
  isPettyCashSelected: boolean = false;
  isAdvanceSelected: boolean = false;
  isAllFileAttached: boolean = false;
  approvedStatusCount : number=0;
  pendingStatusCount: number =0;
  dueStatusCount:number=0;
  totalAmount: number = 0;
  totalCost: number = 0;
  totalDue: number = 0;
  totalRefund: number = 0;
  isCollapsed: boolean = false;
  isDue: boolean = false;
  isRefund: boolean = false;
  SettlementFiles: Array<SettlementFileViewModel> = new Array<SettlementFileViewModel>();
  SettlementUploadedFiles: Array<SettlementFileViewModel> = new Array<SettlementFileViewModel>();
  fileList: File[] = new Array<File>();
  SettlementFile= new SettlementFileViewModel();
  ApproverlistData: ApproverList[];
  portalUserViewModel : PortalUserViewModel;
  showTentativeSettlementDate: boolean = false;
  isFileSizeExceed: boolean;
  isChildFileSizeExceed: boolean;
  isFileSelected: boolean = false;
  uploadFileId: number = 0;
  ChildFiles: Array<ChildFileViewModel> = new Array<ChildFileViewModel>();
  ChildFile = new ChildFileViewModel();
  totalFileSize: number = 0;
  tentativeSettlementMaxDate: object = new Date();
  loading:boolean= false;
  attachment = new AdvanceSettlementAttachment();
  supervisorLevelName: string ="Bill Reviewer";
  @ViewChild('dp', { static: true }) datePicker: any;

  @ViewChild('bankAccountComponent', { static: true })
	bankAccountComponent: BankAccountComponent;


  public uploader: FileUploader = new FileUploader({
		maxFileSize: FileTypeSize.fileSize,
		allowedMimeType: FileTypeSize.fileTypes
	});

  constructor(
    toaster: ToastrService,
    baseService: BaseService,
    private router: Router,
    private service: AdvanceSettlementService,
    private fb: FormBuilder) {
    super(toaster,baseService);
    this.subSink = new SubSink();
    var cn = this.router.getCurrentNavigation();
    this.pageTitle = 'Edit Advance Settlement';
    this._fetchData(cn.extras.state.id);
    this.advanceId = cn.extras.state.id;
  }

  ngOnInit() {
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
      this.loadInitData();
      this.createForm();
      this.isAllFileAttached = false;
      this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
  }

  onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
    this.isFileSizeExceed = true;
    switch (filter.name) {
      case 'fileSize':
        this.toaster.warning(`Maximum upload size exceeded 10 MB`, 'File Size');
        break;
      case 'mimeType':
        this.toaster.warning(`File format is not supported`, 'File Type');
        break;
      default:
        this.toaster.warning(`Failed to load file`);
    }
    this.uploader.clearQueue();
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  createForm() {
    this.basicForm = this.fb.group({
      AdvanceRequisitionId:[this.advanceId],
      AdvanceRequisitionNo:[''],
      SupervisorId: [null, Validators.required],
      SupervisorName: [''],
      UserId: [null],
      PettyCashAmount:[],
      Justification: ['',Validators.required],
      FileUploader: [''],
      SettlementDetailsItem: this.fb.array([])
    });
    this.bankFormGroup = this.fb.group({
      UserBankDetails: ['']
    });
  }
  removeRefundFile(index: number, id: number) {
    this.totalFileSize = this.totalFileSize - this.RefundFiles[index].FileSize;
    if(isNaN(id)){
      this.RefundFiles.splice(index, 1);
    }
	}
  public onRefundFileSelected(files: any) {
    var isSameFile = false;
    if(this.isFileSizeExceed)
    {
      this.isFileSizeExceed = !this.isFileSizeExceed;
      return;
    }
    else{
      for (var i = 0; i < files.length; i++) {
        var totalSize = this.totalFileSize + files.item(i).size;
        if( totalSize > FileTypeSize.fileSize)
        {
          this.toaster.info('Total file size is more than 10 MB');
          return;
        }
        else{
          this.RefundFile = new AdvanceSettlementFileViewModel();
          this.RefundFile.File = files.item(i);
          this.RefundFile.IsNew = true;
          this.RefundFile.FileName = files.item(i).name;
          this.RefundFile.FileSize = files.item(i).size;
          this.RefundFiles.forEach(x=>{
            if(x.FileName == this.RefundFile.FileName){
              isSameFile = true;
            }
          });
          if(!isSameFile){
            this.RefundFiles.push(this.RefundFile);
            this.totalFileSize = this.totalFileSize + files.item(i).size;
          }
        }
      }
    }
	}
  public onChildFileSelected(files: any, index: number) {
    if (!this.isChildFileSizeExceed) {
      this.attachment = new AdvanceSettlementAttachment();
      this.ChildFile = new ChildFileViewModel();
      this.attachment.FileName = files[0].name;
      this.ChildFile.File = files.item(0);
      this.ChildFile.IsNew = true;
      this.ChildFile.FileName = files.item(0).name;
      this.ChildFile.FileSize = files.item(0).size;
      this.ChildFiles.push(this.ChildFile);
      this.isFileSelected = true;
      this.uploadFileId = this.uploadFileId + 1;
      this.ChildFile.UploadFileIdWithFileName = files.item(0).name + ',#&,' + this.uploadFileId;
      const currentDate = new Date();
      const control =  this.basicForm.get('SettlementDetailsItem') as FormArray;
      control.controls[index].get('FileId')?.setValue(this.uploadFileId);
      control.controls[index].get('FileName')?.setValue(files[0].name);
      control.controls[index].get('FileType')?.setValue(files[0].type);
      control.controls[index].get('FilePath')?.setValue(currentDate.getMilliseconds()+'_'+files[0].name);
    }
    this.isChildFileSizeExceed = false;
  }

  packageForm(): FormData {
    this.SettlementFiles.forEach(x => {
			if(x.IsNew)
			this.fileList.push(x.File);
		});
		let data = new AdvanceSettlement({
      Id: this.aModel.Id,
      Status: ApplicationStatus.Pending,
			Justification: this.basicForm.value.Justification,
      TotalAmount: this.isAdvanceSelected ? this.totalAmount : this.pettyCashFC.value,
      TotalCost: this.totalCost,
      TotalDue: this.totalDue,
      TotalRefund: this.totalRefund,
      UploadedFiles: this.SettlementUploadedFiles,
      Files: this.fileList,
      Items: this.GenerateDetailsItem(this.settlementDetailsItem.value)
		});
		return this.modelToFormData(data);
	}
  GenerateDetailsItem(detailsItem: any){
    var itemList : SettlementDetailsItemViewModel[] = [];
    detailsItem.forEach(x => {
      itemList.push({
        Id: x.Id,
        ParticularId: x.ParticularId,
        ParticularName: x.ParticularName,
        Description: x.Description,
        SiteCode: x.SiteCode,
        AdvanceAmount: x.AdvanceAmount,
        ActualCost: x.ActualCost,
        IsActive: x.IsActive,
        FileId: x.FileId,
        FileName: x.FileName,
        FileType: x.FileType,
        FilePath: x.FilePath
      });
    });
    return itemList;
  }
  modelToFormData(data: AdvanceSettlement): FormData {

    const formData = new FormData();
		let modelData = JSON.stringify(data);
		formData.set('model', modelData);
    if(this.RefundFiles?.length > 0){
      formData.append('refundFiles', this.RefundFiles[0].File, this.RefundFiles[0].FileName);
    }
    this.ChildFiles.forEach(x => {
      if (x.IsNew) {
        formData.append('files', x.File, x.UploadFileIdWithFileName);
      }
    });
		return formData;
	}

  removeFile(index: number, id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'this attachement is permanently deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.deleteFile(id);
        this.aModel?.RefundFiles.splice(index, 1);
      }
    });
	}

  deleteExistingAttachment(index: number, id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'this attachement is permanently deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.value) {
        this.subSink.sink = this.service.deleteExistingAttachment(id).subscribe((x) => {
          if (x.Success) {
            const control =  this.basicForm.get('SettlementDetailsItem') as FormArray;
            control.controls[index].get('FileId')?.setValue(null);
            control.controls[index].get('FileName')?.setValue('');
            control.controls[index].get('FileType')?.setValue('');
            control.controls[index].get('FilePath')?.setValue('');
            this.toaster.success('deleted successfully');
          } else {
            this.toaster.error(x.Message);
          }
        })
      }
    });
  }

  private loadInitData() {
    this.subSink.sink = this.service.getInitData().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
          this.supervisorFC.setValue(this.initModel.SupervisorId);
          this.supervisorNameFC.setValue(this.initModel.SupervisorName);
          this.bankAccountComponent.value = this.initModel.BankAccountList[0];
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
  get userBankDetailsFormControl() {
		return this.bankFormGroup ? this.bankFormGroup.get('UserBankDetails') : null;
	}
  //#region FirstFromGroup
  get advanceRequisitionFc() {
    return this.basicForm ? this.basicForm.get('AdvanceRequisitionId') : null;
  }
  get advanceRequisitionNoFc() {
    return this.basicForm ? this.basicForm.get('AdvanceRequisitionNo') : null;
  }
  get supervisorFC() {
    return this.basicForm ? this.basicForm.get('SupervisorId') : null;
  }
  get supervisorNameFC() {
    return this.basicForm ? this.basicForm.get('SupervisorName') : null;
  }
  get userFC() {
    return this.basicForm ? this.basicForm.get('UserId') : null;
  }
  get pettyCashFC() {
    return this.basicForm ? this.basicForm.get('PettyCashAmount') : null;
  }
  get justificationFormControl() {
    return this.basicForm ? this.basicForm.get('Justification') : null;
  }
  get fileUploaderFormControl() {
    return this.basicForm ? this.basicForm.get('FileUploader') : null;
  }
  get settlementDetailsItem(): FormArray {
		return this.basicForm.get('SettlementDetailsItem') as FormArray;
	}
  //#endregion

  onSubmit() {
    if(this.isPettyCashSelected && (this.totalCost <= 0)){
      
      this.toaster.error('Please add Cost details','error');
      return;
    }
    if(this.settlementDetailsItem.invalid)
    {
      this.toaster.error('Please fill required field','error');
      return;
    }
    if(this.basicForm.invalid)
    {
      this.basicForm.markAllAsTouched();
      this.toaster.error('Please fill required field','error');
      return;
    }
    if(this.totalRefund > 0 && this.aModel?.RefundFiles?.length == 0){
      this.toaster.error('Please attach refund file','error');
      return;
    }
    this.isAllFileAttached = false;
    this.settlementDetailsItem.value.forEach(element => {
      if(element.FileId == null)
      this.isAllFileAttached = true;
    });
    if(this.isAllFileAttached){
      this.toaster.error('Please Attach All Document','error');
      return;
    }
    this.loading = true;
    let inv = this.packageForm();
    this.subSink.sink = this.service.update(inv).subscribe((x) => {
      if (x.Success) {
        this.loading = false;
        this.toaster.success(x.Message);
        this.isAllFileAttached = false;
        this.router.navigate(['/advanceSettlement/mylist']);
      } else {
        this.loading = false;
        this.isAllFileAttached = false;
        this.router.navigate(['/advanceSettlement/mylist']);
        this.toaster.error(x.Message);
      }
    })
  }

  _fetchData=(id: string)=>{
    this.loading = true;
    this.subSink.sink = this.service.getById(id).subscribe(
      (res) => {
        if (res.Success) {
          this.aModel = res.Data;
          this.loadAdvanceRequisition(this.aModel);
          this.loading = false;
        }
        else {
          this.toaster.error(res['Message'], "Error");
          this.router.navigate(['/advanceSettlement/mylist']);
          this.loading = false;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
        this.loading = false;
      }
    );
  }

  loadAdvanceRequisition(aModel: any) {
    this.bankAccountComponent.value = aModel;
    this.basicForm.patchValue({
      AdvanceRequisitionNo: aModel.AdvanceRequisitionNo,
      SupervisorName: aModel.SupervisorName,
      PettyCashAmount: aModel.TotalAmount,
      ActualCost: aModel.TotalCost,
      Justification: aModel.Justification,
    });
    if(aModel?.AdvanceTypeId == AdvanceType.Advance){
      this.isPettyCashSelected = false;
      this.isAdvanceSelected = true;
      aModel?.Items.forEach(x=>{
        (this.basicForm.get("SettlementDetailsItem") as FormArray).push(this.patchItem(x))
      });
      this.totalAmount = aModel?.Items.reduce((sum, item) => sum + item.AdvanceAmount, 0);
      this.totalCost = aModel?.Items.reduce((sum, item) => sum + item.ActualCost, 0);
      this.totalDue = aModel?.TotalDue;
      this.totalRefund = aModel?.TotalRefund;
      this.isDue = this.totalDue > 0;
      this.isRefund = this.totalRefund > 0;
    }
    else{
      this.isPettyCashSelected = true;
      this.isAdvanceSelected = false;
    }
  }
  patchItem(item: any) {
		return this.fb.group({
			Id: item.Id,
      ReferenceId: item.ReferenceId,
      ParticularId: item.ParticularId,
      Description: item.Description,
      SiteCode: item.SiteCode,
      AdvanceAmount:item.AdvanceAmount,
      ActualCost: item.ActualCost,
      IsActive: item.IsActive,
      FileId: item.FileId,
      FileName:item.FileName,
      FileType:item.FileType,
      FilePath:item.FilePath,
		});
	}
  addItems(){
    var lastItemIndex = this.settlementDetailsItem.value.length - 1;
    var lastItem = this.settlementDetailsItem.value[lastItemIndex];
    if(this.settlementDetailsItem.invalid && lastItem.IsActive)
    {
      this.toaster.error('Please fill required field','error');
      return;
    }
    let row = this.createItemsFormGroup();
		this.settlementDetailsItem.push(row);
  }
  createItemsFormGroup() {
		return this.fb.group({
      FileId: [null, Validators.required],
      FileName:['', Validators.required],
      FilePath:['', Validators.required],
      FileType:['', Validators.required],
			ParticularId: [null, Validators.required],
      Description: [null, Validators.required],
      SiteCode: [null, Validators.required],
      AdvanceAmount:[0],
      ActualCost:[0],
      IsActive:[true]
		})
	}
  viewAdvance(){
    this.router.navigateByUrl(`advances/detail`, {
      state: {
        id: this.advanceId,
      }
    });
  }

  onInitalizeBankAccount(component: BankAccountComponent) {
		this.bankAccountComponent = component;
	}
  calculateAmount(){
    this.totalCost = this.settlementDetailsItem.value.filter(x=> x.IsActive).reduce((sum, item) => sum + Number(item.ActualCost), 0);
    if(Number(this.totalAmount) < Number(this.totalCost))
    {
      this.isDue = true;
      this.isRefund = false;
      this.totalDue = Number(this.totalCost) - Number(this.totalAmount);
      this.totalRefund = 0;
    }
    else{
      this.isDue = false;
      this.isRefund = true;
      this.totalDue = 0;
      this.totalRefund = Number(this.totalAmount) - Number(this.totalCost);
    }
    
  }
}