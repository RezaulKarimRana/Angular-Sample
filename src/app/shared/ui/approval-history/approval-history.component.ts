import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AdvanceHistoryList } from 'src/app/core/models/advance-model/advance.model';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-approval-history',
  templateUrl: './approval-history.component.html',
  styleUrls: ['./approval-history.component.scss']
})
export class ApprovalHistoryComponent implements OnDestroy,OnInit {

  subSink = new SubSink();
  @Input()
	canView: boolean;
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
