import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataService } from '../../../core/services/EventEmitter/data.service';
import { SubSink } from 'subsink/dist/subsink';
import { ToastrService } from 'ngx-toastr';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { ReleiverInitModel, ReleiverSearchModel, ReleiverViewModel } from 'src/app/core/models/releiver/releiver.model';
import { ReleiverService } from 'src/app/core/services/releiver/releiver.service';
import { ActionDetailsComponent } from '../action-details/action-details.component';

@Component({
  selector: 'app-approval-pending',
  templateUrl: './approval-pending.component.html',
  styleUrls: ['./approval-pending.component.scss']
})

export class ApprovalPendingComponent implements OnInit, OnDestroy {

  breadCrumbItems: Array<{}>;
  subSink: SubSink;
  listData: ReleiverViewModel[];
  initModel: ReleiverInitModel;
  formGroup: FormGroup;
  portalUserViewModel: PortalUserViewModel;
  constructor(
    private toaster: ToastrService,
    private releiverService: ReleiverService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private router : Router) 
    { 
      this.subSink = new SubSink();
    }

  ngOnInit(): void {
    this.portalUserViewModel = JSON.parse(localStorage.getItem('currentLoginUser'));
    this.breadCrumbItems = [{ label: 'Releiver/Delegation' }, { label: 'Releiver/Delegation List', active: true }];
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
    return this.formGroup ? this.formGroup.get('StatusId') : null;
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      StatusId: [2]
    });
  }
  private loadInitData() {
    this.subSink.sink = this.releiverService.getInitData().subscribe(
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
  _fetchData = () => {
    let data = new ReleiverSearchModel({
      StatusId: this.statusFormControl.value
    });
    this.subSink.sink = this.releiverService.getApproverLisByParams(data).subscribe(
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
        'headerName': 'Requester Name',
        'field': 'UserName',
        autoHeight: true,
        minWidth: 250,
      },
      {
        'headerName': 'Releive From',
        'field': 'ReleiveFromDateString',
        minWidth: 250,
      },
      {
        'headerName': 'Releive To',
        'field': 'ReleiveToDateString',
        minWidth: 250,
      },
      {
        'headerName': 'Action',
        minWidth: 250,
        width:100,
        'cellRendererFramework': ActionDetailsComponent,
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
}
