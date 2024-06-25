import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-approver-details',
  templateUrl: './approver-details.component.html',
  styleUrls: ['./approver-details.component.scss']
})

export class ApproverDetailsComponent implements OnInit,OnDestroy {

  travelAuthApprovers: any[];
  subSink: SubSink;

  constructor() { }

  agInit(params)
  {
    this.travelAuthApprovers =params.data.TravelAuthApprovers;
  }
  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

}

