import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AdvanceDetailsItemViewModel } from 'src/app/core/models/advance-model/advance.model';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-advanced-budget-details',
  templateUrl: './advanced-budget-details.component.html',
  styleUrls: ['./advanced-budget-details.component.scss']
})
export class AdvancedBudgetDetailsComponent implements OnDestroy,OnInit {

  subSink = new SubSink();
  @Input()
	itemList: any;
  @Input()
	totalExpense: number;
  @Input()
	canEdit: boolean;
  @Input()
	canEditTally: boolean;
  @Input()
	canViewTally: boolean;
  
  constructor() {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  deleteMember(_advanceDetails: AdvanceDetailsItemViewModel) {
    const index = this.itemList.indexOf(_advanceDetails);
		if (index >= 0) {
			this.itemList.splice(index, 1);
      this.totalExpense = this.itemList.reduce((sum, item) => sum + item.Total, 0).toLocaleString();
		}
  }
}
