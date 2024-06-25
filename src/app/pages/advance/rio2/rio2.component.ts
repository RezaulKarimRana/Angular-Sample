import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../core/services/EventEmitter/data.service';
import { SubSink } from 'subsink/dist/subsink';
import { AdvanceService } from '../../../core/services/Advance/advance.service';
import { AdvanceViewModel, AdvancedListModel, AdvanceSearchModel } from '../../../core/models/advance-model/advance.model';
import { ToastrService } from 'ngx-toastr';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { DateDetailsComponent } from '../list/date-details/date-details.component';
import { AdvanceDetailsComponent } from '../list/advance-details/advance-details.component';
import { ApprovedBillsDetailsComponent } from '../approved-bills-details/approved-bills-details.component';
import { BasicInfoComponent } from 'src/app/shared/ui/basic-info/basic-info.component';

@Component({
  selector: 'app-rio2',
  templateUrl: './rio2.component.html',
})

export class RIO2Component implements OnInit, OnDestroy {

  breadCrumbItems: Array<{}>;
  subSink: SubSink;
  listData: AdvanceViewModel[];
  initModel: AdvancedListModel;
  firstFormGroup: FormGroup;
  portalUserViewModel: PortalUserViewModel;
  StatusCode : string = "0";
  @ViewChild('dp', { static: true }) datePicker: any;
  constructor(
    private toaster: ToastrService,
    private advanceService: AdvanceService,
    private calendar: NgbCalendar,
    private dataService: DataService,
    private entryFormBuilder: FormBuilder,
    private router : Router) 
    { 
      this.subSink = new SubSink();
      this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state ? this.StatusCode = this.router.getCurrentNavigation().extras.state.StatusCode : this.StatusCode = "0";
    }

  ngOnInit(): void {
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    this.breadCrumbItems = [{ label: 'Advances' }, { label: 'Advance List', active: true }];
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
      StatusId: [0],
      ARDate: [new Date()],
      ARRequiredDate: [new Date()],
      TentativeSettlementDate: [new Date()],
    });
  }
  private loadInitData() {
    this.subSink.sink = this.advanceService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
          if(this.StatusCode != null)
          {
            var statusId = this.initModel?.StatusList.find(x => x.Id == this.StatusCode)?.Id;
            if(statusId != null)
            {
              this.firstFormGroup.patchValue({StatusId:statusId});
              this._fetchData();
            }
              
          }
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
      DepartmentId: 17,
      UserId: 0,
      ARDate: this.firstFormGroup.value.ARDate == null ? null : this.formatDate(this.firstFormGroup.value.ARDate),
      ARRequiredDate: this.firstFormGroup.value.ARRequiredDate == null ? null : this.formatDate(this.firstFormGroup.value.ARRequiredDate),
      TentativeSettlementDate: this.firstFormGroup.value.TentativeSettlementDate == null ? null : this.formatDate(this.firstFormGroup.value.TentativeSettlementDate)
    });
    this.subSink.sink = this.advanceService.getDeptWiseList(data).subscribe(
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
        width:100,
        'cellRendererFramework': ApprovedBillsDetailsComponent,
      }
    ],
    pagination: true,
    paginationPageSize: 5,
  };
 

  OnGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this._fetchData();
  }
  onModelUpdated(): void {
    this.gridApi?.sizeColumnsToFit();
  }
  setAdvCurrentDate(){
    this.aRDateFormControl.setValue(this.calendar.getToday());
    this._fetchData();
  }
  clearAdvDate(){
    this.aRDateFormControl.setValue('');
    this._fetchData();
  }
  setRdCurrentDate(){
    this.aRRequiredDateFormControl.setValue(this.calendar.getToday());
    this._fetchData();
  }
  clearRdDate(){
    this.aRRequiredDateFormControl.setValue('');
    this._fetchData();
  }
  setSdCurrentDate(){
    this.tentativeSettlementDateFormControl.setValue(this.calendar.getToday());
    this._fetchData();
  }
  clearSdDate(){
    this.tentativeSettlementDateFormControl.setValue('');
    this._fetchData();
  }
}
