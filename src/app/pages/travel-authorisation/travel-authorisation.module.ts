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
import { TravelAuthorisationRoutingModule } from './travel-authorisation-routing.module';
import { ListComponent } from './list/list.component';
import { ActionDetailsComponent } from './action-details/action-details.component';
import { SupervisorListComponent } from './supervisor-list/supervisor-list.component';
import { TravelAuthDashboardComponent } from './travel-auth-dashboard/travel-auth-dashboard.component';
import { TravelAuthDetailsComponent } from './travel-auth-details/travel-auth-details.component';
import { DateDetailsComponent } from './date-details/date-details.component';
import { ApproverDetailsComponent } from './approver-details/approver-details.component';
import { DashboardActionComponent } from './dashboard-action/dashboard-action.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ApprovedBillsComponent } from './approved-bills/approved-bills.component';
import { ApprovedBillsDetailsComponent } from './approved-bills-details/approved-bills-details.component';
import { RIO1Component } from './rio1/rio1.component';
import { RIO2Component } from './rio2/rio2.component';
import { RIO3Component } from './rio3/rio3.component';
import { RIO4Component } from './rio4/rio4.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
       DetailComponent,
       ListComponent,
       ActionDetailsComponent,
       SupervisorListComponent,
       TravelAuthDashboardComponent,
       TravelAuthDetailsComponent,
       DateDetailsComponent,
       ApproverDetailsComponent,
       DashboardActionComponent,
       AddEditComponent,
       ApprovedBillsComponent,
       ApprovedBillsDetailsComponent,
       RIO1Component,
       RIO2Component,
       RIO3Component,
       RIO4Component
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
    TravelAuthorisationRoutingModule,
    AgGridModule.withComponents([])
  ],
})
export class TravelAuthorisationModule { }