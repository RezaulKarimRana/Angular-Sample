import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { CodeNamePair } from '../../models/mastersetup-model/codenamepair.model';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { TaskTypeDetailsModel } from '../../models/mastersetup-model/tasktypedetails.model';

@Injectable({ providedIn: 'root' })

export class TaskTypeDetailsService {
    baseurl = environment.baseUrl;
	apiUrlType = 'taskTypeDetails';

    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<CodeNamePair[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: string) {
        return this.http.get<CodeNamePair>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: CodeNamePair): Observable<ServiceResponseDataModel<CodeNamePair>> {
        return this.http.post<ServiceResponseDataModel<CodeNamePair>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: CodeNamePair): Observable<ServiceResponseDataModel<CodeNamePair>> {
        return this.http.post<ServiceResponseDataModel<CodeNamePair>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }

    //
    // public getAllWithTaskType() {
    //     return this.http.get<TaskTypeDetailsModel[]>(this.baseurl + this.apiUrlType + `/getallwithtasktype`);
    // }
    public getInitData() {
        return this.http.get<TaskTypeDetailsModel>(this.baseurl + this.apiUrlType + `/gettasktypedetailsinitdata`);
    }
    public getAllTaskType() {
        return this.http.get<TaskTypeDetailsModel[]>(this.baseurl + this.apiUrlType + `/getallwithtasktype`);
    }
    public getTaskTypeDetailsById(id: number) {
        return this.http.get<TaskTypeDetailsModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }
}
