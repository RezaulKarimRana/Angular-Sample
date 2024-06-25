import { BankAccountModel } from "./bankaccount.model";
import { CodeNamePair, IdTextNameModel } from "./codenamepair.model";

export class UserModel {
    Id:number;
    HrId: string;
    IsActive: boolean;
    isApprover: boolean;
    FullName: string;
    MobileNo: string;
    Email: string;
    CompanyId: number;
    EmpolyeeTypeId: number;
    DepartmentId: number;
    DepartmentName: string;
    DesignationId: number;
    OfficeLocationId:number;
    OfficeLocationName:string;
    CompanyList: CodeNamePair[];
    EmployeeTypeList: CodeNamePair[];
    DepartmentList: CodeNamePair[];
    DesignationList: CodeNamePair[];
    OfficeLocationList :CodeNamePair[];
    SupervisorId: number;
    SupervisorDepartmentId?: string;
    BankAccountTypeList: IdTextNameModel[];
    ConditionList: IdTextNameModel[];
    Company: CodeNamePair;
    Department: CodeNamePair;
    CompanyName: string;
    DesignationName: string;
    EmployeeTypeName: string;
}

export class UserBulkModel {
    HrId: string;
    IsActive: boolean;
    FullName: string;
    MobileNo: string;
    Email: string;
    Company: string;
    EmpolyeeType: string;
    Department: string;
    Designation: string;
    SuperviosrName:string;
    SupervisorHRID:string;
    OfficeLocation:string;
}

export class SupervisorBulkModel {
    HrId: string;
    MobileNo: string;
    SuperviosrName:string;
    SupervisorHRID:string;
    CompanyName:string;
    EmployeeTypeName:string;
    SuperVisorMobileNo: string;
}


export class UserAllInfoModel {
    constructor(init?: Partial<UserAllInfoModel>){
		Object.assign(this, init);
	}
    Usermodel : UserModel;
    BankAccountList : BankAccountModel[];
    ProfilePicUrl : any;
}