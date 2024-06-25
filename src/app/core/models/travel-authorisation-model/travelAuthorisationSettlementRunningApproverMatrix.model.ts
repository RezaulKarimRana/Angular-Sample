import { RunningApproverMatrixViewModel } from "../runningApproverMatrix.model";
import { TASettlementDetailsItem } from "./travelAuthorisationSettlement.model";

export class TASettlementRunningApproverMatrixSupervisorViewModel {
  TravelAuthRefId: number;
  Remarks: string;
  DepartmentId: number;
  WorkFlowId: number;
  UserId: number;
  RunningApproverMatrixViewModel: RunningApproverMatrixViewModel[];
  TravelAuthDetailsItemViewModel: TASettlementDetailsItem[];
  Level: number;
  ApproverSubGroupId: number;
  Is_Finance_Check: boolean;
  Is_Finance_Complete: boolean;
  ARRequiredDate: string;
  TentativeSettlementDate: string;
  VoucherNo: string;
}
