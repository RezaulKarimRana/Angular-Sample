import { Component, OnInit } from '@angular/core';
import { TravelAuthorizationType } from 'src/app/core/enums/constants';
@Component({
  selector: 'app-travel-auth-details',
  templateUrl: './travel-auth-details.component.html',
  styleUrls: ['./travel-auth-details.component.scss']
})
export class TravelAuthDetailsComponent implements OnInit {

  isWithAdvance: boolean;
  tAuthTypeName:string;
  totalAmount: string;
  statusName:string;
  isRevisedBill: boolean;

  constructor() { }

  agInit(params)
  {
    this.isWithAdvance = params.data.TravelAuthorizationTypeId == TravelAuthorizationType.WithAdvance;
    this.tAuthTypeName = params.data.TravelAuthorizationTypeName;
    this.totalAmount = params.data.TotalAmount;
    this.statusName = params.data.StatusName;
    this.isRevisedBill = params.data.IsRevisedBill;
  }

  ngOnInit(): void {
  }

}
