import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink/dist/subsink';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';
import { AdvanceDashbardSearchModel, AdvanceViewModel } from 'src/app/core/models/advance-model/advance.model';
import { DateDetailsComponent } from '../../advance/list/date-details/date-details.component';
import { AdvanceRunningApproverMatrixService } from 'src/app/core/services/Advance/advanceRunningApproverMatrix.service';
import { ApproverDetailsComponent } from './approver-details/approver-details.component';
import { AdvanceDashboardAction } from './advance-dashboard-action/advance-dashboard-action.component';
import { AdvanceDashboardService } from 'src/app/core/services/Advance/advanceDashboard.service';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { GridOptions } from 'ag-grid-community';
import { AdvanceDashboardInitModel } from 'src/app/core/models/advance-model/advanceRunningApproverMatrix.model';
import { BasicInfoComponent } from 'src/app/shared/ui/basic-info/basic-info.component';


@Component({
  selector: 'app-advance-dashboard',
  templateUrl: './advance-dashboard.component.html',
  styleUrls: ['./advance-dashboard.component.scss']
})

export class AdvanceDashboard implements OnInit, OnDestroy {

  breadCrumbItems: Array<{}>;
  subSink: SubSink;
  listData: AdvanceViewModel[];
  initModel: AdvanceDashboardInitModel;
  firstFormGroup: FormGroup;
  portalUserViewModel: PortalUserViewModel;
  @ViewChild('dp', { static: true }) datePicker: any;
  constructor(
    private toaster: ToastrService,
    private dataService: DataService,
    private entryFormBuilder: FormBuilder,
    private advanceRunningMatrixService: AdvanceRunningApproverMatrixService,
    private advanceDashboardService: AdvanceDashboardService
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
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
    return this.firstFormGroup ? this.firstFormGroup.get('StatusId') : null;
  }
  get taskTypeFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('TaskTypeId') : null;
  }
  get taskTypeDetailsFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('TaskTypeDetailsId') : null;
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
  get requestNoFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('RequestNo') : null;
  }

  createForm() {
    this.firstFormGroup = this.entryFormBuilder.group({
      StatusId: [null],
      TaskTypeId: [null],
      TaskTypeDetailsId: [null],
      ARDate: [''],
      ARRequiredDate: [''],
      TentativeSettlementDate: [''],
      RequestNo: ['']
    });
  }

  private loadInitData() {
    this.subSink.sink = this.advanceRunningMatrixService.getDashboardInitData().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
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
  clearSearchValues(){
    this.statusFormControl.setValue(null);
    this.taskTypeFormControl.setValue(null);
    this.taskTypeDetailsFormControl.setValue(null);
    this.aRDateFormControl.setValue('');
    this.aRRequiredDateFormControl.setValue('');
    this.tentativeSettlementDateFormControl.setValue('');
  }
  _fetchData = () => {
    let data = new AdvanceDashbardSearchModel({
      PageNumber: 1,
      Status: this.firstFormGroup.value.StatusId != null ? this.firstFormGroup.value.StatusId : null,
      TaskTypeId: this.firstFormGroup.value.TaskTypeId != null ? this.firstFormGroup.value.TaskTypeId : null,
      TaskTypeDetailsId: this.firstFormGroup.value.TaskTypeDetailsId != null ? this.firstFormGroup.value.TaskTypeDetailsId : null,
      PageSize: 10000,
      ARDate: this.firstFormGroup.value.ARDate == null ? null : this.formatDate(this.firstFormGroup.value.ARDate),
      RequiredDate: this.firstFormGroup.value.ARRequiredDate == null ? null : this.formatDate(this.firstFormGroup.value.ARRequiredDate),
      SettlementDate: this.firstFormGroup.value.TentativeSettlementDate == null ? null : this.formatDate(this.firstFormGroup.value.TentativeSettlementDate),
      RequestNo: this.firstFormGroup.value.RequestNo != null ? this.firstFormGroup.value.RequestNo : null,
    });
    this.subSink.sink = this.advanceDashboardService.getDashboardData(data).subscribe(
      (res) => {
        if (res) {
          this.listData = res;
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
      'cellRendererFramework': BasicInfoComponent,
    },
    {
      'headerName': 'Date Details',
      minWidth: 250,
      'cellRendererFramework': DateDetailsComponent,
    },
    {
      'headerName': 'Approver Information',
      autoHeight: true,
      minWidth: 250,
      'cellRendererFramework': ApproverDetailsComponent,
    },
    {
      'headerName': 'Action',
      minWidth: 250,
      width: 120,
      'cellRendererFramework': AdvanceDashboardAction,
    }
  ],
  pagination: true,
  paginationPageSize: 5
  };
  OnGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this._fetchData();
  }
  onModelUpdated(): void {
    this.gridApi?.sizeColumnsToFit();
  }
}
