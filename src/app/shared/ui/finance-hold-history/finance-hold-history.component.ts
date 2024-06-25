import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AdvanceHistoryList } from 'src/app/core/models/advance-model/advance.model';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-finance-hold-history',
  templateUrl: './finance-hold-history.component.html',
  styleUrls: ['./finance-hold-history.component.scss']
})
export class FinanceHoldHistoryComponent implements OnDestroy,OnInit {

  subSink = new SubSink();
  @Input()
	historyList: AdvanceHistoryList[];

  constructor(
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
}
