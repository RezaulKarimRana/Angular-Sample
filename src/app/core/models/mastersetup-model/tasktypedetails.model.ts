import { TaskTypeModel } from "./taskType.model";

export class TaskTypeDetailsModel {
    Id:number;
    Name:string;
    TaskName:string;
    IsActive: boolean;
    TaskTypeId:number;
    TaskTypeList: TaskTypeModel[];
}

export class UrlTypeModel {
	constructor(init?: Partial<UrlTypeModel>) {
		Object.assign(this, init);
	}
	Codenamepair: string;
	ApiUrlType: string;
}