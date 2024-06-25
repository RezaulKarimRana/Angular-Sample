import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from '../../../core/models/mastersetup-model/user.model';
import { SubSink } from 'subsink/dist/subsink';
import { UserProfileService } from '../../../core/services/MasterSetup/user.service';
import { DataService } from '../../../core/services/EventEmitter/data.service';
import { GridOptions, IGetRowsParams } from 'ag-grid-community';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit,OnDestroy {

  subSink: SubSink;
  userList: UserModel[];
  cacheOverflowSize;
  maxConcurrentDatasourceRequests;
  infiniteInitialRowCount;

  constructor(
    private toaster: ToastrService,
    private userService: UserProfileService,
  ) {
      this.subSink = new SubSink();
      this.cacheOverflowSize = 2;
      this.maxConcurrentDatasourceRequests = 2;
      this.infiniteInitialRowCount = 2;
    }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  gridApi:any;
  columnApi:any;
  gridOptions: GridOptions = {
    columnDefs : [
    {
      'headerName': 'HR Id',
      field:'HrId',
      sortable:true,
      filter: true,
    },
    {
      'headerName': 'Name',
      field:'FullName',
      sortable:true,
      filter: true,
    },
    {
      'headerName': 'Company',
      field:'CompanyName',
      sortable:true,
      filter: true,
    },
    {
      'headerName': 'Employee Type',
      field:'EmpolyeeTypeName',
      sortable:true,
      filter: true,
    },
    {
      'headerName': 'Designation',
      field:'DesignationName',
      sortable:true,
      filter: true,
    },
    {
      'headerName': 'Mobile',
      field:'MobileNo',
      sortable:true,
      filter: true,
    }
  ],
  pagination: true,
  paginationPageSize: 100,
  cacheBlockSize: 100,
  rowModelType: 'infinite',
};
  OnGridReady(params){
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    var datasource = {
      getRows: (params: IGetRowsParams) => {
        this.subSink.sink = this.userService.getAllUser(params.startRow,params.endRow).subscribe(
          (res) => {
            if (res) {
              params.successCallback(res);
            }
          },
          (err) => {
            this.toaster.error(err, "Error");
          }
        );
      }
    }
    this.gridApi.setDatasource(datasource);
  }
  onModelUpdated(): void {
    this.gridApi?.sizeColumnsToFit();
  }
}