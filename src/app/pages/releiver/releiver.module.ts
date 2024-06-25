import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DndModule } from 'ngx-drag-drop';
import { NgbDropdownModule, NgbModalModule, NgbDatepickerModule,NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UIModule } from '../../shared/ui/ui.module'; 
import { CoreModule } from '../../core/core.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { ReleiverRoutingModule } from './releiver-routing.module';
import { CreateReleiverComponent } from './create-releiver/create-releiver.component';
import { ListComponent } from './list/list.component';
import { ActionDetailsComponent } from './action-details/action-details.component';
import { DetailComponent } from './detail/detail.component';
import { ApproverEntryComponent } from './approver-entry/approver-entry.component';
import { ApprovalPendingComponent } from './approval-pending/approval-pending.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    CreateReleiverComponent,
    ListComponent,
    ActionDetailsComponent,
    DetailComponent,
    ApproverEntryComponent,
    ApprovalPendingComponent
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
    NgSelectModule,
    ReleiverRoutingModule,
    AgGridModule.withComponents([])
  ],
})
export class ReleiverModule { }