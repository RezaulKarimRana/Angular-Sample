import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./list/list.component";
import { DetailComponent } from "./detail/detail.component";
import { SupervisorListComponent } from "./supervisor-list/supervisor-list.component";
import { TravelAuthSettlementDashboardComponent } from "./travel-auth-settlement-dashboard/travel-auth-settlement-dashboard.component";
import { ReadyListComponent } from "./ready-list/ready-list.component";
import { EditSettlementComponent } from "./edit-settlement/edit-settlement.component";
import { CreateSettlementComponent } from "./create-settlement/create-settlement.component";
import { ApproverEntryComponent } from "./approver-entry/approver-entry.component";
import { NewSettlementComponent } from "./new-settlement/new-settlement.component";

const routes: Routes = [
  {
    path: "create",
    component: CreateSettlementComponent,
  },
  {
    path: "new",
    component: NewSettlementComponent,
  },
  {
    path: "edit",
    component: EditSettlementComponent,
  },
  {
    path: "check",
    component: ApproverEntryComponent,
  },
  {
    path: "readylist",
    component: ReadyListComponent,
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
    path: "myapprovals",
    component: SupervisorListComponent,
  },
  {
    path: "dashboard",
    component: TravelAuthSettlementDashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelAuthorisationSettlementRoutingModule {}
