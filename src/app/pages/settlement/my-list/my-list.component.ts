import { Component, OnDestroy, OnInit } from "@angular/core";
import { DataService } from "../../../core/services/EventEmitter/data.service";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { PortalUserViewModel } from "src/app/core/models/auth.models";
import { GridOptions } from "ag-grid-community";
import {
  AdvanceSettlementViewModel,
  AdvancedSettlementListModel,
} from "src/app/core/models/settlement-model/settlement.model";
import { AdvanceSettlementService } from "src/app/core/services/Settlement/advanceSettlement.service";
import { AdvanceSettlementDetailsComponent } from "../advance-settlement-details/advance-settlement-details.component";
import { ApproverActionSummaryComponent } from "../approver-action-summary/approver-action-summary.component";
import { BasicInfoComponent } from "src/app/shared/ui/basic-info/basic-info.component";
import { SearchModel } from "src/app/core/models/search-model";

@Component({
  selector: "app-my-list",
  templateUrl: "./my-list.component.html",
  styleUrls: ["./my-list.component.scss"],
})
export class MyListComponent implements OnInit, OnDestroy {
  subSink: SubSink;
  listData: AdvanceSettlementViewModel[];
  initModel: AdvancedSettlementListModel;
  portalUserViewModel: PortalUserViewModel;
  searchModel: SearchModel = {
    StatusId: 0,
    UserId: null,
    RequestNo: "",
    DepartmentId: 0,
    SiteCode: "",
  };
  constructor(
    private toaster: ToastrService,
    private dataService: DataService,
    private service: AdvanceSettlementService
  ) {
    this.subSink = new SubSink();
  }
  ngOnInit(): void {
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
    this.loadInitData();
    this.dataService.settlementRequisitionChanged.subscribe((x) => {
      this.searchData(this.searchModel);
    });
  }

  ngOnDestroy() {
    if (this.subSink) this.subSink.unsubscribe();
  }
  private loadInitData() {
    this.subSink.sink = this.service.getInitData().subscribe(
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
  searchData = (model: SearchModel) => {
    this.subSink.sink = this.service.getDataByParams(model).subscribe(
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
        width: 100,
        cellRendererFramework: ApproverActionSummaryComponent,
      },
    ],
    pagination: true,
    paginationPageSize: 5,
  };

  OnGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.searchData(this.searchModel);
  }
  onModelUpdated(): void {
    this.gridApi?.sizeColumnsToFit();
  }
}
