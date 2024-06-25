import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettlementRoutingModule } from "./settlement-routing.module";
import { UIModule } from "../../shared/ui/ui.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { CoreModule } from "../../core/core.module";
import { DetailComponent } from "./detail/detail.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { AgGridModule } from "ag-grid-angular";
import { SettlementDetailsComponent } from "./list/settlement-details/settlement-details.component";
import { SettlementApproverEntryComponent } from "./approver/approver-entry/approver-entry.component";
import { CheckBoxActionComponent } from "./approver/check-box-action/check-box-action.component";
import { ActionDetailsComponent } from "./list/action-details/action-details.component";
import { FileUploadModule } from "ng2-file-upload";
import { TranslateModule } from "@ngx-translate/core";
import { ReadyForSettlementComponent } from "./ready-for-settlement/ready-for-settlement.component";
import { MyListComponent } from "./my-list/my-list.component";
import { MyApprovalsComponent } from "./my-approvals/my-approvals.component";
import { DateDetailsComponent } from "./date-details/date-details.component";
import { AdvanceDetailsComponent } from "./advance-details/advance-details.component";
import { MakeSettlementComponent } from "./make-settlement/make-settlement.component";
import { CreateSettlementComponent } from "./create-settlement/create-settlement.component";
import { AdvanceSettlementDetailsComponent } from "./advance-settlement-details/advance-settlement-details.component";
import { ApproverActionSummaryComponent } from "./approver-action-summary/approver-action-summary.component";
import { EditComponent } from "./edit/edit.component";
import { NewSettlementComponent } from "./new-settlement/new-settlement.component";
@NgModule({
  declarations: [
    DetailComponent,
    SettlementDetailsComponent,
    SettlementApproverEntryComponent,
    SettlementDetailsComponent,
    CheckBoxActionComponent,
    ActionDetailsComponent,
    ReadyForSettlementComponent,
    MyListComponent,
    MyApprovalsComponent,
    DateDetailsComponent,
    AdvanceDetailsComponent,
    MakeSettlementComponent,
    CreateSettlementComponent,
    AdvanceSettlementDetailsComponent,
    ApproverActionSummaryComponent,
    EditComponent,
    NewSettlementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettlementRoutingModule,
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
export class SettlementModule {}
