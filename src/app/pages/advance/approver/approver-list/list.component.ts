import { Component, OnDestroy, OnInit } from "@angular/core";
import { SubSink } from "subsink/dist/subsink";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/core/services/EventEmitter/data.service";
import {
  AdvanceViewModel,
  AdvancedListModel,
} from "src/app/core/models/advance-model/advance.model";
import { AdvanceDetailsComponent } from "../../list/advance-details/advance-details.component";
import { DateDetailsComponent } from "../../list/date-details/date-details.component";
import { AdvanceRunningApproverMatrixService } from "src/app/core/services/Advance/advanceRunningApproverMatrix.service";
import { ApproverActionComponent } from "../approver-action/approver-action.component";
import { GridOptions } from "ag-grid-community";
import { BasicInfoComponent } from "src/app/shared/ui/basic-info/basic-info.component";
import { AdvanceService } from "src/app/core/services/Advance/advance.service";
import { SearchModel } from "src/app/core/models/search-model";

@Component({
  selector: "approver-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class AdvanceApproverListComponent implements OnInit, OnDestroy {
  subSink: SubSink;
  listData: AdvanceViewModel[];
  initModel: AdvancedListModel;
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
    private advanceService: AdvanceService,
    private advanceRunningMatrixService: AdvanceRunningApproverMatrixService
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
        headerName: "Date",
        minWidth: 250,
        cellRendererFramework: DateDetailsComponent,
      },
      {
        headerName: "Summary",
        minWidth: 250,
        cellRendererFramework: AdvanceDetailsComponent,
      },
      {
        headerName: "Action",
        minWidth: 250,
        width: 150,
        cellRendererFramework: ApproverActionComponent,
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
