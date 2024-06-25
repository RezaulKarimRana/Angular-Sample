import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateReleiverComponent } from './create-releiver/create-releiver.component';
import { ListComponent } from './list/list.component';
import { ApproverEntryComponent } from './approver-entry/approver-entry.component';
import { DetailComponent } from './detail/detail.component';
import { ApprovalPendingComponent } from './approval-pending/approval-pending.component';
const routes: Routes = [
    {
        path: 'add-edit',
        component: CreateReleiverComponent
    },
    {
        path: 'list',
        component: ListComponent
    },
    {
        path: 'detail',
        component: DetailComponent
    },
    {
        path: 'approval-pending',
        component: ApprovalPendingComponent
    },
    {
        path: 'approver-entry',
        component: ApproverEntryComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReleiverRoutingModule {}


