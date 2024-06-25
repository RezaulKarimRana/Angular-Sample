import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advance-details',
  templateUrl: './advance-details.component.html',
  styleUrls: ['./advance-details.component.scss']
})
export class AdvanceDetailsComponent implements OnInit {

  advanceTypeName:string;
  totalAmount: string;
  statusName:string;
  isRevisedBill: boolean;

  constructor() { }

  agInit(params)
  {
    this.advanceTypeName = params.data.AdvanceTypeName;
    this.totalAmount = params.data.TotalAmount;
    this.statusName = params.data.StatusName;
    this.isRevisedBill = params.data.IsRevisedBill;
  }

  ngOnInit(): void {
  }

}
