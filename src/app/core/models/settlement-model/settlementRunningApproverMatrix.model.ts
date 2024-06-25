import { SettlementDetailsItem, SettlementRunningApproverMatrixViewModel } from "./settlement.model";

export class SettlementRunningApproverMatrixModel {
    Id:number;
    SettlementId: number;
    UserId: number;
    ApproverGroupId:number
    ApproverSubGroupId: number;
    DepartmentId:number;
    WorkFlowId:number;
    Status: number;
    Remarks:string;
    Level: number;
}
export class SettlementRunningApproverMatrixSupervisorViewModel {
    SettlementId: number;
    Remarks:string;
    DepartmentId:number;
    WorkFlowId:number;
    UserId: number;
    SettlementRunningApproverMatrixModel : SettlementRunningApproverMatrixViewModel[];
    SettlementDetailsItemViewModel : SettlementDetailsItem[];
    VoucherNo: string;
    Level: number;
    ApproverSubGroupId: number;
    Is_Finance_Check: boolean;
    Is_Finance_Complete: boolean;
}