import { CodeNamePair } from "../mastersetup-model/codenamepair.model";

export class AdvanceApproverMatrixModel {
    Id:number;
    Level:number;
    Name:string;
    StatusName:string;
    ApproverSubGroupName:string;
    UserName:string;
    UserEmail:string;
    DepartmentName:string;
    ApproverGroupName:string;
    WorkFlowName:string;
    IsActive: boolean;
    WorkFlowId: number;
    StatusId: number;
    ApproverGroupId: number;
    DepartmentId: number;
    UserId: number;
    ApproverSubGroupId: number;
    StatusList: CodeNamePair[];
    WorkFlowList: CodeNamePair[];
    UserList: CodeNamePair[];
    DepartmentList: CodeNamePair[];
    ApproverGroupList: CodeNamePair[];
    ApproverSubGroupList: CodeNamePair[];
}