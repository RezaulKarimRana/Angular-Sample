import { CodeNamePair } from "../mastersetup-model/codenamepair.model";
import { RunningApproverMatrixViewModel } from "../runningApproverMatrix.model";
import { AdvanceDetailsItem } from "./advance.model";

export class AdvanceRunningApproverMatrixSupervisorViewModel {
  RefId: number;
  Remarks: string;
  DepartmentId: number;
  WorkFlowId: number;
  UserId: number;
  RecommenderId: number;
  RunningApproverMatrixViewModel: RunningApproverMatrixViewModel[];
  AdvanceDetailsItemViewModel: AdvanceDetailsItem[];
  VoucherNo: string;
  Level: number;
  ApproverSubGroupId: number;
  Is_Finance_Check: boolean;
  Is_Finance_Complete: boolean;
  ChangeAdvanceDate: boolean;
  ARRequiredDate: string;
  TentativeSettlementDate: string;
}
export class AdvanceDashboardInitModel {
  StatusList: CodeNamePair[];
  TaskTypeList: CodeNamePair[];
  TaskTypeDetailsList: CodeNamePair[];
}
