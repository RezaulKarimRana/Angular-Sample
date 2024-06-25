import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { OfficeLocationViewModel } from '../../models/officeLocation.model';
import { DistrictModel } from '../../models/mastersetup-model/district.model';


@Injectable({ providedIn: 'root' })

export class OfficeLocationService {
    baseurl = environment.baseUrl;
	apiUrlType = 'officeLocation';
    districtUrlType = 'district';
    constructor(private http: HttpClient) { }

    public getAll() {
        return this.http.get<OfficeLocationViewModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: string) {
        return this.http.get<OfficeLocationViewModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: OfficeLocationViewModel): Observable<ServiceResponseDataModel<OfficeLocationViewModel>> {
        return this.http.post<ServiceResponseDataModel<OfficeLocationViewModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: OfficeLocationViewModel): Observable<ServiceResponseDataModel<OfficeLocationViewModel>> {
        return this.http.post<ServiceResponseDataModel<OfficeLocationViewModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }
    public getAllDistricts() {
        return this.http.get<DistrictModel[]>(this.baseurl + this.districtUrlType + `/getall`);
    }
}
