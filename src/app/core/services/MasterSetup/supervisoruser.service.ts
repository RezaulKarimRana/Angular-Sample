import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from '../../models/auth.models';
import { SupervisorBulkModel, SupervisorModel } from '../../models/mastersetup-model/user.model';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })

export class SupervisorUserService {

    baseurl = environment.baseUrl;
    apiUrlType = 'supervisor';
    constructor(private http: HttpClient) { }

 
    public create(userModel: SupervisorModel[]): Observable<ServiceResponseDataModel<SupervisorModel[]>> {
        return this.http.post<ServiceResponseDataModel<SupervisorModel[]>>(this.baseurl + this.apiUrlType + '/Save', userModel).pipe(retry(1))
    }
    
    public update(userModel: SupervisorModel[]): Observable<ServiceResponseDataModel<SupervisorModel[]>> {
        return this.http.post<ServiceResponseDataModel<SupervisorModel[]>>(this.baseurl + this.apiUrlType + '/update', userModel).pipe(retry(1))
    }

    public getAll() {
        return this.http.get<SupervisorModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public supervisorUserBulkAdd(userModel: SupervisorBulkModel[]): Observable<ServiceResponseDataModel<SupervisorBulkModel[]>> {
        return this.http.post<ServiceResponseDataModel<SupervisorBulkModel[]>>(this.baseurl + this.apiUrlType + '/savebulkSupervisor', userModel).pipe(retry(1))
    }
}
