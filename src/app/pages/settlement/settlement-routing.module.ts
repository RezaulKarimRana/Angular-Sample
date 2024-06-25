import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DetailComponent } from "./detail/detail.component";
import { SettlementApproverEntryComponent } from "./approver/approver-entry/approver-entry.component";
import { MyApprovalsComponent } from "./my-approvals/my-approvals.component";
import { MyListComponent } from "./my-list/my-list.component";
import { ReadyForSettlementComponent } from "./ready-for-settlement/ready-for-settlement.component";
import { CreateSettlementComponent } from "./create-settlement/create-settlement.component";
import { EditComponent } from "./edit/edit.component";
import { NewSettlementComponent } from "./new-settlement/new-settlement.component";

const routes: Routes = [
  {
    path: "detail",
    component: DetailComponent,
  },
  {
    path: "approver-entry",
    component: SettlementApproverEntryComponent,
  },
  {
    path: "readyforsettlement",
    component: ReadyForSettlementComponent,
  },
  {
    path: "mylist",
    component: MyListComponent,
  },
  {
    path: "myapprovals",
    component: MyApprovalsComponent,
  },
  {
    path: "create",
    component: CreateSettlementComponent,
  },
  {
    path: "edit",
    component: EditComponent,
  },
  {
    path: "new",
    component: NewSettlementComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettlementRoutingModule {}
