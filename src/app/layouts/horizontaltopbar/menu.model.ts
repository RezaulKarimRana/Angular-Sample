export interface MenuItem {
    Id?: number;
    Label?: string;
    Icon?: string;
    Link?: string;
    SubItems?: any;
    ParentId?: number;
    IsUiElement?: boolean;
    IsAdminUI?: boolean;
    Count?:number;
    RequestType? : string;
    SortOrder? :number;
}

export class MenuItemSearchModel{
    constructor(init?: Partial<MenuItemSearchModel>){
		Object.assign(this, init);
	}
    PageNumber:number;
    UserId: number;
    PageSize: number;

}
