import { BankAccountViewModel } from "../mastersetup-model/bankaccount.model";
import { CodeNamePair } from "../mastersetup-model/codenamepair.model";
import { TaskTypeDetailsModel } from "../mastersetup-model/tasktypedetails.model";
import { RunningApproverMatrixViewModel } from "../runningApproverMatrix.model";

export class Advance {
  constructor(init?: Partial<Advance>) {
    Object.assign(this, init);
  }
  Id: number;
  PublicId: string;
  AdvanceTypeId: number;
  ARDate: string;
  ARRequiredDate: string;
  TentativeSettlementDate: string;
  TaskTypeId: number;
  TaskTypeDetailsId: number;
  AdvanceParticularId: number;
  Justification?: string;
  PettyCashAmount: number;
  TotalAmount: number;
  RequestNo?: string;
  Status: number;
  AdvanceStatus?: string;
  AttachmentId?: number;
  VoucherNo?: string;
  AdvanceDetailsItem?: AdvanceDetailsItem[];
  AdvanceFiles: Array<File> = null;
  AdvanceUploadedFiles: Array<AdvanceFileViewModel> = null;
  SupervisorId: number;
  SupervisorName: string;
  UserId: number;
  WorkFlowId: number;
  DepartmentId: number;
  AccountHolderName: string;
  AccountHolderCompany: string;
  BankName: string;
  AccountNo: string;
  AccountType: string;
  RouterNo: string;
  Condition: string;
  MobileNo: string;
  RemainingBalance: number;
  AdvanceHistoryList: AdvanceHistoryList[];
  TaskTypeDetailsList: TaskTypeDetailsModel[];
  IsRevisedBill: boolean;
}
export class AdvanceViewModel extends Advance {
  TaskTypeName: string;
  TaskTypeDetailsName: string;
  AdvanceTypeName: string;
  AdvanceParticularName: string;
  AdvanceDetailsItemViewModel: AdvanceDetailsItemViewModel[];
  AdvanceDateChangeHistoryViewModel: AdvanceDateChangeHistoryViewModel[];
  RunningApproverMatrixViewModel: RunningApproverMatrixViewModel[];
  AdvanceFiles: Array<File> = null;
  AdvanceUploadedFiles: Array<AdvanceFileViewModel> = null;
  ARDateString: string;
  ARRequiredDateString: string;
  TentativeSettlementDateString: string;
  IsSupervisorApproved: boolean;
  ApproverStatus: number;
  ApproverStatusName?: string;
  CanEditTally: boolean;
  CanViewTally: boolean;
  TallyList: CodeNamePair[];
  CanViewBankInfo: boolean;
  SupervisorName: string;
  IsCheckedForBulkProcessing: boolean;
  RemainingBalance: number;
  PortalUser: any;
  AdvanceHistoryList: AdvanceHistoryList[];
  ProfilePicUrl: any;
  TaskTypeDetailsList: TaskTypeDetailsModel[];
  Is_Recommender_Group_Pending: boolean;
  RecommenderUsers: CodeNamePair[];
}
export class AdvanceDetailsItem {
  Id: number;
  ReferenceId?: number;
  ParticularId: number;
  AdvanceAmount: number;
  IsActive: boolean;
}
export class AdvanceDetailsItemViewModel extends AdvanceDetailsItem {
  ParticularName: string;
  Description: string;
  SiteCode: string;
}
export class AdvanceFileViewModel {
  Id: number;
  Url: string;
  FileName: string;
  FileSize: number;
  IsNew: boolean;
  IsRemoved: boolean;
  File: File;
}
export class AdvanceParticulars {
  Id: number;
  Name: string;
}
export class AdvanceHistoryList {
  ApproverGroupName: string;
  UserName: string;
  ActionDateString: string;
  StatusName: string;
  Remarks: string;
}
export class AdvancedListModel {
  Particulars: CodeNamePair[];
  StatusList: CodeNamePair[];
  Users: CodeNamePair[];
  SupervisorId: number;
  SupervisorName: string;
  BankAccountList: BankAccountViewModel[];
  AdvanceTypeList: CodeNamePair[];
  ProfilePicUrl: any;
  PettyCashUserLimit: number;
}
export class TaskType {
  Id: number;
  Name: string;
  HasChild: boolean;
}
export class AdvanceSearchModel {
  constructor(init?: Partial<AdvanceSearchModel>) {
    Object.assign(this, init);
  }
  StatusId: number;
  UserId: number;
  RequestNo: string;
  DepartmentId: number;
  ARDate: string;
  ARRequiredDate: string;
  TentativeSettlementDate: string;
  FromDate: string;
  ToDate: string;
  TaskTypeId: number;
  TaskTypeDetailsId: number;
}

export class AdvanceDashbardSearchModel {
  constructor(init?: Partial<AdvanceDashbardSearchModel>) {
    Object.assign(this, init);
  }
  StatusId: number;
  ARDate: string;
  ARRequiredDate: string;
  TentativeSettlementDate: string;
  PageNumber: number;
  Status: number;
  UserId: number;
  PageSize: number;
  RequestNo: string;
  RequiredDate: string;
  SettlementDate: string;
  TaskTypeId: number;
  TaskTypeDetailsId: number;
}
export class AdvanceApprovers {
  Level: number;
  Name: string;
  Status: number;
  ApproverType: string;
}
export class AdvanceBulkPaymentModel {
  constructor(init?: Partial<AdvanceBulkPaymentModel>) {
    Object.assign(this, init);
  }
  BulkRemarks: string;
  BulkVoucherNo: string;
  BulkProcessedAdvanceList: AdvanceViewModel[];
}
export class AdvanceDateChangeHistoryViewModel {
  constructor(init?: Partial<AdvanceDateChangeHistoryViewModel>) {
    Object.assign(this, init);
  }
  UserName: string;
  ARRequiredDateString: string;
  TentativeSettlementDateString: string;
  CreatedDateString: string;
}
