import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { AdvanceApproverMatrixModel } from '../../models/advance-model/advanceApproverMatrix.model';
import { ApprovalWorkFlowMatrixModel } from '../../models/advance-model/approvalWorkFlowMatrix.model';


@Injectable({ providedIn: 'root' })

export class AdvanceApproverMatrixService {

    baseurl = environment.baseUrl;
    apiUrlType = 'advanceApproverMatrix';

    constructor(private http: HttpClient) { }

    public getInitWorkFlow() {
        return this.http.get<ApprovalWorkFlowMatrixModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }
    public getAllWorkFlowMatrix() {
        return this.http.get<ApprovalWorkFlowMatrixModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }
    public getById(id: number) {
        return this.http.get<AdvanceApproverMatrixModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }
    public save(data: AdvanceApproverMatrixModel): Observable<ServiceResponseDataModel<AdvanceApproverMatrixModel>> {
        return this.http.post<ServiceResponseDataModel<AdvanceApproverMatrixModel>>(this.baseurl + this.apiUrlType + '/save', data).pipe(retry(1))
    }
    public update(data: AdvanceApproverMatrixModel): Observable<ServiceResponseDataModel<AdvanceApproverMatrixModel>> {
        return this.http.post<ServiceResponseDataModel<AdvanceApproverMatrixModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}