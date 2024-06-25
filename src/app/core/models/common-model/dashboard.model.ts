export class DashBoardViewModel{
    Data : DashBoardViewDataModel;
}
export class DashBoardViewDataModel{
    RunningTravels : number;
    TravelAdvances : number;
    TotalAdvanceAmount : number;
    TravelClaimsAmount : number;
    ApprovedTravelAuthorization : number;
    BillSettlementAmount : number;
    PendingTravelAuth : number;
    ReturnTravelAuth : number;
    CompleteTravelAuth : number;
    TotalTravelAuth : number;
    PendingAdvanceRequisition : number;
    PendingAdvanceRequisitionString: string;
    ReturnAdvanceRequisition : number;
    ReturnAdvanceRequisitionString: string;
    CompleteAdvanceRequisition : number;
    CompleteAdvanceRequisitionString: string;
    TotalAdvanceRequisition : number;
    TotalAdvanceRequisitionString: string;
    PendingTravelClaims : number;
    PendingTravelClaimsString: string;
    ReturnTravelClaims : number;
    ReturnTravelClaimsString: string;
    CompleteTravelClaims : number;
    CompleteTravelClaimsString: string;
    TotalTravelClaims : number;
    TotalTravelClaimsString: string;
    PendingBillSettlement : number;
    PendingBillSettlementString: string;
    ReturnBillSettlement : number;
    ReturnBillSettlementString: string;
    CompleteBillSettlement : number;
    CompleteBillSettlementString: string;
    TotalBillSettlement : number;
    TotalBillSettlementString: string;
}
export class StatusCountViewModel{
    StatusCode : number;
    StatusName : string;
    Count : number;
    DocumentType: string;
}

export class UserDashboardStatusViewModel{
    DocumentType: string;
    Icon: string;
    StatusCountViewModelList: StatusCountViewModel[];
}
export class DashbardSearchModel{
    constructor(init?: Partial<DashbardSearchModel>){
		Object.assign(this, init);
	}
    PageNumber:number;
    UserId: number;
    PageSize: number;
    IsInternalControlNeeded: boolean;
    IsHRCheckNeed:boolean;
}