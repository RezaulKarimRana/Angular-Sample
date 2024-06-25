import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { TAdAModel,TAdAInitModel } from '../../models/mastersetup-model/TAdAModel.model';


@Injectable({ providedIn: 'root' })

export class TAdAService {

    baseurl = environment.baseUrl;
    apiUrlType = 'taDaAllowance';

    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<TAdAInitModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }

    public getAll() {
        return this.http.get<TAdAModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: number,) {
        return this.http.get<TAdAModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: TAdAModel): Observable<ServiceResponseDataModel<TAdAModel>> {
        return this.http.post<ServiceResponseDataModel<TAdAModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: TAdAModel): Observable<ServiceResponseDataModel<TAdAModel>> {
        return this.http.post<ServiceResponseDataModel<TAdAModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
    public tADABulkAdd(userModel: TAdAModel[]): Observable<ServiceResponseDataModel<TAdAModel[]>> {
        return this.http.post<ServiceResponseDataModel<TAdAModel[]>>(this.baseurl + this.apiUrlType + '/createBulkTADA', userModel).pipe(retry(1))
    }
}