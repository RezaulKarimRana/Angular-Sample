import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbTimepickerModule,
  NgbDropdownModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import { PagetitleComponent } from "./pagetitle/pagetitle.component";
import { LoaderComponent } from "./loader/loader.component";
import { CustomSlideComponent } from "./custom-slide/custom-slide.component";
import { ErrorHandlerComponent } from "./error-handler/error-handler.component";
import { EmployeeInfoComponent } from "./employee-info/employee-info.component";
import { LoaderCustomComponent } from "./loader-custom/loader-custom.component";
import { CustomSlideYesNoComponent } from "./custom-slide-yes-no/custom-slide-yes-no.component";
import { RequesterEmployeeInfoComponent } from "./requester-employee-info/requester-employee-info.component";
import { BankAccountComponent } from "./bank-account/bank-account.component";
import { ApprovalHistoryComponent } from "./approval-history/approval-history.component";
import { ApprovalFlowDetailsComponent } from "./approval-flow-details/approval-flow-details.component";
import { InternalControlDetailsComponent } from "./internal-control-details/internal-control-details.component";
import { AdvancedBudgetDetailsComponent } from "./advanced-budget-details/advanced-budget-details.component";
import { CustomSlideLanguageComponent } from "./custom-slide-language/custom-slide-language.component";
import { TranslateModule } from "@ngx-translate/core";
import { TravelAuthorizationAdvanceInfoComponent } from "./travel-authorization-advance-info/travel-authorization-advance-info.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { TravelAuthorizationAdvanceInfoDetailsComponent } from "./travel-authorization-advance-info-details/travel-authorization-advance-info-details.component";
import { AdvanceBasicInfoComponent } from "./advance-basic-info/advance-basic-info.component";
import { ApproverActionFormComponent } from "./approver-action-form/approver-action-form.component";
import { FinanceHoldHistoryComponent } from "./finance-hold-history/finance-hold-history.component";
import { AdvanceSettlementBudgetDetailsComponent } from "./advance-settlement-budget-details/advance-settlement-budget-details.component";
import { BasicInfoComponent } from "./basic-info/basic-info.component";
import { SearchBarComponent } from "./search-bar/search-bar.component";
@NgModule({
  declarations: [
    PagetitleComponent,
    LoaderComponent,
    CustomSlideComponent,
    CustomSlideYesNoComponent,
    CustomSlideLanguageComponent,
    ErrorHandlerComponent,
    EmployeeInfoComponent,
    LoaderCustomComponent,
    RequesterEmployeeInfoComponent,
    BankAccountComponent,
    ApprovalHistoryComponent,
    ApprovalFlowDetailsComponent,
    InternalControlDetailsComponent,
    AdvancedBudgetDetailsComponent,
    TravelAuthorizationAdvanceInfoComponent,
    TravelAuthorizationAdvanceInfoDetailsComponent,
    ApproverActionFormComponent,
    AdvanceBasicInfoComponent,
    ApproverActionFormComponent,
    FinanceHoldHistoryComponent,
    AdvanceSettlementBudgetDetailsComponent,
    BasicInfoComponent,
    SearchBarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbDropdownModule,
    NgSelectModule,
    NgbNavModule,
    TranslateModule,
  ],
  exports: [
    PagetitleComponent,
    LoaderComponent,
    CustomSlideComponent,
    CustomSlideYesNoComponent,
    CustomSlideLanguageComponent,
    ErrorHandlerComponent,
    EmployeeInfoComponent,
    LoaderCustomComponent,
    BankAccountComponent,
    ApprovalHistoryComponent,
    InternalControlDetailsComponent,
    ApprovalFlowDetailsComponent,
    AdvancedBudgetDetailsComponent,
    RequesterEmployeeInfoComponent,
    AdvanceBasicInfoComponent,
    TravelAuthorizationAdvanceInfoComponent,
    TravelAuthorizationAdvanceInfoDetailsComponent,
    ApproverActionFormComponent,
    FinanceHoldHistoryComponent,
    AdvanceSettlementBudgetDetailsComponent,
    SearchBarComponent,
  ],
})
export class UIModule {}
