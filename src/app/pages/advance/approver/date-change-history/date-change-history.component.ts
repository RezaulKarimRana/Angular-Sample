import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdvanceDateChangeHistoryViewModel } from 'src/app/core/models/advance-model/advance.model';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-date-change-history',
  templateUrl: './date-change-history.component.html',
  styleUrls: ['./date-change-history.component.scss']
})
export class DateChangeHistoryComponent implements OnInit, OnDestroy {

  @Input() public aModelList: AdvanceDateChangeHistoryViewModel;
  subSink: SubSink;
  
  constructor(
    public activeModal: NgbActiveModal
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
