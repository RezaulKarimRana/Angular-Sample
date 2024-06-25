import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink/dist/subsink';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';
import { AdvanceBulkPaymentModel, AdvanceSearchModel, AdvanceViewModel } from 'src/app/core/models/advance-model/advance.model';
import { AdvanceDetailsComponent } from '../../list/advance-details/advance-details.component';
import { DateDetailsComponent } from '../../list/date-details/date-details.component';
import { BasicDetailsComponent } from '../../list/basic-details/basic-details.component';
import { AdvanceRunningApproverMatrixService } from 'src/app/core/services/Advance/advanceRunningApproverMatrix.service';
import { CodeNamePair } from 'src/app/core/models/mastersetup-model/codenamepair.model';
import { ApplicationStatus, ApplicationStatus } from 'src/app/core/enums/constants';
import { ReleiverApproverActionComponent } from '../approver-action/releiver-approver-action.component'
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import Swal from 'sweetalert2';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'releiver-approver-list',
  templateUrl: './releiver-list.component.html',
  styleUrls: ['./releiver-list.component.scss']
})

export class ReleiverAdvanceApproverListComponent implements OnInit, OnDestroy {

  breadCrumbItems: Array<{}>;
  subSink: SubSink;
  listData: AdvanceViewModel[];
  statusList: CodeNamePair[];
  portalUserViewModel : PortalUserViewModel;
  advanceModelList: AdvanceViewModel[] = [];
  advanceViewmodel: AdvanceViewModel;
  firstFormGroup: FormGroup;
  BulkRemarks: string;
  BulkVoucherNo: string;
  CanSendBulkPayment: boolean = false;
  CanSendBulkPaymentOption: boolean = false;
  IsSelectAll: boolean;
  loading:boolean= false;
  @ViewChild('dp', { static: true }) datePicker: any;
  constructor(
    private toaster: ToastrService,
    private dataService: DataService,
    private entryFormBuilder: FormBuilder,
    private advanceRunningMatrixService: AdvanceRunningApproverMatrixService
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Pending' }, { label: 'Pending List', active: true }];
    this.loadInitData();
    this.createForm();
    this.dataService.advanceRequisitionChanged.subscribe(x => {
      this._fetchData();
    });
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

  get statusFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('StatusId') : 0;
  }
  get aRDateFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('ARDate') : null;
  }
  get aRRequiredDateFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('ARRequiredDate') : null;
  }

  get tentativeSettlementDateFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('TentativeSettlementDate') : null;
  }

  createForm() {
    this.firstFormGroup = this.entryFormBuilder.group({
      StatusId: [ApplicationStatus.Pending],
      ARDate: [new Date()],
      ARRequiredDate: [new Date()],
      TentativeSettlementDate: [new Date()],
    });
  }

  private loadInitData() {
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    this.subSink.sink = this.advanceRunningMatrixService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.statusList = res;
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
  padNumber(value: number | null) {
    if (!isNaN(value) && value !== null) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }
  formatDate(date: NgbDateStruct): string {
    return date ?
      `${this.padNumber(date.month)}/${this.padNumber(date.day)}/${date.year}` :
      '';
  }
  _fetchData = () => {
    let data = new AdvanceSearchModel({
      StatusId: this.firstFormGroup.value.StatusId,
      ARDate: this.firstFormGroup.value.ARDate == null ? null : this.formatDate(this.firstFormGroup.value.ARDate),
      ARRequiredDate: this.firstFormGroup.value.ARRequiredDate == null ? null : this.formatDate(this.firstFormGroup.value.ARRequiredDate),
      TentativeSettlementDate: this.firstFormGroup.value.TentativeSettlementDate == null ? null : this.formatDate(this.firstFormGroup.value.TentativeSettlementDate)
    });
    this.subSink.sink = this.advanceRunningMatrixService.getReleiverApproverList(data).subscribe(
      (res) => {
        if (res) {
          this.listData = res;
          this.listData.forEach(x => {
            this.CanSendBulkPaymentOption = this.portalUserViewModel.Is_Finance_Complete && x.Status != ApplicationStatus.Completed;
            if(this.CanSendBulkPaymentOption)
            {
              this.CanSendBulkPayment = true;
            }
          });
          this.CanSendBulkPayment = this.CanSendBulkPayment && this.firstFormGroup.value.StatusId == ApplicationStatus.Pending;
          localStorage.removeItem('bulkProcessedAdvanceList');
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }

  gridApi: any;
  columnApi: any;
  gridOptions: GridOptions = {
    columnDefs : [
      {
        'headerName': 'Basic Information',
        autoHeight: true,
        minWidth: 250,
        'cellRendererFramework': BasicDetailsComponent,
      },
      {
        'headerName': 'Date',
        minWidth: 250,
        'cellRendererFramework': DateDetailsComponent,
      },
      {
        'headerName': 'Summary',
        minWidth: 250,
        'cellRendererFramework': AdvanceDetailsComponent,
      },
    {
      'headerName': 'Action',
      minWidth: 250,
      width: 150,
      'cellRendererFramework': ReleiverApproverActionComponent,
    }
  ],
  pagination: true,
  paginationPageSize: 5,
};

  OnGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this._fetchData();
  }
  onModelUpdated(): void {
    this.gridApi?.sizeColumnsToFit();
  }
  onSubmit(){
    this.advanceModelList = JSON.parse(localStorage.getItem('bulkProcessedAdvanceList'));
    if(this.advanceModelList != null && this.advanceModelList !=undefined && this.advanceModelList.length > 0 && this.BulkRemarks != undefined && this.BulkRemarks !='' && this.BulkVoucherNo != undefined && this.BulkVoucherNo != '')
    {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to complete this advance!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#34c38f',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Yes, complete it!',
      }).then((result) => {
        if (result.value) {
            let data = new AdvanceBulkPaymentModel({
                BulkRemarks: this.BulkRemarks,
                BulkVoucherNo: this.BulkVoucherNo,
                BulkProcessedAdvanceList: this.advanceModelList
            });
            this.loading = true; 
            this.subSink.sink = this.advanceRunningMatrixService.saveAsBulkApproverApproved(data).subscribe((x) => {
              if (x.Success) {
                this.loading = false; 
                Swal.fire('Sent!', 'This Advance has been completed', 'success');
                localStorage.removeItem('bulkProcessedAdvanceList');
                this.CanSendBulkPayment = false;
                this.dataService.emitUserAdvanceRequisitionListUpdated(true);
              } else {
                Swal.fire('Some Thing error!', 'Please contact with IT Team.', 'error');
                this.loading = false;
              }
            });
        }
      });
    }
    else{
      if(this.BulkRemarks == '' || this.BulkRemarks == undefined)
      {
        this.toaster.info('Please select Remarks');
      }
      else if(this.BulkVoucherNo == '' || this.BulkVoucherNo == undefined)
      {
        this.toaster.info('Please select Voucher No');
      }
      else
      {
        this.toaster.info('Please select At least one item');
      }
      return;
    }
  }
  toggleSelectData(isSelect: boolean){
    this.advanceModelList = [];
    this.listData.forEach(x => {
      x.IsCheckedForBulkProcessing = isSelect;
      this.advanceViewmodel = new AdvanceViewModel();
      this.advanceViewmodel.Id = x.Id;
      this.advanceViewmodel.IsCheckedForBulkProcessing = isSelect;
      this.advanceModelList.push(this.advanceViewmodel);
    });
    localStorage.setItem('bulkProcessedAdvanceList', JSON.stringify(this.advanceModelList));
    this.gridApi.setRowData(this.listData);
    this.gridApi.refreshCells({force: true});
  }
}
