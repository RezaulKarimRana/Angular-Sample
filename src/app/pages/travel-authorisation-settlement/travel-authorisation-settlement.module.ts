import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DndModule } from 'ngx-drag-drop';
import { NgbDropdownModule, NgbModalModule, NgbDatepickerModule,NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UIModule } from '../../shared/ui/ui.module'; 
import { DetailComponent } from './detail/detail.component';
import { CoreModule } from '../../core/core.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListComponent } from './list/list.component';
import { ActionDetailsComponent } from './action-details/action-details.component';
import { SupervisorListComponent } from './supervisor-list/supervisor-list.component';
import { DateDetailsComponent } from './date-details/date-details.component';
import { ApproverDetailsComponent } from './approver-details/approver-details.component';
import { DashboardActionComponent } from './dashboard-action/dashboard-action.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TravelAuthSettlementDetailsComponent } from './travel-auth-settlement-details/travel-auth-settlement-details.component';
import { TravelAuthSettlementDashboardComponent } from './travel-auth-settlement-dashboard/travel-auth-settlement-dashboard.component';
import { TravelAuthorisationSettlementRoutingModule } from './travel-authorisation-settlement-routing.module';
import { ReadyListComponent } from './ready-list/ready-list.component';
import { MakeSettlementComponent } from './make-settlement/make-settlement.component';
import { SummaryDetailsComponent } from './summary-details/summary-details.component';
import { CreateSettlementComponent } from './create-settlement/create-settlement.component';
import { EditSettlementComponent } from './edit-settlement/edit-settlement.component';
import { ApproverEntryComponent } from './approver-entry/approver-entry.component';
import { TravelAllowanceCalculationComponent } from './travel-allowance-calculation/travel-allowance-calculation.component';
import { FoodAllowanceCalculationComponent } from './food-allowance-calculation/food-allowance-calculation.component';
import { NewSettlementComponent } from './new-settlement/new-settlement.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
       DetailComponent,
       ListComponent,
       ActionDetailsComponent,
       SupervisorListComponent,
       TravelAuthSettlementDashboardComponent,
       TravelAuthSettlementDetailsComponent,
       DateDetailsComponent,
       ApproverDetailsComponent,
       DashboardActionComponent,
       ReadyListComponent,
       MakeSettlementComponent,
       SummaryDetailsComponent,
       CreateSettlementComponent,
       EditSettlementComponent,
       ApproverEntryComponent,
       TravelAllowanceCalculationComponent,
       FoodAllowanceCalculationComponent,
       NewSettlementComponent
  ],
  imports: [
    CommonModule,
    TranslateModule ,
    FormsModule,
    ReactiveFormsModule,
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
    TravelAuthorisationSettlementRoutingModule,
    AgGridModule.withComponents([])
  ],
})
export class TravelAuthorisationSettlementModule { }