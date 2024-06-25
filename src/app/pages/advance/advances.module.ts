import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "ng2-file-upload";
import { NgApexchartsModule } from "ng-apexcharts";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { DndModule } from "ngx-drag-drop";
import {
  NgbDropdownModule,
  NgbModalModule,
  NgbDatepickerModule,
  NgbCollapseModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";

import { AdvancesRoutingModule } from "./advances-routing.module";
import { UIModule } from "../../shared/ui/ui.module";

import { DetailComponent } from "./detail/detail.component";
import { ListComponent } from "./list/list.component";
import { CoreModule } from "../../core/core.module";

import { AdvanceApproverEntryComponent } from "./approver/approver-entry/approver-entry.component";
import { AdvanceApproverListComponent } from "./approver/approver-list/list.component";

import { AdvanceSupervisorEntryComponent } from "./supervisor/supervisor-entry/supervisor-entry.component";
import { AgGridModule } from "ag-grid-angular";
import { DateDetailsComponent } from "./list/date-details/date-details.component";
import { AdvanceDetailsComponent } from "./list/advance-details/advance-details.component";
import { ActionDetailsComponent } from "./list/action-details/action-details.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { EditComponent } from "./edit/edit.component";
import { ApproverActionComponent } from "./approver/approver-action/approver-action.component";
import { AdvanceDashboard } from "./advance-dashboard/advance-dashboard.component";
import { CheckBoxActionComponent } from "./approver/check-box-action/check-box-action.component";

//Advance Dashboard
import { ApproverDetailsComponent } from "./advance-dashboard/approver-details/approver-details.component";
import { AdvanceDashboardAction } from "./advance-dashboard/advance-dashboard-action/advance-dashboard-action.component";
import { DateChangeHistoryComponent } from "./approver/date-change-history/date-change-history.component";
import { TranslateModule } from "@ngx-translate/core";
import { ApprovedBillsComponent } from "./approved-bills/approved-bills.component";
import { ApprovedBillsDetailsComponent } from "./approved-bills-details/approved-bills-details.component";
import { RIO1Component } from "./rio1/rio1.component";
import { RIO2Component } from "./rio2/rio2.component";
import { RIO3Component } from "./rio3/rio3.component";
import { RIO4Component } from "./rio4/rio4.component";

@NgModule({
  declarations: [
    ListComponent,
    DetailComponent,
    AdvanceApproverEntryComponent,
    AdvanceApproverListComponent,
    AdvanceSupervisorEntryComponent,
    DateDetailsComponent,
    AdvanceDetailsComponent,
    ActionDetailsComponent,
    EditComponent,
    ApproverActionComponent,
    AdvanceDashboard,
    ApproverDetailsComponent,
    AdvanceDashboardAction,
    CheckBoxActionComponent,
    DateChangeHistoryComponent,
    ApprovedBillsComponent,
    ApprovedBillsDetailsComponent,
    RIO1Component,
    RIO2Component,
    RIO3Component,
    RIO4Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdvancesRoutingModule,
    UIModule,
    NgApexchartsModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbCollapseModule,
    NgbNavModule,
    CKEditorModule,
    DndModule,
    NgbDropdownModule,
    CoreModule,
    FileUploadModule,
    NgSelectModule,
    TranslateModule,
    AgGridModule.withComponents([]),
  ],
})
export class AdvancesModule {}
