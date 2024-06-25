import { CodeNamePair } from "../mastersetup-model/codenamepair.model";

export class UserInfoUpdateInitModel{
    constructor(init?: Partial<UserInfoUpdateInitModel>){
		Object.assign(this, init);
	}
    SupportTypeList:CodeNamePair[];
    UserList: CodeNamePair[];
}
export class UserInfoUpdateModel{
    constructor(init?: Partial<UserInfoUpdateModel>){
		Object.assign(this, init);
	}
    SupportTypeId: number;
    UserId: number;
    BillReviewerId: number;
}