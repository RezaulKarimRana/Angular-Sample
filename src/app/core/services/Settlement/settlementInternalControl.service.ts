import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { CodeNamePair } from '../../models/mastersetup-model/codenamepair.model';
import { SettlementRunningApproverMatrixModel, SettlementRunningApproverMatrixSupervisorViewModel } from '../../models/settlement-model/settlementRunningApproverMatrix.model';
import { SettlementSearchModel, SettlementViewModel } from '../../models/settlement-model/settlement.model';
import { SettlementInternalControlApproverMatrix } from '../../models/settlement-model/settlementInternalControlApproverMatrix.model';


@Injectable({ providedIn: 'root' })

export class SettlementInternalControlService {

    baseurl = environment.baseUrl;
    apiUrlType = 'settlementInternalControl';

    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<CodeNamePair[]>(this.baseurl + this.apiUrlType + `/getInitData`);
    }
   
    public getAll() {
        return this.http.get<SettlementRunningApproverMatrixModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: number) {
        return this.http.get<SettlementRunningApproverMatrixModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }
    
    
    public saveAsInternalControlApproved(data: SettlementInternalControlApproverMatrix): Observable<ServiceResponseDataModel<SettlementInternalControlApproverMatrix>> {
        return this.http.post<ServiceResponseDataModel<SettlementInternalControlApproverMatrix>>(this.baseurl + this.apiUrlType + '/updateTaskForInternalControlGroup', data).pipe(retry(1))
    }
    public saveAsHRApproved(data: SettlementInternalControlApproverMatrix): Observable<ServiceResponseDataModel<SettlementInternalControlApproverMatrix>> {
        return this.http.post<ServiceResponseDataModel<SettlementInternalControlApproverMatrix>>(this.baseurl + this.apiUrlType + '/updateTaskForHRGroup', data).pipe(retry(1))
    }

    public createInternalGroupTask(data: SettlementRunningApproverMatrixSupervisorViewModel): Observable<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>> {
        return this.http.post<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>>(this.baseurl + this.apiUrlType + '/createTaskForInternalControlGroup', data).pipe(retry(1))
    }
    public createTaskForHRGroup(data: SettlementRunningApproverMatrixSupervisorViewModel): Observable<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>> {
        return this.http.post<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>>(this.baseurl + this.apiUrlType + '/createTaskForHRGroup', data).pipe(retry(1))
    }
    public createTaskFinanceCompleteToVerifyHRGroup(data: SettlementRunningApproverMatrixSupervisorViewModel): Observable<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>> {
        return this.http.post<ServiceResponseDataModel<SettlementRunningApproverMatrixSupervisorViewModel>>(this.baseurl + this.apiUrlType + '/createTaskFinanceCompleteToVerifyHRGroup', data).pipe(retry(1))
    }
    
   
    public getInternalControlList(model: SettlementSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<SettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getInternalControlSettlementTaskListByStatus`,params);
    }

    public getSearch<T>(url: string, queryParams?: HttpParams, headers?: HttpHeaders): Observable<T> {
        let httpHeaders = headers != undefined ? headers : new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.get<T>(url, { headers: httpHeaders, params: queryParams });
    }
    public getHRList(model: SettlementSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<SettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getHRSettlementTaskListByStatus`,params);
    }
}