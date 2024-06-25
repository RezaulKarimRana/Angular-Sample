import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { SupervisorListComponent } from './supervisor-list/supervisor-list.component';
import { TravelAuthDashboardComponent } from './travel-auth-dashboard/travel-auth-dashboard.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ApprovedBillsComponent } from './approved-bills/approved-bills.component';
import { RIO4Component } from './rio4/rio4.component';
import { RIO3Component } from './rio3/rio3.component';
import { RIO2Component } from './rio2/rio2.component';
import { RIO1Component } from './rio1/rio1.component';

    
const routes: Routes = [
    {
        
        path: 'add-edit',
        component: AddEditComponent
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
        path: 'supervisorlist',
        component: SupervisorListComponent
    },
    {
        path: 'dashboard',
        component: TravelAuthDashboardComponent
    },
    {
        path: 'approved-bills',
        component: ApprovedBillsComponent
    },
    {
        path: 'rio-1',
        component: RIO1Component
    },
    {
        path: 'rio-2',
        component: RIO2Component
    },
    {
        path: 'rio-3',
        component: RIO3Component
    },
    {
        path: 'rio-4',
        component: RIO4Component
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TravelAuthorisationRoutingModule {}


