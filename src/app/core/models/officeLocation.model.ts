import { BaseModel } from '../base/_base.model';

export class OfficeLocationModel extends BaseModel {
	constructor(init?: Partial<OfficeLocationModel>) {
		super();
		Object.assign(this, init);
	}
	Id?: number;
	Name: string;
	DistrictId?: number;
	IsActive: boolean;


	clear(): void {
		this.Id = null;
		this.Name = '';
		this.DistrictId = null;
	}


	
}
export class OfficeLocationViewModel extends OfficeLocationModel {
	constructor(init?: Partial<OfficeLocationViewModel>) {
		super(init);
		Object.assign(this, init);
	}
	Status: string;
	DistrictName: string;
}

