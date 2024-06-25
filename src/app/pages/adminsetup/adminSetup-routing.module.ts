import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodeNamePairListComponent } from './codenamepair/list/codenamelist.component';
import { TAdAListComponent } from './tAdA/t-ad-a-list/t-ad-a-list.component';
import { BankAccountListComponent } from './bankaccount/bankaccount-list/bankaccount-list.component';
import { TadaBulkAddComponent } from './tAdA/tada-bulk-add/tada-bulk-add.component';
import { OfficeLocationListComponent } from './officeLocation/list/list.component';
import { SubMenuListComponent } from './menu-permissions/sub-menu/list/list.component';
import { MenuListComponent } from './menu-permissions/menu/list/list.component';
import { TaskTypeDetailsListComponent } from './tasktypedetails/list/tasktypedetailslist.component';
import { RolesListComponent } from './menu-permissions/roles/list/list.component';
import { UserRolesListComponent } from './menu-permissions/user-roles/list/list.component';
import { SubMenuRolesListComponent } from './menu-permissions/sub-Menu-Roles/list/list.component';
import { MenuRolesListComponent } from './menu-permissions/menu-Roles/list/list.component';
import { DistrictListComponent } from './district/district-list/district-list.component';
import { UserInfoUpdateComponent } from './user-info-update/user-info-update.component';
import { AdvanceparticularComponent } from './advanceparticular/advanceparticular.component';
import { AdvanceSettlementParticularsComponent } from './advance-settlement-particulars/advance-settlement-particulars.component';

const routes: Routes = [
  {
    path: 'company/list',
    component: CodeNamePairListComponent
  },
  {
    path: 'employeetype/list',
    component: CodeNamePairListComponent
  },
  {
    path: 'designation/list',
    component: CodeNamePairListComponent
  },
  {
    path: 'district/list',
    component: DistrictListComponent
  },
  {
    path: 'department/list',
    component: CodeNamePairListComponent
  },
  {
    path: 'officeLocation/list',
    component: OfficeLocationListComponent
  },
  {
    path: 'taskType/list',
    component: CodeNamePairListComponent
  },
  {
    path: 'taskTypeDetails/list',
    component: TaskTypeDetailsListComponent
  },
  {
    path: 'adminsetup/advanceparticular',
    component: AdvanceparticularComponent
  },
  {
    path: 'adminsetup/arsettlementparticular',
    component: AdvanceSettlementParticularsComponent
  },
  {
    path: 'thana/list',
    component: CodeNamePairListComponent
  },
  {
    path: 'adminsetup/tAdA-list',
    component: TAdAListComponent
  },
  {
    path: 'adminsetup/tAdA-Bulk-add',
    component: TadaBulkAddComponent
  },
  {
    path: 'bankaccount/list',
    component: BankAccountListComponent
  },
  {
    path: 'menus/list',
    component: MenuListComponent
  },
  {
    path: 'sub-menus/list',
    component: SubMenuListComponent
  },
  {
    path: 'roles/list',
    component: RolesListComponent
  },
  {
    path: 'user-roles/list',
    component: UserRolesListComponent
  },
  {
    path: 'menusRoles/list',
    component: MenuRolesListComponent
  },
  {
    path: 'subMenuRoles/list',
    component: SubMenuRolesListComponent
  },
  {
    path: 'support/user-info-update',
    component: UserInfoUpdateComponent
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSetupRoutingModule { }