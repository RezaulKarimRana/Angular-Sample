import { CodeNamePair } from "./codenamepair.model";

export class UserRolesModel {
    Id:number;
    UserId:number;
    RoleId:number;
    UserName:string;
    RoleName:string;
    IsActive: boolean;
}
export class UserRolesInitModel{
    Users: CodeNamePair[];
    Roles: CodeNamePair[];
}