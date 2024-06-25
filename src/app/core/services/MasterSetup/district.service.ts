import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { CodeNamePair } from '../../models/mastersetup-model/codenamepair.model';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { DistrictModel,DistrictViewModel } from '../../models/mastersetup-model/district.model';

@Injectable({ providedIn: 'root' })

export class DistrictService {
    baseurl = environment.baseUrl;
	apiUrlType = 'district';

    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<DistrictViewModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: string) {
        return this.http.get<DistrictViewModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: DistrictModel): Observable<ServiceResponseDataModel<DistrictModel>> {
        return this.http.post<ServiceResponseDataModel<DistrictModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: DistrictModel): Observable<ServiceResponseDataModel<DistrictModel>> {
        return this.http.post<ServiceResponseDataModel<DistrictModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
}
