import { ApproverSubGroupModel } from "../group-model/approverSubGroup.model";
import { CodeNamePair } from "../mastersetup-model/codenamepair.model";

export class ApprovalWorkFlowMatrixModel {
    Id:number;
    Name:string;
    IsActive: boolean;
    DepartmentId: number;
    DepartmentName:string;
    AcknowledgerGroupId: number;
    AcknowledgerGroupName:string;
    VerifierGroupId: number;
    VerifierGroupName:string;
    RecommanderGroupId: number;
    RecommanderGroupName:string;
    STLCheckerId: number;
    STLCheckerName:string;
    ApproverId: number;
    ApproverName:string;
    VerifierHRGroupId: number;
    VerifierHRGroupName:string;
    FinanceCheckGroupId: number;
    FinanceCheckGroupName:string;
    FinanceCompleteGroupId: number;
    FinanceCompleteGroupName:string;
    InternalControlGroupId: number;
    InternalControlGroupName:string;

    DepartmentList: CodeNamePair[];
    AcknowledgerGroupList: ApproverSubGroupModel[];
    VerifierGroupList: ApproverSubGroupModel[];
    RecommanderGroupList: ApproverSubGroupModel[];
    VerifierHRGroupList: ApproverSubGroupModel[];
    FinanceCheckGroupList: ApproverSubGroupModel[];
    FinanceCompleteGroupList: ApproverSubGroupModel[];
    InternalControlGroupList: ApproverSubGroupModel[];
    UserList: CodeNamePair[];
}