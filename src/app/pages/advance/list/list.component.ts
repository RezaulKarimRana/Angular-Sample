import { Component, OnDestroy, ViewChild, OnInit } from "@angular/core";
import { DateDetailsComponent } from "./date-details/date-details.component";
import { AdvanceDetailsComponent } from "./advance-details/advance-details.component";
import { ActionDetailsComponent } from "./action-details/action-details.component";
import { DataService } from "../../../core/services/EventEmitter/data.service";
import { SubSink } from "subsink/dist/subsink";
import { AdvanceService } from "../../../core/services/Advance/advance.service";
import {
  AdvanceViewModel,
  AdvancedListModel,
} from "../../../core/models/advance-model/advance.model";
import { ToastrService } from "ngx-toastr";
import { GridOptions } from "ag-grid-community";
import { BasicInfoComponent } from "src/app/shared/ui/basic-info/basic-info.component";
import { SearchModel } from "src/app/core/models/search-model";
import { PortalUserViewModel } from "src/app/core/models/auth.models";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit, OnDestroy {
  subSink: SubSink;
  listData: AdvanceViewModel[];
  initModel: AdvancedListModel;
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
    private advanceService: AdvanceService,
    private dataService: DataService
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
    this.portalUserViewModel = JSON.parse(
      localStorage.getItem("currentLoginUser")
    );
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
    this.subSink.sink = this.advanceService.getDataByParams(model).subscribe(
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
        width: 100,
        cellRendererFramework: ActionDetailsComponent,
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
