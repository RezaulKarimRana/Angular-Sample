import { BankAccountViewModel } from "../mastersetup-model/bankaccount.model";
import { CodeNamePair } from "../mastersetup-model/codenamepair.model";
import { DistrictModel } from "../mastersetup-model/district.model";
import { TAdAModel } from "../mastersetup-model/TAdAModel.model";
import { TaskTypeModel } from "../mastersetup-model/taskType.model";
import { TaskTypeDetailsModel } from "../mastersetup-model/tasktypedetails.model";

export class TASettlement {
  constructor(init?: Partial<TASettlement>) {
    Object.assign(this, init);
  }
  Id: number;
  TAId: number;
  RequestNo: string;
  TARefNo: string;
  PublicId: string;
  StatusId: number;
  DepartmentId: number;
  WorkFlowId: number;
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
  AcknowledgerId: number;
  VerifierId: number;
  RecommenderId: number;
  TotalAmount?: number;
  TotalCost?: number;
  TotalDue?: number;
  TotalRefund?: number;
  IsRevisedBill: boolean;
  AccountHolderName: string;
  AccountHolderCompany: string;
  BankName: string;
  AccountNo: string;
  AccountType: string;
  RouterNo: string;
  Condition: string;
  MobileNo: string;
  Items?: TASettlementDetailsItem[];
  Files: Array<File> = null;
  UploadedFiles: Array<TASettlementFileViewModel> = null;
  TASettlementDetailsItemViewModel?: TASettlementDetailsItemViewModel[];
  RunningApproverMatrixViewModel?: TASettlementRunningApproverMatrixViewModel[];
  TASettlementRunningApproverMatrixHistoryViewModel: TASettlementRunningApproverMatrixHistoryViewModel[];
  TASettlementHoldViewModel: TASettlementHoldViewModel[];
  RequesterUserId: number;
  DepositedRefund: number;
  DepositedDue: number;
  Balance: number;
}
export class TASettlementFileViewModel {
  Id: number;
  Url: string;
  FileName: string;
  FileSize: number;
  IsNew: boolean;
  IsRemoved: boolean;
  File: File;
}
export class TASettlementDetailsItem {
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
  NoOfDays: number;
  AllowancecPerDay: number;
  Total: number;
  TotalCost: number;
  IsActive: boolean;
  BreakFastAllowance: number;
  LunchAllowance: number;
  SnacksAllowance: number;
  DinnerAllowance: number;
  NightAllowance: number;
  HotelAllowance: number;
  LocalTravelAllowance: number;
  TotalBreakFastAmount: number;
  TotalLunchAmount: number;
  TotalSnacksAmount: number;
  TotalDinnerAmount: number;
  TotalNightAmount: number;
  TotalHotelStayAmount: number;
  TotalLocalTravelAmount: number;
  TotalBreakFast: number;
  TotalLunch: number;
  TotalSnacks: number;
  TotalDinner: number;
  TotalNight: number;
  TotalHotelStay: number;
  TotalLocalTravel: number;
  ActualBreakFast: number;
  ActualLunch: number;
  ActualSnacks: number;
  ActualDinner: number;
  ActualNight: number;
  ActualHotelStay: number;
  ActualLocalTravel: number;
  TotalDistance: number;
  TravelCost: number;
  EntertainmentCost: number;
  MiscellaneousCost: number;
  IsStayOnHotel: boolean;
  HasOwnAccomodation: boolean;
  HasLocalConveyance: boolean;
  LocalConveyanceAmount: number;
  IsOfficeVehicleUsed: boolean;
  TotalOfficeVehicle: number;
  TotalLocalConveyance: number;
  DeductionRemarks: number;
  SiteCode: string;
  IsNightStay: boolean;
  IsTravelAllowance: boolean;
  IsFoodAllowance: boolean;
  FileId?: number;
  FileName: string;
  FileType: string;
  FilePath: string;
}
export class TASettlementDetailsItemViewModel {
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
  TotalCost: number;
  IsActive: boolean;
  IsGoing: boolean;
  BreakFastAllowance: number;
  LunchAllowance: number;
  SnacksAllowance: number;
  DinnerAllowance: number;
  HotelAllowance: number;
  LocalTravelAllowance: number;
  TotalBreakFast: number;
  TotalLunch: number;
  TotalSnacks: number;
  TotalDinner: number;
  TotalHotelStay: number;
  TotalLocalTravel: number;
  ActualBreakFast: number;
  ActualLunch: number;
  ActualSnacks: number;
  ActualDinner: number;
  ActualHotelStay: number;
  ActualLocalTravel: number;
  TotalBreakFastAmount: number;
  TotalLunchAmount: number;
  TotalSnacksAmount: number;
  TotalDinnerAmount: number;
  TotalHotelStayAmount: number;
  TotalLocalTravelAmount: number;
}
export class TASettlementViewModel extends TASettlement {
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
  AcknowledgerUsers: CodeNamePair[];
  VerifierUsers: CodeNamePair[];
  RecommenderUsers: CodeNamePair[];
  InitModel: TASettlementSearchModel;
  Is_Approver: boolean;
  Is_Supervisor_Pending: boolean;
  CanEdit: boolean;
  CanViewBankInfo: boolean;
  TADAList: TAdAModel[];
  ApproverStatusId: Number;
  SupervisorId: number;
}
export class TASettlementSearchModel {
  constructor(init?: Partial<TASettlementSearchModel>) {
    Object.assign(this, init);
  }
  Id: number;
  UserId: number;
  StatusId: number;
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
  OfficeLocationDistrictId: number;
}

export class TASettlementRunningApproverMatrixHistoryViewModel {
  ApproverGroupName: string;
  UserName: string;
  ActionDateString: string;
  StatusName: string;
  Remarks: string;
}

export class TASettlementListModel {
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
export class TASettlementRunningApproverMatrix {
  constructor(init?: Partial<TASettlementRunningApproverMatrix>) {
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
export class TASettlementRunningApproverMatrixViewModel extends TASettlementRunningApproverMatrix {
  ApproverGroupName: string;
  UserName: string;
  StatusName: string;
  ActionDateString: string;
  ApproverSubGroupName: string;
}
export class TASettlementDashboardInitModel {
  StatusList: CodeNamePair[];
  TaskTypeList: CodeNamePair[];
  TaskTypeDetailsList: CodeNamePair[];
}

export class TASettlementHoldViewModel {
  Id: string;
  Remarks: string;
  IsHold: boolean;
}
export class TASettlementAttachment {
  Id: number;
  FileName: string;
}
