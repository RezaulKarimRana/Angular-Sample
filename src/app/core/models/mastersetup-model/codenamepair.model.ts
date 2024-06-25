import { BaseModel } from '../../base/_base.model';

export class CodeNamePair extends BaseModel {
	constructor(init?: Partial<CodeNamePair>) {
		super();
		Object.assign(this, init);
	}
	Id?: string;
	Name: string;
	IsActive: boolean;
	HasChild: boolean;
	clear(): void {
		this.Id = undefined;
		this.Name = '';
	}
}
export class CodeNamePairViewModel extends CodeNamePair {
	constructor(init?: Partial<CodeNamePairViewModel>) {
		super(init);
		Object.assign(this, init);
	}
	Status: string;
}

export class IdTextNameModel {
	constructor(init?: Partial<IdTextNameModel>) {
		Object.assign(this, init);
	}
	Id: string;
	Text: string;
	Name: string;
}
export class NameIdPair {
	constructor(init?: Partial<NameIdPair>) {
		Object.assign(this, init);
	}
	Id: number;
	Name: string;
}
export class UrlTypeModel {
	constructor(init?: Partial<UrlTypeModel>) {
		Object.assign(this, init);
	}
	Codenamepair: string;
	ApiUrlType: string;
}

