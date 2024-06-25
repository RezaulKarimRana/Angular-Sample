import { BankAccountViewModel } from "../mastersetup-model/bankaccount.model";
import { CodeNamePair } from "../mastersetup-model/codenamepair.model";
import { DistrictModel } from "../mastersetup-model/district.model";
import { TAdAModel } from "../mastersetup-model/TAdAModel.model";
import { TaskTypeModel } from "../mastersetup-model/taskType.model";
import { TaskTypeDetailsModel } from "../mastersetup-model/tasktypedetails.model";
import { RunningApproverMatrixViewModel } from "../runningApproverMatrix.model";

export class TravelAuthorization {
  constructor(init?: Partial<TravelAuthorization>) {
    Object.assign(this, init);
  }
  Id: number;
  PublicId: string;
  StatusId: number;
  DepartmentId: number;
  WorkFlowId: number;
  RequestNo?: string;
  TravelAuthorizationDate: string;
  AdvanceRequisitionDate: string;
  TentativeSettlementDate: string;
  Justification: string;
  SupervisorId: number;
  SupervisorName: string;
  UserId: number;
  TravelAuthorizationTypeId: number;
  VoucherNo: string;
  ApproverRemarks: string;
  IsApproverApproved: boolean;
  IsRioChanged: boolean;
  IsApproverDeclined: boolean;
  RecommenderId: number;
  TotalAmount?: number;
  IsRevisedBill: boolean;
  AccountHolderName: string;
  AccountHolderCompany: string;
  BankName: string;
  AccountNo: string;
  AccountType: string;
  RouterNo: string;
  Condition: string;
  MobileNo: string;
  TravelAuthorizationDetailsItem?: TravelAuthorizationDetailsItem[];
  TravelAuthorizationDetailsItemViewModel?: TravelAuthorizationDetailsItem[];
  RunningApproverMatrixViewModel?: RunningApproverMatrixViewModel[];
  TravelAuthRunningApproverMatrixHistoryViewModel: TravelAuthRunningApproverMatrixHistoryViewModel[];
  TravelAuthHoldHistoryViewModel: TravelAuthRunningApproverMatrixHistoryViewModel[];
  RequesterUserId: number;
}
export class TravelAuthorizationDetailsItem {
  Id: number;
  TravelAuthRefId?: number;
  LocationFromDistrictId: number;
  LocationToDistrictId: number;
  WorkingDistrictId: number;
  WorkingDistrictType: string;
  TaskTypeId: number;
  TaskTypeDetailsId: number;
  StartDate: string;
  EndDate: string;
  Remarks: string;
  NoOfDays: number;
  AllowancecPerDay: number;
  TotalDailyAllowance: number;
  TravelAllowance: number;
  EntertainmentAllowance: number;
  MiscellaneousAllowance: number;
  Total: number;
  IsActive: boolean;
}
export class TASettlementModel {
  TAModel: TravelAuthorizationViewModel;
  InitModel: TravelAuthListModel;
}
export class TravelAuthorizationViewModel extends TravelAuthorization {
  StatusName: string;
  TaskTypeName: string;
  TaskTypeDetailsName: string;
  TravelAuthorizationTypeName: string;
  TravelAuthDateString: string;
  TravelAuthorizationDateString: string;
  TentativeSettlementDateString: string;
  AdvanceRequisitionDateString: string;
  SupervisorName: string;
  CreatorName: string;
  RequesterUser: any;
  ProfilePicUrl: any;
  TaskTypeDetailsList: TaskTypeDetailsModel[];
  RecommenderUsers: CodeNamePair[];
  InitModel: TravelAuthorizationSearchModel;
  Is_Approver: boolean;
  Is_Supervisor_Pending: boolean;
  CanEdit: boolean;
  CanViewBankInfo: boolean;
  TADAList: TAdAModel[];
  ApproverStatusId: boolean;
}
export class TravelAuthorizationSearchModel {
  constructor(init?: Partial<TravelAuthorizationSearchModel>) {
    Object.assign(this, init);
  }
  Id: number;
  UserId: number;
  StatusId: number;
  DepartmentId: number;
  TravelAuthDate: string;
  RequestNo: string;
  StatusList: CodeNamePair[];
  DistrictList: DistrictModel[];
  TADAList: TAdAModel[];
  SupervisorList: CodeNamePair[];
  TaskTypeList: TaskTypeModel[];
  TaskTypeDetailsList: TaskTypeDetailsModel[];
  FromDate: string;
  ToDate: string;
  TaskTypeId: number;
  TaskTypeDetailsId: number;
  RequesterUserId: number;
}

export class TravelAuthRunningApproverMatrixHistoryViewModel {
  ApproverGroupName: string;
  UserName: string;
  ActionDateString: string;
  StatusName: string;
  Remarks: string;
}

export class TravelAuthListModel {
  TaskTypeList: TaskTypeModel[];
  TaskTypeDetailsList: TaskTypeDetailsModel[];
  DistrictList: DistrictModel[];
  SupervisorId: Number;
  SupervisorName: string;
  StatusList: CodeNamePair[];
  TravelAuthorizationTypeList: CodeNamePair[];
  TADAList: TAdAModel[];
  ProfilePicUrl: any;
  OfficeLocationDistrictId: number;
  IsRioApplicable: boolean;
  BankAccountList: BankAccountViewModel[];
}
export class TravelAuthRunningApproverMatrix {
  constructor(init?: Partial<TravelAuthRunningApproverMatrix>) {
    Object.assign(this, init);
  }
  Id: number;
  TravelAuthRefId: number;
  UserId: number;
  StatusId: number;
  Remarks: string;
  ApproverGroupId: number;
  ApproverSubGroupId: number;
  DepartmentId: number;
  WorkFlowId: number;
  IsGroupApprover: boolean;
  Level: number;
}
export class TADashboardInitModel {
  StatusList: CodeNamePair[];
  TaskTypeList: CodeNamePair[];
  TaskTypeDetailsList: CodeNamePair[];
}

export class TAHoldViewModel {
  Id: string;
  Remarks: string;
  IsHold: boolean;
}
