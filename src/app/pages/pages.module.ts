import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule , NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { LightboxModule } from 'ngx-lightbox';
import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { AdvancesModule } from './advance/advances.module';
import { SettlementModule } from './settlement/settlement.module';
import { HttpClientModule } from '@angular/common/http';
import { ApproverModule } from './approver/approver.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeProfilePicComponent } from './change-profilepic/change-profilepic.component';
import { ArchwizardModule } from 'angular-archwizard';
import { TravelAuthorisationModule } from './travel-authorisation/travel-authorisation.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReleiverModule } from './releiver/releiver.module';
import { AdminSetupModule } from './adminsetup/adminSetup.module';
import { UserModule } from './Users/user.module';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);

@NgModule({
  declarations: [
    ChangePasswordComponent,
    ChangeProfilePicComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbModalModule,
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    AdvancesModule,
    SettlementModule,
    ReleiverModule,
    UserModule,
    AdminSetupModule,
    ApproverModule,
    HttpClientModule,
    UIModule,
    WidgetModule,
    FullCalendarModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SimplebarAngularModule,
    LightboxModule,
    NgSelectModule,
    ArchwizardModule,
    TranslateModule,
    TravelAuthorisationModule,
  ],
})
export class PagesModule { }
