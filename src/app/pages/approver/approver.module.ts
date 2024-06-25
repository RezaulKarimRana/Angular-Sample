
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UIModule } from '../../shared/ui/ui.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApproverRoutingModule } from './approver-routing.module';
import { ApproverGroupListComponent } from './approver-group-list/approver-group-list.component';
import { ApproverSubGroupListComponent } from './approver-sub-group-list/approver-sub-group-list.component';
import { ApproverSubGroupUserListComponent } from './approver-sub-group-user-list/approver-sub-group-user-list.component';
import { AddvanceApproverMatrixListComponent } from './addvance-approver-matrix-list/addvance-approver-matrix-list.component';
import { AddEditApproverGroupComponent } from './add-edit-approver-group/add-edit-approver-group.component';
import { AddEditApproverSubGroupComponent } from './add-edit-approver-sub-group/add-edit-approver-sub-group.component';
import { AddEditApproverSubGrouUserListComponent } from './add-edit-approver-sub-grou-user-list/add-edit-approver-sub-grou-user-list.component';
import { AddEditAdvanceApproverMatrixComponent } from './add-edit-advance-approver-matrix/add-edit-advance-approver-matrix.component';
import { ApproverMatrixCreationBulkComponent } from './approver-matrix-bulk-creation/approver-matrix-bulk-creation.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    ApproverGroupListComponent,
    ApproverSubGroupListComponent,
    ApproverSubGroupUserListComponent,
    AddvanceApproverMatrixListComponent,
    AddEditApproverGroupComponent,
    AddEditApproverSubGroupComponent,
    AddEditApproverSubGrouUserListComponent,
    AddEditAdvanceApproverMatrixComponent,
    ApproverMatrixCreationBulkComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ApproverRoutingModule,
    UIModule,
    NgbTooltipModule,
    NgSelectModule,
    TranslateModule,
    AgGridModule.withComponents([]),
  ],
})
export class ApproverModule { }