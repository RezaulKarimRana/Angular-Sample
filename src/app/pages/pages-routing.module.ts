import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserRoles} from '../core/enums/constants';

const routes: Routes = [
  { path: '', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'travelauthorisation', loadChildren: () => import('./travel-authorisation/travel-authorisation.module').then(m => m.TravelAuthorisationModule) },
  { path: 'advances', loadChildren: () => import('./advance/advances.module').then(m => m.AdvancesModule) },
  { path: 'advanceSettlement', loadChildren: () => import('./settlement/settlement.module').then(m => m.SettlementModule) },
  { path: 'taSettlement', loadChildren: () => import('./travel-authorisation-settlement/travel-authorisation-settlement.module').then(m => m.TravelAuthorisationSettlementModule) },
  { path: 'releiver', loadChildren: () => import('./releiver/releiver.module').then(m => m.ReleiverModule) },
  { path: 'adminSetup', loadChildren: () => import('./adminsetup/adminSetup.module').then(m => m.AdminSetupModule),data: { roles: [UserRoles.SUPERADMIN] } },
  { path: 'users', loadChildren: () => import('./Users/user.module').then(m => m.UserModule), data: { roles: [UserRoles.SUPERADMIN] } },
  { path: 'approver', loadChildren: () => import('./approver/approver.module').then(m => m.ApproverModule), data: { roles: [UserRoles.SUPERADMIN] } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
