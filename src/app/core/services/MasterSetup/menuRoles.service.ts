import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { MenuRoleModel, MenuRolesInitModel } from '../../models/mastersetup-model/menuRoles.model';


@Injectable({ providedIn: 'root' })

export class MenuRolesService {
    baseurl = environment.baseUrl;
    apiUrlType = 'menuRoles';
    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<MenuRolesInitModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }

    public getAll() {
        return this.http.get<MenuRoleModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: string) {
        return this.http.get<MenuRoleModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: MenuRoleModel): Observable<ServiceResponseDataModel<MenuRoleModel>> {
        return this.http.post<ServiceResponseDataModel<MenuRoleModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: MenuRoleModel): Observable<ServiceResponseDataModel<MenuRoleModel>> {
        return this.http.post<ServiceResponseDataModel<MenuRoleModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}
