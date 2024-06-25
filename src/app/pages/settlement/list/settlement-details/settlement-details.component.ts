import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settlement-details',
  templateUrl: './settlement-details.component.html',
  styleUrls: ['./settlement-details.component.scss']
})
export class SettlementDetailsComponent implements OnInit {

  totalExpense:number;
  totalAdvance:number;
  dueOrRefund:number;

  constructor() { }

  agInit(params)
  {
    this.totalExpense = params.data.TotalExpense;
    this.totalAdvance = params.data.TotalAdvance;
    this.dueOrRefund = params.data.StringTotalDue;
  }

  ngOnInit(): void {
  }

}
