import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class DataService {

  @Output() userChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() advanceRequisitionChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() outstationRequisitionChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() settlementRequisitionChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() userProfilePicChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() travelAuthorizationChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() TASettlementChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() releiverChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() ARSettlementChanged: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

   emitUserListUpdated(values : boolean) {
    this.userChanged.emit(values);
  }
  emitUserAdvanceRequisitionListUpdated(values : boolean) {
    this.advanceRequisitionChanged.emit(values);
  }
  emitUserOutstationRequisitionListUpdated(values : boolean) {
    this.outstationRequisitionChanged.emit(values);
  }
  emitUserSettlementRequisitionListUpdated(values : boolean) {
    this.settlementRequisitionChanged.emit(values);
  }
  emitUserProfilePicUpdated(values : boolean) {
    this.userProfilePicChanged.emit(values);
  }
  emitTravelAuthorizationChanged(values : boolean) {
    this.travelAuthorizationChanged.emit(values);
  }
  emitARSettlementChanged(values : boolean) {
    this.ARSettlementChanged.emit(values);
  }
  emitReleiverChanged(values : boolean) {
    this.releiverChanged.emit(values);
  }
  emitTASettlementChanged(values : boolean) {
    this.TASettlementChanged.emit(values);
  }
}