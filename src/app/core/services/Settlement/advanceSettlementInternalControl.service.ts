import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { CodeNamePair } from '../../models/mastersetup-model/codenamepair.model';
import { AdvanceSettlementRunningApproverMatrixModel, AdvanceSettlementRunningApproverMatrixSupervisorViewModel } from '../../models/settlement-model/advanceSettlementRunningApproverMatrix.model';
import { AdvanceSettlementInternalControlApproverMatrix } from '../../models/settlement-model/advanceSettlementInternalControlApproverMatrix.model';
import { AdvanceSettlementSearchModel, AdvanceSettlementViewModel } from '../../models/settlement-model/settlement.model';


@Injectable({ providedIn: 'root' })

export class AdvanceSettlementInternalControlService {

    baseurl = environment.baseUrl;
    apiUrlType = 'arSettlementInternalControl';

    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<CodeNamePair[]>(this.baseurl + this.apiUrlType + `/getInitData`);
    }
   
    public getAll() {
        return this.http.get<AdvanceSettlementRunningApproverMatrixModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: number) {
        return this.http.get<AdvanceSettlementRunningApproverMatrixModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }
    
    
    public saveAsInternalControlApproved(data: AdvanceSettlementInternalControlApproverMatrix): Observable<ServiceResponseDataModel<AdvanceSettlementInternalControlApproverMatrix>> {
        return this.http.post<ServiceResponseDataModel<AdvanceSettlementInternalControlApproverMatrix>>(this.baseurl + this.apiUrlType + '/updateTaskForInternalControlGroup', data).pipe(retry(1))
    }
    public saveAsHRApproved(data: AdvanceSettlementInternalControlApproverMatrix): Observable<ServiceResponseDataModel<AdvanceSettlementInternalControlApproverMatrix>> {
        return this.http.post<ServiceResponseDataModel<AdvanceSettlementInternalControlApproverMatrix>>(this.baseurl + this.apiUrlType + '/updateTaskForHRGroup', data).pipe(retry(1))
    }

    public createInternalGroupTask(data: AdvanceSettlementRunningApproverMatrixSupervisorViewModel): Observable<ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>> {
        return this.http.post<ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>>(this.baseurl + this.apiUrlType + '/createTaskForInternalControlGroup', data).pipe(retry(1))
    }
    public createTaskForHRGroup(data: AdvanceSettlementRunningApproverMatrixSupervisorViewModel): Observable<ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>> {debugger
        return this.http.post<ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>>(this.baseurl + this.apiUrlType + '/createTaskForHRGroup', data).pipe(retry(1))
    }
    public createTaskFinanceCompleteToVerifyHRGroup(data: AdvanceSettlementRunningApproverMatrixSupervisorViewModel): Observable<ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>> {
        return this.http.post<ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>>(this.baseurl + this.apiUrlType + '/createTaskFinanceCompleteToVerifyHRGroup', data).pipe(retry(1))
    }
    
   
    public getInternalControlList(model: AdvanceSettlementSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<AdvanceSettlementSearchModel[]>(this.baseurl + this.apiUrlType + `/getInternalControlSettlementTaskListByStatus`,params);
    }

    public getSearch<T>(url: string, queryParams?: HttpParams, headers?: HttpHeaders): Observable<T> {
        let httpHeaders = headers != undefined ? headers : new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.get<T>(url, { headers: httpHeaders, params: queryParams });
    }
    public getHRList(model: AdvanceSettlementSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<AdvanceSettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getHRSettlementTaskListByStatus`,params);
    }
}