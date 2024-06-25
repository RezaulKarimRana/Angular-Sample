import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { UIModule } from '../../shared/ui/ui.module';
import { CodeNamePairListComponent } from './codenamepair/list/codenamelist.component';
import { CodeNamePairAddEditComponent } from './codenamepair/add-edit/add-edit.component';
import { AdminSetupRoutingModule } from './adminSetup-routing.module';
import { BankAccountListComponent } from './bankaccount/bankaccount-list/bankaccount-list.component';
import { AddEditBankAccountComponent } from './bankaccount/add-edit-bankaccount/add-edit-bankaccount.component';
import { TaskTypeDetailsListComponent } from './tasktypedetails/list/tasktypedetailslist.component';
import { TaskTypeDetailsAddEditComponent } from './taskTypeDetails/add-edit/add-edit.component';
import { AddEditTAdAComponent } from './tAdA/add-edit-t-ad-a/add-edit-t-ad-a.component';
import { TAdAListComponent } from './tAdA/t-ad-a-list/t-ad-a-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GroupUserListComponent } from './groupUser/group-user-list/group-user-list.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TadaBulkAddComponent } from './tAdA/tada-bulk-add/tada-bulk-add.component';
import { AgGridModule } from 'ag-grid-angular';
import { TranslateModule } from '@ngx-translate/core';
import { OfficeLocationAddEditComponent } from './officeLocation/add-edit/add-edit.component';
import { OfficeLocationListComponent } from './officeLocation/list/list.component';
import { MenuAddEditComponent } from './menu-permissions/menu/add-edit/add-edit.component';
import { MenuListComponent } from './menu-permissions/menu/list/list.component';
import { SubMenuListComponent } from './menu-permissions/sub-menu/list/list.component';
import { SubMenuAddEditComponent } from './menu-permissions/sub-menu/add-edit/add-edit.component';
import { RolesAddEditComponent } from './menu-permissions/roles/add-edit/add-edit.component';
import { RolesListComponent } from './menu-permissions/roles/list/list.component';
import { UserRolesAddEditComponent } from './menu-permissions/user-roles/add-edit/add-edit.component';
import { UserRolesListComponent } from './menu-permissions/user-roles/list/list.component';
import { MenuRolesAddEditComponent } from './menu-permissions/menu-Roles/add-edit/add-edit.component';
import { MenuRolesListComponent } from './menu-permissions/menu-Roles/list/list.component';
import { SubMenuRolesAddEditComponent } from './menu-permissions/sub-Menu-Roles/add-edit/add-edit.component';
import { SubMenuRolesListComponent } from './menu-permissions/sub-Menu-Roles/list/list.component';
import { DistrictListComponent } from './district/district-list/district-list.component';
import { AddEditDistrictComponent } from './district/add-edit-district/add-edit-district.component';
import { UserInfoUpdateComponent } from './user-info-update/user-info-update.component';
import { AdvanceparticularComponent } from './advanceparticular/advanceparticular.component';
import { AdvanceParticularAddEditComponent } from './advance-particular-add-edit/advance-particular-add-edit.component';
import { AdvanceSettlementParticularsComponent } from './advance-settlement-particulars/advance-settlement-particulars.component';
import { AdvanceSettlementParticularAddEditComponent } from './advance-settlement-particular-add-edit/advance-settlement-particular-add-edit.component';


@NgModule({
  declarations: [CodeNamePairListComponent,
    CodeNamePairAddEditComponent,
    OfficeLocationAddEditComponent,
    OfficeLocationListComponent,
    AddEditTAdAComponent,
    TAdAListComponent,
    AddEditBankAccountComponent,
    BankAccountListComponent,
    TaskTypeDetailsListComponent,
    TaskTypeDetailsAddEditComponent,
    GroupUserListComponent,
    TadaBulkAddComponent,
    MenuAddEditComponent,
    SubMenuAddEditComponent,
    MenuListComponent,
    SubMenuListComponent,
    RolesAddEditComponent,
    RolesListComponent,
    UserRolesAddEditComponent,
    UserRolesListComponent,
    MenuRolesAddEditComponent,
    MenuRolesListComponent,
    SubMenuRolesAddEditComponent,
    SubMenuRolesListComponent,
    AddEditDistrictComponent,
    DistrictListComponent,
    UserInfoUpdateComponent,
    AdvanceparticularComponent,
    AdvanceParticularAddEditComponent,
    AdvanceSettlementParticularsComponent,
    AdvanceSettlementParticularAddEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    AdminSetupRoutingModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbDropdownModule,
    NgSelectModule,
    Ng2SearchPipeModule,
    TranslateModule,
    AgGridModule.withComponents([]),
  ]
})
export class AdminSetupModule { }