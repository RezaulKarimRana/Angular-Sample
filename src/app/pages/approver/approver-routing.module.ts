import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddvanceApproverMatrixListComponent } from './addvance-approver-matrix-list/addvance-approver-matrix-list.component';
import { ApproverGroupListComponent } from './approver-group-list/approver-group-list.component';
import { ApproverMatrixCreationBulkComponent } from './approver-matrix-bulk-creation/approver-matrix-bulk-creation.component';
import { ApproverSubGroupListComponent } from './approver-sub-group-list/approver-sub-group-list.component';
import { ApproverSubGroupUserListComponent } from './approver-sub-group-user-list/approver-sub-group-user-list.component';
    
const routes: Routes = [
    {
        path: 'approver-group',
        component: ApproverGroupListComponent
    },
    {
        path: 'approver-subgroup',
        component: ApproverSubGroupListComponent
    },
    {
        path: 'approver-subgroup-user',
        component: ApproverSubGroupUserListComponent
    },
    {       
        path: 'advance-approver-matrix',
        component: AddvanceApproverMatrixListComponent
    },
    {       
        path: 'approver-matrix-bulk-creation',
        component: ApproverMatrixCreationBulkComponent
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ApproverRoutingModule {}
