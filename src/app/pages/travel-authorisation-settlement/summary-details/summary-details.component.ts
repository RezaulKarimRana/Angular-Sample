import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-details',
  templateUrl: './summary-details.component.html'
})
export class SummaryDetailsComponent implements OnInit {

  totalAmount: string;
  totalCost: string;
  totalDueOrRefund: string;
  statusName:string;
  isRevisedBill: boolean;

  constructor() { }

  agInit(params)
  {
    this.totalAmount = params.data.TotalAmount;
    this.totalCost = params.data.TotalCost;
    this.totalDueOrRefund = params.data.TotalDue <= 0 ? params.data.TotalRefund : params.data.TotalDue;
    this.statusName = params.data.StatusName;
    this.isRevisedBill = params.data.IsRevisedBill;
  }

  ngOnInit(): void {
  }

}
