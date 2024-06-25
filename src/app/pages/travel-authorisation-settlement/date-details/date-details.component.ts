import { Component, OnInit } from '@angular/core';
import { TravelAuthorizationType } from 'src/app/core/enums/constants';

@Component({
  selector: 'app-date-details',
  templateUrl: './date-details.component.html',
  styleUrls: ['./date-details.component.scss']
})
export class DateDetailsComponent implements OnInit {

  isWithAdvance: boolean;
  travelAuthorizationDate:string;
  advanceRequisitionDate:string;
  tentativeSettlementDate:string;

  constructor() { }

  agInit(params)
  {
    this.isWithAdvance = params.data.TravelAuthorizationTypeId == TravelAuthorizationType.WithAdvance;
    this.travelAuthorizationDate = params.data.TravelAuthorizationDateString;
    this.advanceRequisitionDate = params.data.AdvanceRequisitionDateString;
    this.tentativeSettlementDate = params.data.TentativeSettlementDateString;
  }

  ngOnInit(): void {
  }

}
