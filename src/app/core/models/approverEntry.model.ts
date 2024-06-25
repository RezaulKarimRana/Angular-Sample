export class ApproverEntryModel{
    constructor(init?: Partial<ApproverEntryModel>){
		Object.assign(this, init);
	}
    VoucherNo: string;
    Remarks: string;
}