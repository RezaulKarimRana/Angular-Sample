import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdvanceDashbardSearchModel, AdvanceViewModel } from '../../models/advance-model/advance.model';
@Injectable({ providedIn: 'root' })

export class AdvanceDashboardService{

    baseurl = environment.baseUrl;
    apiUrlType = 'dashboard';

    constructor(private http: HttpClient) { }

    public getSearch<T>(url: string, queryParams?: HttpParams, headers?: HttpHeaders): Observable<T> {
        let httpHeaders = headers != undefined ? headers : new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.get<T>(url, { headers: httpHeaders, params: queryParams });
    }

    public getDashboardData(model: AdvanceDashbardSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<AdvanceViewModel[]>(this.baseurl + this.apiUrlType + `/getadvancedlist`,params);
    }
}