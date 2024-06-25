import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { AdvanceApprovers } from 'src/app/core/models/advance-model/advance.model';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-approver-details',
  templateUrl: './approver-details.component.html',
  styleUrls: ['./approver-details.component.scss']
})

export class ApproverDetailsComponent implements OnInit,OnDestroy {

  AdvanceApprovers: AdvanceApprovers[];
  subSink: SubSink;

  constructor() { }

  agInit(params)
  {
    this.AdvanceApprovers =params.data.AdvanceApprovers;
  }
  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.subSink)
      this.subSink.unsubscribe();
  }

}
