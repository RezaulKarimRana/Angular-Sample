import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../core/services/EventEmitter/data.service';
import { SubSink } from 'subsink/dist/subsink';
import { AdvanceService } from '../../../core/services/Advance/advance.service';
import { AdvanceViewModel, AdvancedListModel, AdvanceSearchModel } from '../../../core/models/advance-model/advance.model';
import { ToastrService } from 'ngx-toastr';
import { PortalUserViewModel } from 'src/app/core/models/auth.models';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { ReleiverInitModel, ReleiverSearchModel, ReleiverViewModel } from 'src/app/core/models/releiver/releiver.model';
import { ReleiverService } from 'src/app/core/services/releiver/releiver.service';
import { ActionDetailsComponent } from '../action-details/action-details.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit, OnDestroy {

  breadCrumbItems: Array<{}>;
  subSink: SubSink;
  listData: ReleiverViewModel[];
  initModel: ReleiverInitModel;
  formGroup: FormGroup;
  portalUserViewModel: PortalUserViewModel;
  StatusCode : string = "0";

  constructor(
    private toaster: ToastrService,
    private releiverService: ReleiverService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private router : Router) 
    { 
      this.subSink = new SubSink();
      this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state ? this.StatusCode = this.router.getCurrentNavigation().extras.state.StatusCode : this.StatusCode = "0";
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
      StatusId: [null]
    });
  }
  private loadInitData() {
    this.subSink.sink = this.releiverService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
          if(this.StatusCode != null && this.initModel!= null)
          {
            var statusId = this.initModel.StatusList[this.StatusCode]?.Id;
            if(statusId != null)
            {
              this.formGroup.patchValue({StatusId:statusId});
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
  _fetchData = () => {
    let data = new ReleiverSearchModel({
      StatusId: this.statusFormControl.value
    });
    this.subSink.sink = this.releiverService.getAllByParams(data).subscribe(
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
        'headerName': 'Releiver',
        'field': 'ReleiverName',
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
