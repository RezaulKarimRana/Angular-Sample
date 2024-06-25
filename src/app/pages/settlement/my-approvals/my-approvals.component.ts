import { Component, OnDestroy, ViewChild, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/core/services/EventEmitter/data.service";
import { CodeNamePair } from "src/app/core/models/mastersetup-model/codenamepair.model";
import { RunningApproverMatrixStatus } from "src/app/core/enums/constants";
import { PortalUserViewModel } from "src/app/core/models/auth.models";
import { GridOptions } from "ag-grid-community";
import { AdvanceSettlementDetailsComponent } from "../advance-settlement-details/advance-settlement-details.component";
import { AdvanceSettlementRunningApproverMatrixService } from "src/app/core/services/Settlement/advanceSettlementRunningApproverMatrix.service";
import { ApproverActionSummaryComponent } from "../approver-action-summary/approver-action-summary.component";
import {
  AdvanceSettlementSearchModel,
  AdvanceSettlementViewModel,
  AdvancedSettlementListModel,
} from "src/app/core/models/settlement-model/settlement.model";
import { BasicInfoComponent } from "src/app/shared/ui/basic-info/basic-info.component";
import { SearchModel } from "src/app/core/models/search-model";
import { AdvanceSettlementService } from "src/app/core/services/Settlement/advanceSettlement.service";

@Component({
  selector: "app-my-approvals",
  templateUrl: "./my-approvals.component.html",
  styleUrls: ["./my-approvals.component.scss"],
})
export class MyApprovalsComponent implements OnInit, OnDestroy {
  subSink: SubSink;
  listData: AdvanceSettlementViewModel[];
  initModel: AdvancedSettlementListModel;
  searchModel: SearchModel = {
    StatusId: 2,
    UserId: null,
    RequestNo: "",
    DepartmentId: 0,
    SiteCode: "",
  };
  constructor(
    private toaster: ToastrService,
    private dataService: DataService,
    private advanceService: AdvanceSettlementService,
    private advanceRunningMatrixService: AdvanceSettlementRunningApproverMatrixService
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
    this.loadInitData();
    this.dataService.advanceRequisitionChanged.subscribe((x) => {
      this.searchData(this.searchModel);
    });
  }

  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }

  private loadInitData() {
    this.subSink.sink = this.advanceService.getInitData().subscribe(
      (res) => {
        if (res) {
          this.initModel = res;
          this.searchData(this.searchModel);
        }
      },
      (err) => {
        this.toaster.error(err, "Error");
      }
    );
  }
  searchData = (model: SearchModel) => {
    this.subSink.sink = this.advanceRunningMatrixService
      .getDataByParams(model)
      .subscribe(
        (res) => {
          if (res) {
            this.listData = res;
          }
        },
        (err) => {
          this.toaster.error(err, "Error");
        }
      );
  };

  gridApi: any;
  columnApi: any;
  gridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: "Basic Information",
        autoHeight: true,
        minWidth: 250,
        cellRendererFramework: BasicInfoComponent,
      },
      {
        headerName: "Summary",
        minWidth: 250,
        cellRendererFramework: AdvanceSettlementDetailsComponent,
      },
      {
        headerName: "Action",
        minWidth: 250,
        width: 150,
        cellRendererFramework: ApproverActionSummaryComponent,
      },
    ],
    pagination: true,
    paginationPageSize: 5,
  };

  OnGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.searchData(this.searchModel);
  }
  onModelUpdated(): void {
    this.gridApi?.sizeColumnsToFit();
  }
}
