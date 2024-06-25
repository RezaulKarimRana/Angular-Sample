import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/core/base/base.service';
import { BaseComponent } from 'src/app/core/base/component/base/base.component';
import { AdvanceSettlementDetailsItemViewModel } from 'src/app/core/models/settlement-model/settlement.model';
import { AdvanceSettlementService } from 'src/app/core/services/Settlement/advanceSettlement.service';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-advance-settlement-budget-details',
  templateUrl: './advance-settlement-budget-details.component.html',
  styleUrls: ['./advance-settlement-budget-details.component.scss']
})
export class AdvanceSettlementBudgetDetailsComponent extends BaseComponent implements OnDestroy,OnInit {

  subSink = new SubSink();
  @Input()
	itemList: any;
  @Input()
	totalAmount: number;
  @Input()
	totalCost: number;
  @Input()
	totalDue: number;
  @Input()
	totalRefund: number;
  @Input()
	isDue: boolean;
  @Input()
	isRefund: boolean;
  @Input()
	canEdit: boolean;
  
  constructor(
    toaster: ToastrService,
    baseService: BaseService,
  ) {
    super(toaster,baseService);
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  deleteMember(_advanceDetails: AdvanceSettlementDetailsItemViewModel) {
    const index = this.itemList.indexOf(_advanceDetails);
		if (index >= 0) {
			this.itemList.splice(index, 1);
		}
  }
}

