import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink/dist/subsink';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApproverSubGroupModel } from 'src/app/core/models/group-model/approverSubGroup.model';
import { ApproverSubGroupService } from 'src/app/core/services/ApproverGroup/approverSubGroup.service';
import { AddEditApproverSubGroupComponent } from '../add-edit-approver-sub-group/add-edit-approver-sub-group.component';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-approver-sub-group-list',
  templateUrl: './approver-sub-group-list.component.html',
  styleUrls: ['./approver-sub-group-list.component.scss']
})
export class ApproverSubGroupListComponent implements OnInit, OnDestroy {

  subSink = new SubSink();
  listData: ApproverSubGroupModel[];

  labelListTitle: string = "";

  constructor(private router: Router,
    private modalService: NgbModal,
    private approverSubGroupService: ApproverSubGroupService) { }

  ngOnInit() {
    this.initDataTable();
  }

  private initDataTable() {
    this._fetchData();
    this.labelListTitle = "Approver SubGroup List";
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private _fetchData() {
    this.subSink.sink = this.approverSubGroupService.getAll().subscribe(res => {
      this.listData = res;
    }, err => {
      console.log("error");
    });
  }

  public openModalItem(item: ApproverSubGroupModel) {
    const modalRef = this.modalService.open(AddEditApproverSubGroupComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    let isEditable = item != null ? true : false;
    modalRef.componentInstance.aModel = item;
    modalRef.componentInstance.isEdit = isEditable;
    modalRef.result.then((result) => {
      if (result) {
        this.initDataTable();
      }

    }, (reason) => {
    });
  }
  gridApi: any;
  columnApi: any;
  gridOptions: GridOptions = {
    columnDefs : [
      {
        'headerName': 'Name',
        filter: true,
        minWidth:400,
        width:400,
        'field': 'Name'
      },
      {
        'headerName': 'Department',
        filter: true,
        minWidth:400,
        width:400,
        'field': 'DepartmentName'
      },
      {
        'headerName': 'Approver Group',
        filter: true,
        minWidth:200,
        width:200,
        'field': 'ApproverGroupName'
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
