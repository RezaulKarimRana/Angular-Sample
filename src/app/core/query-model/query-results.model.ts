export class ServiceResponseDataModelCommon {
	hasNextPage: boolean;
	Message: string;
	Success: boolean;
	status: string;
	total: number;
}
export class ServiceResponseDataModel<T> extends ServiceResponseDataModelCommon {
	Data: T;
	constructor(init?: Partial<ServiceResponseDataModel<T>>) {
		super();
		Object.assign(this, init);
	}
}