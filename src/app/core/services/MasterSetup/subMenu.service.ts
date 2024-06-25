import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { SubMenuModel } from '../../models/mastersetup-model/subMenu.model';


@Injectable({ providedIn: 'root' })

export class SubMenuService {
    baseurl = environment.baseUrl;
    apiUrlType = 'subMenu';
    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<SubMenuModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: string) {
        return this.http.get<SubMenuModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: SubMenuModel): Observable<ServiceResponseDataModel<SubMenuModel>> {
        return this.http.post<ServiceResponseDataModel<SubMenuModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: SubMenuModel): Observable<ServiceResponseDataModel<SubMenuModel>> {
        return this.http.post<ServiceResponseDataModel<SubMenuModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}
