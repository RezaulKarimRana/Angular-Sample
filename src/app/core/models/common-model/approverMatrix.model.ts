import { CodeNamePair, IdTextNameModel } from "../mastersetup-model/codenamepair.model";

export class ApproverMatrixModel {
    Id:number;
    Level:number;
    Name:string;
    StatusName:string;
    ApproverSubGroupName:string;
    UserName:string;
    Email:string;
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
    UserEmailList: IdTextNameModel[];
    DepartmentList: CodeNamePair[];
    ApproverGroupList: CodeNamePair[];
    ApproverSubGroupList: CodeNamePair[];
    ApproverMatrixFor: CodeNamePair[];
}