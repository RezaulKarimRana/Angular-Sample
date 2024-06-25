import { AdvanceDetailsItem } from "../advance-model/advance.model";
import { BankAccountViewModel } from "../mastersetup-model/bankaccount.model";
import { CodeNamePair } from "../mastersetup-model/codenamepair.model";
import { DistrictModel } from "../mastersetup-model/district.model";
import { TaskTypeDetailsModel } from "../mastersetup-model/tasktypedetails.model";
import { RunningApproverMatrixViewModel } from "../runningApproverMatrix.model";
import { SettlementInternalControlApproverMatrix } from "./settlementInternalControlApproverMatrix.model";

export class Settlement {
  constructor(init?: Partial<Settlement>) {
    Object.assign(this, init);
  }
  Id: number;
  PublicId: string;
  RequestNo?: string;
  TaskTypeId: number;
  TaskTypeDetailsId: number;
  ProjectName: string;
  SupervisorId: number;
  Status: number;
  UserId: number;
  WorkFlowId: number;
  DepartmentId: number;
  AccountHolderCompany: string;
  AccountHolderName: string;
  AccountNo: string;
  AccountType: string;
  BankName: string;
  Condition: string;
  MobileNo: string;
  RouterNo: string;
  TotalExpense: number;
  TotalAdvance: number;
  TotalDue?: number;
  SettlementDetailsItem: SettlementDetailsItem[];
  SettlementFiles: Array<File> = new Array<File>();
}
export class SettlementFileViewModel {
  Id: number;
  Url: string;
  FileName: string;
  FileSize: number;
  IsNew: boolean;
  IsRemoved: boolean;
  File: File;
}

export class SettlementParticulars {
  Id: number;
  Name: string;
  IsAutoTotalField: boolean;
  HasChild: boolean;
}
export class SettlementAttachment {
  Id: number;
  FileName: string;
}
export class SettlementViewModel {
  Id: number;
  PublicId: string;
  ORDate: string;
  ORDateString: string;
  TaskTypeName: string;
  TaskTypeId: number;
  ProjectName: string;
  TaskTypeDetailsName: string;
  Justification?: string;
  RequestNo?: string;
  Status: number;
  SettlementStatus?: string;
  VoucherNo?: string;
  SettlementAdvanceDetail?: SettlementAdvanceDetailViewModel[];
  SettlementDetailsItem?: SettlementDetailsItem[];
  SupervisorId: number;
  UserId: number;
  WorkFlowId: number;
  DepartmentId: number;
  BankName: string;
  AccountNo: string;
  AccountType: string;
  RouterNo: string;
  Condition: string;
  MobileNo: string;
  AccountHolderName: string;
  AccountHolderCompany: string;
  RunningApproverMatrixViewModel: SettlementRunningApproverMatrixViewModel[];
  IsSupervisorApproved: boolean;
  ApproverStatus: number;
  ApproverStatusName?: string;
  CanEditTally: boolean;
  CanViewTally: boolean;
  TallyList: CodeNamePair[];
  IsInternalControlNeed: boolean;
  IsHRCheckNeed: boolean;
  InternalControlMatrixViewModel: SettlementRunningApproverMatrixViewModel[];
  InternalControlViewModel: SettlementInternalControlApproverMatrix;
  CanViewBankInfo: boolean;
  SupervisorName: string;
  TotalBalance: number;
  RemaningBalance: number;
  AdvanceBalance: number;
  StringRemaningBalance: string;
  IsCheckedForBulkProcessing: boolean;
  PortalUser: any;
  SettlementHistoryList: SettlementHistoryList[];
  ProfilePicUrl: any;
  TaskTypeDetailsList: TaskTypeDetailsModel[];
  AcknowledgerUsers: CodeNamePair[];
  VerifierUsers: CodeNamePair[];
  RecommenderUsers: CodeNamePair[];
}
export class SettlementHistoryList {
  ApproverGroupName: string;
  UserName: string;
  ActionDateString: string;
  StatusName: string;
  Remarks: string;
}
export class SettlementRunningApproverMatrixViewModel {
  Id: number;
  status: number;
  ApproverGroupId: number;
  ApproverSubGroupId: number;
  Remarks: string;
  UserId: number;
  SettlementId: number;
  ApproverSubGroupName: string;
  StatusName: string;
  UserName: string;
  ApproverGroupName: string;
  IsGroupApprover: boolean;
  Level: number;
  DepartmentId: number;
  WorkFlowId: number;
}
export class SettlementListModel {
  TaskTypeList: TaskType[];
  TaskTypeDetailsList: TaskTypeDetailsModel[];
  SupervisorId: Number;
  SupervisorName: string;
  DepartmentList: CodeNamePair[];
  Particulars: CodeNamePair[];
  ParticularList: SettlementParticulars[];
  Advances: SettlementAdvanceModel[];
  ElectricityAdvances: SettlementAdvanceModel[];
  OtherAdvances: SettlementAdvanceModel[];
  BankAccountList: BankAccountViewModel[];
  SiteCodeList: CodeNamePair[];
  StatusList: CodeNamePair[];
  DistrictList: DistrictModel[];
  ProfilePicUrl: any;
}
export class TaskType {
  Id: number;
  Name: string;
  HasChild: boolean;
}
export class SettlementSearchModel {
  constructor(init?: Partial<SettlementSearchModel>) {
    Object.assign(this, init);
  }
  StatusId: number;
  TaskTypeId: number;
  TaskTypeDetailsId: number;
  ORDate: string;
  UserId: number;
  RequestNo: string;
  FromDate: string;
  ToDate: string;
}
export class SettlementAdvanceModel {
  Id: number;
  RequestNo: string;
  PublicId: string;
  Status: number;
  StatusName: string;
  UserId: number;
  Total: number;
  AdvanceDetailsItem: AdvanceDetailsItem;
  IsAdvanceUsed: boolean;
  RemainingBalance: number;
}
export class SettlementAdvanceDetailViewModel {
  Id: number;
  SettlementId?: number;
  AdvanceId?: number;
  AdvancePublicId: string;
  RequestNo: string;
  Total: number;
}

export class SettlementAdvanceDetail {
  constructor(init?: Partial<SettlementAdvanceDetail>) {
    Object.assign(this, init);
  }
  Id: number;
  SettlementId: number;
  AdvanceId: number;
}

export class SettlementSiteDetail {
  constructor(init?: Partial<SettlementSiteDetail>) {
    Object.assign(this, init);
  }
  Id: number;
  SettlementItemDetailId: number;
  SiteId: number;
  IMSRefId: number;
}

export class SettlementBulkPaymentModel {
  constructor(init?: Partial<SettlementBulkPaymentModel>) {
    Object.assign(this, init);
  }
  BulkRemarks: string;
  BulkVoucherNo: string;
  BulkProcessedSettlementList: SettlementViewModel[];
}

export class SettlementApprovers {
  Level: number;
  Name: string;
  Status: number;
  ApproverType: string;
}

export class SettlementDashbardSearchModel {
  constructor(init?: Partial<SettlementDashbardSearchModel>) {
    Object.assign(this, init);
  }
  StatusId: number;
  PageNumber: number;
  Status: number;
  UserId: number;
  PageSize: number;
  RequestNo: string;
  RequiredDate: string;
  TaskTypeId: number;
  TaskTypeDetailsId: number;
}
export class SettlementDashboardInitModel {
  StatusList: CodeNamePair[];
  TaskTypeList: CodeNamePair[];
  TaskTypeDetailsList: CodeNamePair[];
}
export class SettlementDetailsItem {
  Id: number;
  ReferenceId?: number;
  ParticularId: number;
  AdvanceAmount: number;
  ActualCost: number;
  IsActive: boolean;
  FileId?: number;
  FileName: string;
  FileType: string;
  FilePath: string;
}
export class SettlementDetailsItemViewModel extends SettlementDetailsItem {
  ParticularName: string;
  Description: string;
  SiteCode: string;
}
export class AdvanceSettlement {
  constructor(init?: Partial<AdvanceSettlement>) {
    Object.assign(this, init);
  }
  Id: number;
  PublicId: string;
  AdvanceTypeId: number;
  AdvanceRequisitionId: number;
  RequestNo: string;
  AdvanceRequisitionNo: string;
  SupervisorId: number;
  SupervisorName: string;
  UserId: number;
  Status: number;
  VoucherNo: string;
  TotalAmount: number;
  TotalCost: number;
  TotalDue: number;
  TotalRefund: number;
  Justification?: string;
  Items?: SettlementDetailsItem[];
  Files: Array<File> = null;
  UploadedFiles: Array<SettlementFileViewModel> = null;
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
  IsRevisedBill: boolean;
  HistoryList: SettlementHistoryList[];
}
export class AdvanceSettlementViewModel extends AdvanceSettlement {
  TaskTypeName: string;
  TaskTypeDetailsName: string;
  AdvanceTypeName: string;
  AdvanceParticularName: string;
  AdvanceDetailsItemViewModel: AdvanceSettlementDetailsItemViewModel[];
  RunningApproverMatrixViewModel: RunningApproverMatrixViewModel[];
  Files: Array<File> = null;
  AdvanceUploadedFiles: Array<AdvanceSettlementFileViewModel> = null;
  ARDateString: string;
  ARRequiredDateString: string;
  RefundFiles: Array<File> = null;
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
  AdvanceHistoryList: AdvanceSettlementHistoryList[];
  ProfilePicUrl: any;
  TaskTypeDetailsList: TaskTypeDetailsModel[];
  Is_Recommender_Group_Pending: boolean;
  AcknowledgerUsers: CodeNamePair[];
  VerifierUsers: CodeNamePair[];
  RecommenderUsers: CodeNamePair[];
}
export class AdvanceSettlementDetailsItem {
  Id: number;
  ReferenceId?: number;
  UploadFileId?: number;
  ParticularId: number;
  AdvanceAmount: number;
  IsActive: boolean;
}
export class AdvanceSettlementDetailsItemViewModel extends AdvanceSettlementDetailsItem {
  ParticularName: string;
  UploadFileName: string;
}
export class AdvanceSettlementFileViewModel {
  Id: number;
  Url: string;
  FileName: string;
  FileSize: number;
  IsNew: boolean;
  IsRemoved: boolean;
  File: File;
}
export class ChildFileViewModel {
  Id: string;
  Url: string;
  FileName: string;
  FileSize: number;
  IsNew: boolean;
  File: File;
  UploadFileIdWithFileName: string;
}
export class AdvanceSettlementParticulars {
  Id: number;
  Name: string;
}
export class AdvanceSettlementHistoryList {
  ApproverGroupName: string;
  UserName: string;
  ActionDateString: string;
  StatusName: string;
  Remarks: string;
}
export class AdvancedSettlementListModel {
  Particulars: CodeNamePair[];
  StatusList: CodeNamePair[];
  Users: CodeNamePair[];
  SupervisorId: Number;
  SupervisorName: string;
  BankAccountList: BankAccountViewModel[];
  AdvanceTypeList: CodeNamePair[];
  ProfilePicUrl: any;
  PettyCashUserLimit: number;
}
export class AdvanceSettlementSearchModel {
  constructor(init?: Partial<AdvanceSettlementSearchModel>) {
    Object.assign(this, init);
  }
  StatusId: number;
  ARDate: string;
  ARRequiredDate: string;
  TentativeSettlementDate: string;
  UserId: number;
  FromDate: string;
  ToDate: string;
  TaskTypeId: number;
  TaskTypeDetailsId: number;
}

export class AdvanceSettlementDashbardSearchModel {
  constructor(init?: Partial<AdvanceSettlementDashbardSearchModel>) {
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
export class AdvanceSettlementApprovers {
  Level: number;
  Name: string;
  Status: number;
  ApproverType: string;
}
export class AdvanceSettlementAttachment {
  Id: number;
  FileName: string;
}
