import { CodeNamePair } from "./codenamepair.model";
import { SubMenuModel } from "./subMenu.model";

export class SubMenuRoleModel {
    Id:number;
    MenuName:string;
    SubMenuName:string;
    RoleName:string;
    MenuId:number;
    SubMenuId:number;
    RoleId:number;
    IsActive: boolean;
}
export class SubMenuRolesInitModel{
    Menus: CodeNamePair[];
    SubMenus: SubMenuModel[];
    Roles: CodeNamePair[];
}