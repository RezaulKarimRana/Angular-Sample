import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { UserRolesInitModel, UserRolesModel } from '../../models/mastersetup-model/user-roles.model';


@Injectable({ providedIn: 'root' })

export class UserRolesService {
    baseurl = environment.baseUrl;
    apiUrlType = 'userRoles';
    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<UserRolesInitModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }

    public getAll() {
        return this.http.get<UserRolesModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: string) {
        return this.http.get<UserRolesModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: UserRolesModel): Observable<ServiceResponseDataModel<UserRolesModel>> {
        return this.http.post<ServiceResponseDataModel<UserRolesModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: UserRolesModel): Observable<ServiceResponseDataModel<UserRolesModel>> {
        return this.http.post<ServiceResponseDataModel<UserRolesModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}
