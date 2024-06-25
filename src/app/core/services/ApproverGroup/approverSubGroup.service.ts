import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { ApproverSubGroupModel } from '../../models/group-model/approverSubGroup.model';


@Injectable({ providedIn: 'root' })

export class ApproverSubGroupService {

    baseurl = environment.baseUrl;
    apiUrlType = 'approverSubGroup';

    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<ApproverSubGroupModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }

    public getAll() {
        return this.http.get<ApproverSubGroupModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: number,) {
        return this.http.get<ApproverSubGroupModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: ApproverSubGroupModel): Observable<ServiceResponseDataModel<ApproverSubGroupModel>> {
        return this.http.post<ServiceResponseDataModel<ApproverSubGroupModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: ApproverSubGroupModel): Observable<ServiceResponseDataModel<ApproverSubGroupModel>> {
        return this.http.post<ServiceResponseDataModel<ApproverSubGroupModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}