import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink/dist/subsink';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/core/services/EventEmitter/data.service';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { GridOptions } from 'ag-grid-community';
import { DashboardActionComponent } from '../dashboard-action/dashboard-action.component';
import { ApproverDetailsComponent } from '../approver-details/approver-details.component';
import { TASettlementDashboardInitModel, TASettlementSearchModel, TASettlementViewModel } from 'src/app/core/models/travel-authorisation-model/travelAuthorisationSettlement.model';
import { TASettlementService } from 'src/app/core/services/TravelAuthorization/travelAuthSettlement.service';
import { TravelAuthDetailsComponent } from '../../travel-authorisation/travel-auth-details/travel-auth-details.component';
import { BasicInfoComponent } from 'src/app/shared/ui/basic-info/basic-info.component';

@Component({
  selector: 'app-travel-auth-settlement-dashboard',
  templateUrl: './travel-auth-settlement-dashboard.component.html',
  styleUrls: ['./travel-auth-settlement-dashboard.component.scss']
})
export class TravelAuthSettlementDashboardComponent implements OnInit, OnDestroy {

  subSink: SubSink;
  listData: TASettlementViewModel[];
  initModel:TASettlementDashboardInitModel;
  firstFormGroup: FormGroup;
  portalUserViewModel: PortalUserViewModel;
  @ViewChild('dp', { static: true }) datePicker: any;
  constructor(
    private toaster: ToastrService,
    private dataService: DataService,
    private entryFormBuilder: FormBuilder,
    private travelAuthorizationService: TASettlementService
  ) { this.subSink = new SubSink();}

  ngOnInit(): void {
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    this.loadInitData();
    this.createForm();
    this.dataService.TASettlementChanged.subscribe(x => {
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
  get tRDateFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('TRDate') : null;
  }
  get requestNoFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('RequestNo') : null;
  }

  createForm() {
    this.firstFormGroup = this.entryFormBuilder.group({
      StatusId: [null],
      TaskTypeId: [null],
      TaskTypeDetailsId: [null],
      TRDate: [''],
      RequestNo: ['']
    });
  }

  private loadInitData() {
    this.subSink.sink = this.travelAuthorizationService.getDashboardInitData().subscribe(
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
  clearSearchValues(){
    this.statusFormControl.setValue(null);
    this.taskTypeFormControl.setValue(null);
    this.taskTypeDetailsFormControl.setValue(null);
    this.tRDateFormControl.setValue('');
    this.requestNoFormControl.setValue('');
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
    let data = new TASettlementSearchModel({
      StatusId: this.firstFormGroup.value.StatusId != null ? this.firstFormGroup.value.StatusId : null,
      TaskTypeId: this.firstFormGroup.value.TaskTypeId != null ? this.firstFormGroup.value.TaskTypeId : null,
      TaskTypeDetailsId: this.firstFormGroup.value.TaskTypeDetailsId != null ? this.firstFormGroup.value.TaskTypeDetailsId : null,
      TravelAuthDate: this.firstFormGroup.value.TRDate == null ? null : this.formatDate(this.firstFormGroup.value.TRDate),
      RequestNo: this.firstFormGroup.value.RequestNo != null ? this.firstFormGroup.value.RequestNo : null,
    });
    this.subSink.sink = this.travelAuthorizationService.getDashboardData(data).subscribe(
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
      'headerName': 'Request Information',
      minWidth: 250,
      width: 250,
      'cellRendererFramework': TravelAuthDetailsComponent,
    },
    {
      'headerName': 'Employee Information',
      autoHeight: true,
      minWidth: 240,
      width: 240,
      'cellRendererFramework': BasicInfoComponent,
    },
    {
      'headerName': 'Approver Info',
      autoHeight: true,
      minWidth: 240,
      width: 240,
      'cellRendererFramework': ApproverDetailsComponent,
    },
    {
      'headerName': 'Action',
      minWidth: 120,
      width: 120,
      'cellRendererFramework': DashboardActionComponent,
    }
  ],
  pagination: true,
  paginationPageSize: 8
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
