import { CodeNamePair } from "../mastersetup-model/codenamepair.model";

export class Releiver {
    constructor(init?: Partial<Releiver>){
		Object.assign(this, init);
	}
    Id: number;
	PublicId: string;
    RequestNo?: string;
    StatusId: number;
    UserId: number;
	ReleiveFromDate: string;
    ReleiveToDate: string;
    ReleiverId:number;
    Justification: string;
}
export class ReleiverViewModel extends Releiver {
    UserName:string;
    ReleiverName:string;
    ReleiverRunningApproverMatrixViewModel: ReleiverRunningApproverMatrixViewModel[];
}
export class ReleiverInitModel {
    StatusList: CodeNamePair[];
    ReleiverList: CodeNamePair[];
}
export class ReleiverSearchModel{
    constructor(init?: Partial<ReleiverSearchModel>){
		Object.assign(this, init);
	}
    StatusId:number;
    UserId: number;
}
export class ReleiverRunningApproverMatrixViewModel{
    constructor(init?: Partial<ReleiverRunningApproverMatrixViewModel>){
		Object.assign(this, init);
	}
    ReferrenceId: number;
    UserId: number;
    StatusId: number;
    Remarks: string;
    StatusName:string;
    UserName:string;
    ActionDateString:string;
}