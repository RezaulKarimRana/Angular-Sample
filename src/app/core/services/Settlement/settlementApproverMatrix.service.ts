import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { SettlementApproverMatrixModel } from '../../models/settlement-model/settlementApproverMatrix.model';

@Injectable({ providedIn: 'root' })

export class SettlementApproverMatrixService {

    baseurl = environment.baseUrl;
    apiUrlType = 'settlementApproverMatrix';

    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<SettlementApproverMatrixModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }

    public getAll() {
        return this.http.get<SettlementApproverMatrixModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: number) {
        return this.http.get<SettlementApproverMatrixModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }
    
    public save(data: SettlementApproverMatrixModel): Observable<ServiceResponseDataModel<SettlementApproverMatrixModel>> {
        return this.http.post<ServiceResponseDataModel<SettlementApproverMatrixModel>>(this.baseurl + this.apiUrlType + '/save', data).pipe(retry(1))
    }

    public update(data: SettlementApproverMatrixModel): Observable<ServiceResponseDataModel<SettlementApproverMatrixModel>> {
        return this.http.post<ServiceResponseDataModel<SettlementApproverMatrixModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}