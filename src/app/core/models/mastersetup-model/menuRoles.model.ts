import { CodeNamePair } from "./codenamepair.model";

export class MenuRoleModel {
    Id:number;
    MenuName:string;
    RoleName:string;
    MenuId:number;
    RoleId:number;
    IsActive: boolean;
}
export class MenuRolesInitModel{
    Menus: CodeNamePair[];
    Roles: CodeNamePair[];
}