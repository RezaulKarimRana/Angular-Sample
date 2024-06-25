import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { ApproverSubGroupUserModel, ApproverSubGroupUsersViewModel } from '../../models/group-model/approver.subGroupUser.model';


@Injectable({ providedIn: 'root' })

export class ApproverSubGroupUserService {

    baseurl = environment.baseUrl;
    apiUrlType = 'approverSubGroupUser';

    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<any>(this.baseurl + this.apiUrlType + `/getInitData`);
    }

    public getAll() {
        return this.http.get<ApproverSubGroupUserModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: number) {
        return this.http.get<ApproverSubGroupUserModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: ApproverSubGroupUserModel): Observable<ServiceResponseDataModel<ApproverSubGroupUserModel>> {
        return this.http.post<ServiceResponseDataModel<ApproverSubGroupUserModel>>(this.baseurl + this.apiUrlType + '/save', data).pipe(retry(1))
    }

    public update(data: ApproverSubGroupUserModel): Observable<ServiceResponseDataModel<ApproverSubGroupUserModel>> {
        return this.http.post<ServiceResponseDataModel<ApproverSubGroupUserModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
    public getBySubGroupId(id: number) {
        return this.http.get<ApproverSubGroupUserModel[]>(this.baseurl + this.apiUrlType + `/GetBySubGroupId/${id}`);
    }
    public getApproverGroupInfo(subGroupId: number) {
        return this.http.get<ApproverSubGroupUsersViewModel[]>(this.baseurl + this.apiUrlType + `/getApproverGroupInfo/${subGroupId}`);
    }
}