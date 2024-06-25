import { CodeNamePair } from "../mastersetup-model/codenamepair.model";
import { RunningApproverMatrixViewModel } from "../runningApproverMatrix.model";
import { AdvanceSettlementDetailsItem } from "./settlement.model";

export class AdvanceSettlementRunningApproverMatrixModel {
  Id: number;
  ReferrenceId: number;
  UserId: number;
  ApproverGroupId: number;
  ApproverSubGroupId: number;
  DepartmentId: number;
  WorkFlowId: number;
  Status: number;
  Remarks: string;
  Level: number;
}
export class AdvanceSettlementRunningApproverMatrixSupervisorViewModel {
  RefId: number;
  Remarks: string;
  DepartmentId: number;
  WorkFlowId: number;
  UserId: number;
  AcknowledgerId: number;
  VerifierId: number;
  RecommenderId: number;
  RunningApproverMatrixViewModel: RunningApproverMatrixViewModel[];
  AdvanceDetailsItemViewModel: AdvanceSettlementDetailsItem[];
  VoucherNo: string;
  Level: number;
  ApproverSubGroupId: number;
  Is_Finance_Check: boolean;
  Is_Finance_Complete: boolean;
  ChangeAdvanceDate: boolean;
  ARRequiredDate: string;
  TentativeSettlementDate: string;
}
export class AdvanceSettlementDashboardInitModel {
  StatusList: CodeNamePair[];
  TaskTypeList: CodeNamePair[];
  TaskTypeDetailsList: CodeNamePair[];
}
