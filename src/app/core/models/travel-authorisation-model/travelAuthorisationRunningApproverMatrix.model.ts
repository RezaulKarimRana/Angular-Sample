import { RunningApproverMatrixViewModel } from "../runningApproverMatrix.model";
import { TravelAuthorizationDetailsItem } from "./travelAuthorisation.model";
export class TravelAuthRunningApproverMatrixSupervisorViewModel {
  TravelAuthRefId: number;
  Remarks: string;
  DepartmentId: number;
  WorkFlowId: number;
  UserId: number;
  RunningApproverMatrixViewModel: RunningApproverMatrixViewModel[];
  TravelAuthDetailsItemViewModel: TravelAuthorizationDetailsItem[];
  Level: number;
  ApproverSubGroupId: number;
  Is_Finance_Check: boolean;
  Is_Finance_Complete: boolean;
  ARRequiredDate: string;
  TentativeSettlementDate: string;
  VoucherNo: string;
}
