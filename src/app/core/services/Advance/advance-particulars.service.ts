import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { CodeNamePairViewModel } from '../../models/mastersetup-model/codenamepair.model';

@Injectable({ providedIn: 'root' })

export class AdvanceParticularsService {

    baseurl = environment.baseUrl;
	apiUrlType = 'advanceParticulars';

    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<CodeNamePairViewModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: number) {
        return this.http.get<CodeNamePairViewModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: CodeNamePairViewModel): Observable<ServiceResponseDataModel<CodeNamePairViewModel>> {
        return this.http.post<ServiceResponseDataModel<CodeNamePairViewModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: CodeNamePairViewModel): Observable<ServiceResponseDataModel<CodeNamePairViewModel>> {
        return this.http.post<ServiceResponseDataModel<CodeNamePairViewModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }

}
