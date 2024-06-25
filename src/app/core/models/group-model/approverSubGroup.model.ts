import { CodeNamePair } from "../mastersetup-model/codenamepair.model";

export class ApproverSubGroupModel {
    Id:number;
    Name: string;
    IsActive: boolean;
    ApproverGroupId: number;
    DepartmentId: number;
    ApproverGroupName: string;
    DepartmentName: string;
    DepartmentList: CodeNamePair[];
    ApproverGroupList: CodeNamePair[];
}