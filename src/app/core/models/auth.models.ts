
import { UserRoles } from "../enums/constants";
import { CodeNamePair } from "./mastersetup-model/codenamepair.model";

export class User {
    id: number;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    token?: string;
    email: string;
    role: UserRoles;
}

export class PortalUserViewModel {
    Id: number;
    AspUserId : string;
    CompanyId? :number;
    EmpolyeeTypeId? :number;
    HrId?:string;
    FullName:string;
    DesignationId? :number;
    RIOId? :number;
    MobileNo:string;
    Email:string;
    OfficeLocationId?: number;
    DepartmentId? :number;
    CompanyName :string;
    EmpolyeeTypeName :string;
    DesignationName :string;
    DepartmentName :string;
    OfficeLocationName :string;
    username: string;
    token?: string;
    role: UserRoles;
    SupervisorId: CodeNamePair[];
    ApproverList: any;
    Is_Finance_Check: boolean;        
    Is_Finance_Complete: boolean;
    Is_Internal_Controlled: boolean;
    IsApprover:boolean;
    ProfilePicUrl: any;
}
