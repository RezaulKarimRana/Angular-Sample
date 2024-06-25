export class SearchModel {
  constructor(init?: Partial<SearchModel>) {
    Object.assign(this, init);
  }
  StatusId: number;
  UserId: number;
  RequestNo: string;
  DepartmentId: number;
  SiteCode: string;
}
