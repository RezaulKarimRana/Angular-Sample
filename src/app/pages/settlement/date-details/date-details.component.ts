import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-details',
  templateUrl: './date-details.component.html',
  styleUrls: ['./date-details.component.scss']
})
export class DateDetailsComponent implements OnInit {

  arDate:string;
  requiredDate:string;
  tentativeDate:string;

  constructor() { }

  agInit(params)
  {
    this.arDate = params.data.ARDateString;
    this.requiredDate = params.data.ARRequiredDateString;
    this.tentativeDate = params.data.TentativeSettlementDateString;
  }

  ngOnInit(): void {
  }

}