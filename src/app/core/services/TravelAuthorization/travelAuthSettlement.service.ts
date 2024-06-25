import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { TASettlementDashboardInitModel, TASettlementHoldViewModel, TASettlementListModel, TASettlement, TASettlementSearchModel, TASettlementViewModel } from '../../models/travel-authorisation-model/travelAuthorisationSettlement.model';
import { retry } from 'rxjs/operators';
import { ResponseModel } from '../../models/response.model';

@Injectable({ providedIn: 'root' })

export class TASettlementService {
    baseurl = environment.baseUrl;
	apiUrlType = 'tASettlement';
    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<TASettlementListModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }
    public getDashboardInitData() {
        return this.http.get<TASettlementDashboardInitModel>(this.baseurl + this.apiUrlType + `/getDashboardInitData`);
    }
    public getInitSearchData() {
        return this.http.get<TASettlementSearchModel>(this.baseurl + this.apiUrlType + `/getInitSearchData`);
    }
    public getSuperVisorList(model: TASettlementSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<TASettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getAllApproval`, params);
    }
    public getReadyForSettlementList() {
        return this.getSearch<TASettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getReadyForSettlementList`);
    }
    public getReadyListByParams() {
        return this.getSearch<TASettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getReadyList` );
    }
    public getAllByParams(model: TASettlementSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<TASettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getall`, params );
    }
    public getallBySubordinateUser(model: TASettlementSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<TASettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getallBySubordinateUser`, params );
    }
    public getById(id: string) {
        return this.http.get<ServiceResponseDataModel<TASettlementViewModel>>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }
    public create(data: FormData){
        return this.http.post<ServiceResponseDataModel<ResponseModel>>(this.baseurl + this.apiUrlType+`/create`, data);
    }
    public update(data: FormData){
        return this.http.post<ServiceResponseDataModel<ResponseModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
    public deleteExistingAttachment(id: Number){
        return this.http.get<ServiceResponseDataModel<ResponseModel>>(this.baseurl + this.apiUrlType + `/deleteExistingAttachment/${id}`);
    }
    public updateApproverFeedBack(data: TASettlementViewModel): Observable<ServiceResponseDataModel<TASettlementViewModel>> {
        return this.http.post<ServiceResponseDataModel<TASettlementViewModel>>(this.baseurl + this.apiUrlType + '/updateApproverFeedBack', data).pipe(retry(1))
    }
    public getSearch<T>(url: string, queryParams?: HttpParams, headers?: HttpHeaders): Observable<T> {
        let httpHeaders = headers != undefined ? headers : new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.get<T>(url, { headers: httpHeaders, params: queryParams });
    }
    public getDashboardData(model: TASettlementSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<TASettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getTravelAuthList`,params);
    }
    public updateHoldItem(data: TASettlementHoldViewModel): Observable<ServiceResponseDataModel<TASettlementHoldViewModel>> {
        return this.http.post<ServiceResponseDataModel<TASettlementHoldViewModel>>(this.baseurl + this.apiUrlType + '/updateHoldItem', data);
    }
}