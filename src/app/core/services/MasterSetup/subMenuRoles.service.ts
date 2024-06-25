import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { SubMenuRoleModel, SubMenuRolesInitModel } from '../../models/mastersetup-model/subMenuRoles.model';


@Injectable({ providedIn: 'root' })

export class SubMenuRolesService {
    baseurl = environment.baseUrl;
    apiUrlType = 'subMenuRoles';
    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<SubMenuRolesInitModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }

    public getAll() {
        return this.http.get<SubMenuRoleModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: string) {
        return this.http.get<SubMenuRoleModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: SubMenuRoleModel): Observable<ServiceResponseDataModel<SubMenuRoleModel>> {
        return this.http.post<ServiceResponseDataModel<SubMenuRoleModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: SubMenuRoleModel): Observable<ServiceResponseDataModel<SubMenuRoleModel>> {
        return this.http.post<ServiceResponseDataModel<SubMenuRoleModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}
