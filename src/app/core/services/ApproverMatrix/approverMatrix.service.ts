import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { ApproverMatrixModel } from '../../models/common-model/approvermatrix.model';


@Injectable({ providedIn: 'root' })

export class ApproverMatrixService {

    baseurl = environment.baseUrl;
    apiUrlType = 'approverMatrix';

    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<ApproverMatrixModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }
    public createAdvanceApproverMatrixBulk(approverMatrixModel: ApproverMatrixModel[]): Observable<ServiceResponseDataModel<ApproverMatrixModel[]>> {
        return this.http.post<ServiceResponseDataModel<ApproverMatrixModel[]>>(this.baseurl + this.apiUrlType + '/createAdvanceApproverMatrixBulk', approverMatrixModel).pipe(retry(1))
    }
    public createOutstationApproverMatrixBulk(approverMatrixModel: ApproverMatrixModel[]): Observable<ServiceResponseDataModel<ApproverMatrixModel[]>> {
        return this.http.post<ServiceResponseDataModel<ApproverMatrixModel[]>>(this.baseurl + this.apiUrlType + '/createOutstationApproverMatrixBulk', approverMatrixModel).pipe(retry(1))
    }
    public createSettlementApproverMatrixBulk(approverMatrixModel: ApproverMatrixModel[]): Observable<ServiceResponseDataModel<ApproverMatrixModel[]>> {
        return this.http.post<ServiceResponseDataModel<ApproverMatrixModel[]>>(this.baseurl + this.apiUrlType + '/createSettlementApproverMatrixBulk', approverMatrixModel).pipe(retry(1))
    }
}