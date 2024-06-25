import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TravelAuthorizationDetailsItem } from 'src/app/core/models/travel-authorisation-model/travelAuthorisation.model';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-travel-authorization-advance-info-details',
  templateUrl: './travel-authorization-advance-info-details.component.html',
  styleUrls: ['./travel-authorization-advance-info-details.component.scss']
})
export class TravelAuthorizationAdvanceInfoDetailsComponent implements OnDestroy,OnInit {

  innerWidth: any;
  subSink = new SubSink();
  @Output()
	onInitalize: EventEmitter<TravelAuthorizationAdvanceInfoDetailsComponent> = new EventEmitter<TravelAuthorizationAdvanceInfoDetailsComponent>();
  @Input()
  IsWithAdvance: boolean;
  @Input()
  items: TravelAuthorizationDetailsItem[] = [];
  @Input()
  totalExpense: string;

  constructor(
  ) {
    this.subSink = new SubSink();
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
		this.onInitalize.emit(this);
  }
  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth + 'Resize');
  }
}