import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { ApproverGroupModel } from '../../models/group-model/approverGroup.model';


@Injectable({ providedIn: 'root' })

export class ApproverGroupService {

    baseurl = environment.baseUrl;
    apiUrlType = 'approverGroup';

    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<ApproverGroupModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: number) {
        return this.http.get<ApproverGroupModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: ApproverGroupModel): Observable<ServiceResponseDataModel<ApproverGroupModel>> {
        return this.http.post<ServiceResponseDataModel<ApproverGroupModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: ApproverGroupModel): Observable<ServiceResponseDataModel<ApproverGroupModel>> {
        return this.http.post<ServiceResponseDataModel<ApproverGroupModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}
