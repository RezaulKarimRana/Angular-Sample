import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { ResponseModel } from '../../models/response.model';
import { Releiver, ReleiverInitModel, ReleiverRunningApproverMatrixViewModel, ReleiverSearchModel, ReleiverViewModel } from '../../models/releiver/releiver.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ReleiverService {
    baseurl = environment.baseUrl;
	apiUrlType = 'releiver';
    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<ReleiverInitModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }
    public save(data: Releiver){
        return this.http.post<ServiceResponseDataModel<ResponseModel>>(this.baseurl + this.apiUrlType+`/save`, data);
    }
    public getById(id: string) {
        return this.http.get<ServiceResponseDataModel<ReleiverViewModel>>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }
    public getAllByParams(model: ReleiverSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<ReleiverViewModel[]>(this.baseurl + this.apiUrlType + `/getall`, params );
    }
    public getApproverLisByParams(model: ReleiverSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<ReleiverViewModel[]>(this.baseurl + this.apiUrlType + `/getApproverLisByParams`, params );
    }
    public getSearch<T>(url: string, queryParams?: HttpParams, headers?: HttpHeaders): Observable<T> {
        let httpHeaders = headers != undefined ? headers : new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.get<T>(url, { headers: httpHeaders, params: queryParams });
    }
    public saveAsApproved(data: ReleiverRunningApproverMatrixViewModel): Observable<ServiceResponseDataModel<ReleiverRunningApproverMatrixViewModel>> {
        return this.http.post<ServiceResponseDataModel<ReleiverRunningApproverMatrixViewModel>>(this.baseurl + this.apiUrlType + '/saveAsApproved', data);
    }

    public saveAsDeclined(data: ReleiverRunningApproverMatrixViewModel): Observable<ServiceResponseDataModel<ReleiverRunningApproverMatrixViewModel>> {
        return this.http.post<ServiceResponseDataModel<ReleiverRunningApproverMatrixViewModel>>(this.baseurl + this.apiUrlType + '/saveAsDeclined', data);
    }
}
