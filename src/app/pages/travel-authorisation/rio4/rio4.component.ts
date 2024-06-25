import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../core/services/EventEmitter/data.service';
import { SubSink } from 'subsink/dist/subsink';
import { ToastrService } from 'ngx-toastr';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { TravelAuthorizationService } from 'src/app/core/services/TravelAuthorization/travelAuth.service';
import { TravelAuthorizationSearchModel, TravelAuthorizationViewModel } from 'src/app/core/models/travel-authorisation-model/travelAuthorisation.model';
import { DateDetailsComponent } from '../date-details/date-details.component';
import { TravelAuthDetailsComponent } from '../travel-auth-details/travel-auth-details.component';
import { ApprovedBillsDetailsComponent } from '../approved-bills-details/approved-bills-details.component';
import { BasicInfoComponent } from 'src/app/shared/ui/basic-info/basic-info.component';

@Component({
  selector: 'app-rio4',
  templateUrl: './rio4.component.html',
  styleUrls: ['./rio4.component.scss']
})

export class RIO4Component implements OnInit, OnDestroy {

  breadCrumbItems: Array<{}>;
  subSink: SubSink;
  listData: TravelAuthorizationViewModel[];
  initModel: TravelAuthorizationSearchModel;
  firstFormGroup: FormGroup;
  portalUserViewModel: PortalUserViewModel;
  StatusCode : string = "0";
  @ViewChild('dp', { static: true }) datePicker: any;
  constructor(
    private toaster: ToastrService,
    private travelAuthService: TravelAuthorizationService,
    private dataService: DataService,
    private calendar: NgbCalendar,
    private entryFormBuilder: FormBuilder,
    private router : Router) 
    { 
      this.subSink = new SubSink();
      this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state ? this.StatusCode = this.router.getCurrentNavigation().extras.state.StatusCode : this.StatusCode = "0";
    }

  ngOnInit(): void {
    this.createForm();
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    this.breadCrumbItems = [{ label: 'Travel Authorization' }, { label: 'Travel Authorization List', active: true }];
    this.loadInitData();
    this.dataService.travelAuthorizationChanged.subscribe(x => {
      this._fetchData();
    });
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  get statusIdFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('StatusId') : null;
  }
  get travelAuthDateFormControl() {
    return this.firstFormGroup ? this.firstFormGroup.get('TravelAuthDate') : null;
  }
  createForm() {
    this.firstFormGroup = this.entryFormBuilder.group({
      StatusId: [0],
      TravelAuthDate: [new Date()]
    });
  }
  private loadInitData() {
    this.subSink.sink = this.travelAuthService.getInitSearchData().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
          this._fetchData();
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
    let data = new TravelAuthorizationSearchModel({
      RequesterUserId: this.portalUserViewModel.Id,
      StatusId: this.statusIdFormControl.value,
      DepartmentId: 20,
      TravelAuthDate: this.travelAuthDateFormControl.value == null ? null : this.formatDate(this.travelAuthDateFormControl.value),
    });
    this.subSink.sink = this.travelAuthService.getDeptWiseList(data).subscribe(
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
        minWidth: 320,
        'cellRendererFramework': BasicInfoComponent,
      },
      {
        'headerName': 'Date',
        minWidth: 280,
        'cellRendererFramework': DateDetailsComponent,
      },
      {
        'headerName': 'Summary',
        minWidth: 250,
        'cellRendererFramework': TravelAuthDetailsComponent,
      },
      {
        'headerName': 'Action',
        minWidth: 100,
        'cellRendererFramework': ApprovedBillsDetailsComponent
      }
    ],
    pagination: true,
    paginationPageSize: 12,
  };
  OnGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this._fetchData();
  }
  onModelUpdated(): void {
    this.gridApi?.sizeColumnsToFit();
  }
  setCurrentDate(){
    this.travelAuthDateFormControl.setValue(this.calendar.getToday());
    this._fetchData();
  }
  clearDate(){
    this.travelAuthDateFormControl.setValue('');
    this._fetchData();
  }
}