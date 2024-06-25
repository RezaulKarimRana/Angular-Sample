import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { AdvanceParticulars } from '../../models/advance-model/advance.model';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { CodeNamePair } from '../../models/mastersetup-model/codenamepair.model';


@Injectable({ providedIn: 'root' })

export class SettlementParticularsService {

    baseurl = environment.baseUrl;
	apiUrlType = 'settlementParticulars';

    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<CodeNamePair[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: string) {
        return this.http.get<CodeNamePair>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: AdvanceParticulars): Observable<ServiceResponseDataModel<AdvanceParticulars>> {
        return this.http.post<ServiceResponseDataModel<AdvanceParticulars>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: AdvanceParticulars): Observable<ServiceResponseDataModel<AdvanceParticulars>> {
        return this.http.post<ServiceResponseDataModel<AdvanceParticulars>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }

}
