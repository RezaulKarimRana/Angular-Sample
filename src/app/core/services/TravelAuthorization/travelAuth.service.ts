import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { TADashboardInitModel,TAHoldViewModel, TASettlementModel, TravelAuthListModel, TravelAuthorization, TravelAuthorizationSearchModel, TravelAuthorizationViewModel } from '../../models/travel-authorisation-model/travelAuthorisation.model';
import { retry } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class TravelAuthorizationService {
    baseurl = environment.baseUrl;
	apiUrlType = 'travelAuthorization';
    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<TravelAuthListModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }
    public getDashboardInitData() {
        return this.http.get<TADashboardInitModel>(this.baseurl + this.apiUrlType + `/getDashboardInitData`);
    }
    public getInitSearchData() {
        return this.http.get<TravelAuthorizationSearchModel>(this.baseurl + this.apiUrlType + `/getInitSearchData`);
    }
    public getSuperVisorList(model: TravelAuthorizationSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<TravelAuthorizationViewModel[]>(this.baseurl + this.apiUrlType + `/getSupervisorTaskListByStatus`, params);
    }
    public getReadyForSettlementList() {
        return this.getSearch<TravelAuthorizationViewModel[]>(this.baseurl + this.apiUrlType + `/getReadyForSettlementList`);
    }
    public getByIdForSettlement(id: string) {
        return this.http.get<ServiceResponseDataModel<TASettlementModel>>(this.baseurl + this.apiUrlType + `/getByIdForSettlement/${id}`);
    }
    public getAllByParams(model: TravelAuthorizationSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<TravelAuthorizationViewModel[]>(this.baseurl + this.apiUrlType + `/getall`, params );
    }
    public getallBySubordinateUser(model: TravelAuthorizationSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<TravelAuthorizationViewModel[]>(this.baseurl + this.apiUrlType + `/getallBySubordinateUser`, params );
    }
    public getById(id: string) {
        return this.http.get<ServiceResponseDataModel<TravelAuthorizationViewModel>>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }
    public save(data: TravelAuthorization): Observable<ServiceResponseDataModel<TravelAuthorization>> {
        return this.http.post<ServiceResponseDataModel<TravelAuthorization>>(this.baseurl + this.apiUrlType + '/save', data).pipe(retry(1))
    }
    public getSearch<T>(url: string, queryParams?: HttpParams, headers?: HttpHeaders): Observable<T> {
        let httpHeaders = headers != undefined ? headers : new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.get<T>(url, { headers: httpHeaders, params: queryParams });
    }
    public getDeptWiseList(model: TravelAuthorizationSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<TravelAuthorizationViewModel[]>(this.baseurl + this.apiUrlType + `/getDeptWiseList`, params );
    }
    public getAllApprovedForBC(model: TravelAuthorizationSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<TravelAuthorizationViewModel[]>(this.baseurl + this.apiUrlType + `/getAllApprovedForBC`, params );
    }
    public getDashboardData(model: TravelAuthorizationSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<TravelAuthorizationViewModel[]>(this.baseurl + this.apiUrlType + `/getTravelAuthList`,params);
    }
    public updateHoldItem(data: TAHoldViewModel): Observable<ServiceResponseDataModel<TAHoldViewModel>> {
        return this.http.post<ServiceResponseDataModel<TAHoldViewModel>>(this.baseurl + this.apiUrlType + '/updateHoldItem', data);
    }
    public deleteTA(id: Number): Observable<ServiceResponseDataModel<boolean>> {
        return this.http.post<ServiceResponseDataModel<boolean>>(this.baseurl + this.apiUrlType + '/deleteTA', id);
    }
}
