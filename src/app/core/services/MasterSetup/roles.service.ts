import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { RolesModel } from '../../models/mastersetup-model/roles.model';


@Injectable({ providedIn: 'root' })

export class RolesService {
    baseurl = environment.baseUrl;
    apiUrlType = 'roles';
    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<RolesModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: string) {
        return this.http.get<RolesModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: RolesModel): Observable<ServiceResponseDataModel<RolesModel>> {
        return this.http.post<ServiceResponseDataModel<RolesModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: RolesModel): Observable<ServiceResponseDataModel<RolesModel>> {
        return this.http.post<ServiceResponseDataModel<RolesModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}
