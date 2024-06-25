import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { UserInfoUpdateModel, UserInfoUpdateInitModel } from '../../models/admin-support/adminSupport.model';

@Injectable({ providedIn: 'root' })

export class AdminSupportService {
    baseurl = environment.baseUrl;
	apiUrlType = 'adminSupport';
    constructor(private http: HttpClient) { }

    public getUserInfoInitData() {
        return this.http.get<UserInfoUpdateInitModel>(this.baseurl + this.apiUrlType + `/getUserInfoInitData`);
    }
    public updateUserInfo(data: UserInfoUpdateModel): Observable<ServiceResponseDataModel<UserInfoUpdateModel>> {
        return this.http.post<ServiceResponseDataModel<UserInfoUpdateModel>>(this.baseurl + this.apiUrlType + '/updateUserInfo', data);
    }
}
