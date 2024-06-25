import { CodeNamePair } from "../mastersetup-model/codenamepair.model";
export class ApproverSubGroupUserModel {
    Id:number;
    IsActive: boolean;
    UserId: number;
    ApproverSubGroupId: number;
    DepartmentId: number;
    ApproverSubGroupName: string;
    DepartmentName: string;
    PortalUserFullName: string;
    DepartmentList:CodeNamePair[]
}
export class ApproverSubGroupUsersViewModel {
    UserName: string;
    UserDepartment: string;
    UserCompany: string;
    UserPhone: string;
    GroupName: string;
}