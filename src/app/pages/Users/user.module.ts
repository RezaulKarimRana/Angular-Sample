import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from '../../shared/ui/ui.module';
import { UserRoutingModule } from './user-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UsersListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    UIModule,
    NgbTooltipModule,
    NgSelectModule,
    ArchwizardModule,
    TranslateModule,
    AgGridModule.withComponents([]),
  ]
})
export class UserModule { }
