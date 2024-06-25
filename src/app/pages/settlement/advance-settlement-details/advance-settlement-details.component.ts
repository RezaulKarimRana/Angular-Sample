import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advance-settlement-details',
  templateUrl: './advance-settlement-details.component.html',
  styleUrls: ['./advance-settlement-details.component.scss']
})
export class AdvanceSettlementDetailsComponent implements OnInit {

  advanceTypeName:string;
  totalAmount: string;
  totalCost: string;
  totalDueOrRefund: string;
  statusName:string;
  isRevisedBill: boolean;

  constructor() { }

  agInit(params)
  {
    this.advanceTypeName = params.data.AdvanceTypeName;
    this.totalAmount = params.data.TotalAmount;
    this.totalCost = params.data.TotalCost;
    this.totalDueOrRefund = params.data.TotalDue == 0 ? params.data.TotalRefund : params.data.TotalDue;
    this.statusName = params.data.StatusName;
    this.isRevisedBill = params.data.IsRevisedBill;
  }

  ngOnInit(): void {
  }

}