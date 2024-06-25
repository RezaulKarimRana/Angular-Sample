import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApproverSubGroupUserModel } from 'src/app/core/models/group-model/approver.subGroupUser.model';
import { ApproverSubGroupUserService } from 'src/app/core/services/ApproverGroup/approverSubGroupUser.service';
import { AddEditApproverSubGrouUserListComponent } from '../add-edit-approver-sub-grou-user-list/add-edit-approver-sub-grou-user-list.component';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-approver-sub-group-user-list',
  templateUrl: './approver-sub-group-user-list.component.html',
  styleUrls: ['./approver-sub-group-user-list.component.scss']
})

export class ApproverSubGroupUserListComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  listData: ApproverSubGroupUserModel[];

  labelListTitle: string = "";

  constructor(private router: Router,
    private modalService: NgbModal,
    private approverSubGroupUserService: ApproverSubGroupUserService) { }

  ngOnInit() {
    this.initDataTable();
  }

  private initDataTable() {
    this._fetchData();
    this.labelListTitle = "Approver Sub-Group User List";
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.approverSubGroupUserService.getAll().subscribe(res => {
      this.listData = res;
    }, err => {
      console.log("error");
    });
  }

  public openModalItem(item: ApproverSubGroupUserModel) {
    const modalRef = this.modalService.open(AddEditApproverSubGrouUserListComponent, { size: 'xl', backdrop: 'static', keyboard: false });
    let isEditable = item != null ? true : false;
    modalRef.componentInstance.aModel = item;
    modalRef.componentInstance.isEdit = isEditable;
    modalRef.result.then((result) => {
      if (result) {
        this.initDataTable();
      }

    }, (reason) => {
      console.log('Dismissed action: ' + reason);
    });
  }
  gridApi: any;
  columnApi: any;
  gridOptions: GridOptions = {
    columnDefs : [
      {
        'headerName': 'Department',
        filter: true,
        minWidth:400,
        width:400,
        'field': 'DepartmentName'
      },
      {
        'headerName': 'Approver Sub Group',
        filter: true,
        minWidth:400,
        width:400,
        'field': 'ApproverSubGroupName'
      },
      {
        'headerName': 'User',
        filter: true,
        minWidth:400,
        width:400,
        'field': 'PortalUserFullName'
      }
    ],
    pagination: true,
    paginationPageSize: 16,
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