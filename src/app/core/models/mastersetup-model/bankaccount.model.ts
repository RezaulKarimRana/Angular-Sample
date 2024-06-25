import { CodeNamePair } from "./codenamepair.model";
import { IdTextNameModel } from "./codenamepair.model";
import { UserModel } from "./user.model";

export class BankAccountModel {
    Id:number;
    BankName:string;
    AccountNo: string;
    AccountType:string;
    RouterNo: string;
    UserId: number;
    DepartmentId: number;
    UserName:string;
    Condition:string;
    PortalUser: UserModel
}
export class BankAccountInitModel {
    DepartmentList: CodeNamePair[];
    BankAccountTypeList: IdTextNameModel[];
    ConditionList: IdTextNameModel[];
}
export class BankAccountViewModel {
    Id:number;
    AccountHolderName:string;
    AccountHolderCompany: string;
    BankName:string;
    AccountNo: string;
    AccountType: string;
    RouterNo: string;
    Condition:string;
    MobileNo: string;
}