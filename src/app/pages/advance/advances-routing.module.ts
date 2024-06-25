import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./list/list.component";
import { DetailComponent } from "./detail/detail.component";
import { AdvanceApproverEntryComponent } from "./approver/approver-entry/approver-entry.component";
import { AdvanceApproverListComponent } from "./approver/approver-list/list.component";
import { AdvanceSupervisorEntryComponent } from "./supervisor/supervisor-entry/supervisor-entry.component";
import { EditComponent } from "./edit/edit.component";
import { AdvanceDashboard } from "./advance-dashboard/advance-dashboard.component";
import { ApprovedBillsComponent } from "./approved-bills/approved-bills.component";
import { RIO1Component } from "./rio1/rio1.component";
import { RIO2Component } from "./rio2/rio2.component";
import { RIO4Component } from "./rio4/rio4.component";
import { RIO3Component } from "./rio3/rio3.component";

const routes: Routes = [
  {
    path: "add-edit",
    component: EditComponent,
  },
  {
    path: "list",
    component: ListComponent,
  },
  {
    path: "detail",
    component: DetailComponent,
  },
  {
    path: "detail/:id",
    component: DetailComponent,
  },
  {
    path: "approver-entry",
    component: AdvanceApproverEntryComponent,
  },
  {
    path: "pending-list",
    component: AdvanceApproverListComponent,
  },
  {
    path: "supervisor-entry",
    component: AdvanceSupervisorEntryComponent,
  },
  {
    path: "advance-dashboard",
    component: AdvanceDashboard,
  },
  {
    path: "approved-bills",
    component: ApprovedBillsComponent,
  },
  {
    path: "rio-1",
    component: RIO1Component,
  },
  {
    path: "rio-2",
    component: RIO2Component,
  },
  {
    path: "rio-3",
    component: RIO3Component,
  },
  {
    path: "rio-4",
    component: RIO4Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancesRoutingModule {}
