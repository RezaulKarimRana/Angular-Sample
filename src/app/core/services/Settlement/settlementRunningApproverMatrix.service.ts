import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { CodeNamePair } from '../../models/mastersetup-model/codenamepair.model';
import { SettlementBulkPaymentModel, SettlementDashboardInitModel, SettlementSearchModel, SettlementViewModel } from '../../models/settlement-model/settlement.model';
import { SettlementRunningApproverMatrixModel, SettlementRunningApproverMatrixSupervisorViewModel } from '../../models/settlement-model/settlementRunningApproverMatrix.model';
@Injectable({ providedIn: 'root' })

export class SettlementRunningApproverMatrixService {

    baseurl = environment.baseUrl;
    apiUrlType = 'settlementApproverRunningMatrix';

    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<CodeNamePair[]>(this.baseurl + this.apiUrlType + `/getInitData`);
    }
    public getDashboardInitData() {
        return this.http.get<SettlementDashboardInitModel>(this.baseurl + this.apiUrlType + `/getDashboardInitData`);
    }
    public getAll() {
        return this.http.get<SettlementRunningApproverMatrixModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: number) {
        return this.http.get<SettlementRunningApproverMatrixModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }
    
    public saveAsApproved(data: SettlementRunningApproverMatrixSupervisorViewModel): Observable<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>> {
        return this.http.post<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>>(this.baseurl + this.apiUrlType + '/saveAsApproved', data).pipe(retry(1))
    }

    public saveAsBulkApproverApproved(data: SettlementBulkPaymentModel): Observable<ServiceResponseDataModel<SettlementBulkPaymentModel>> {
        return this.http.post<ServiceResponseDataModel<SettlementBulkPaymentModel>>(this.baseurl + this.apiUrlType + '/saveAsBulkApproverApproved', data);
    }

    public saveAsApproverApproved(data: SettlementRunningApproverMatrixSupervisorViewModel): Observable<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>> {
        return this.http.post<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>>(this.baseurl + this.apiUrlType + '/saveAsApproverApproved', data).pipe(retry(1))
    }

    public saveAsApproverReturn(data: SettlementRunningApproverMatrixSupervisorViewModel): Observable<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>> {
        return this.http.post<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>>(this.baseurl + this.apiUrlType + '/saveAsApproverReturn', data);
    }

    public saveAsInternalControlApproved(data: SettlementRunningApproverMatrixSupervisorViewModel): Observable<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>> {
        return this.http.post<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>>(this.baseurl + this.apiUrlType + '/saveAsInternalControlGroupApproved', data).pipe(retry(1))
    }

    public getSuperVisorList(model: SettlementSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<SettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getSupervisorSettlementTaskListByStatus`, params);
    }
    
    public getApproverList(model: SettlementSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<SettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getApproverSettlementTaskListByStatus`,params);
    }

    public getSearch<T>(url: string, queryParams?: HttpParams, headers?: HttpHeaders): Observable<T> {
        let httpHeaders = headers != undefined ? headers : new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.get<T>(url, { headers: httpHeaders, params: queryParams });
    }
}