import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { MenuModel } from '../../models/mastersetup-model/menu.model';


@Injectable({ providedIn: 'root' })

export class MenuService {
    baseurl = environment.baseUrl;
    apiUrlType = 'menu';
    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<MenuModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: string) {
        return this.http.get<MenuModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: MenuModel): Observable<ServiceResponseDataModel<MenuModel>> {
        return this.http.post<ServiceResponseDataModel<MenuModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: MenuModel): Observable<ServiceResponseDataModel<MenuModel>> {
        return this.http.post<ServiceResponseDataModel<MenuModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}
