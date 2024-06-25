import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { SettlementDashbardSearchModel, SettlementViewModel } from '../../models/settlement-model/settlement.model';
@Injectable({ providedIn: 'root' })

export class SettlementDashboardService{

    baseurl = environment.baseUrl;
    apiUrlType = 'dashboard';

    constructor(private http: HttpClient) { }

    public getSearch<T>(url: string, queryParams?: HttpParams, headers?: HttpHeaders): Observable<T> {
        let httpHeaders = headers != undefined ? headers : new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.get<T>(url, { headers: httpHeaders, params: queryParams });
    }

    public getDashboardData(model: SettlementDashbardSearchModel) {
        var params = new HttpParams();
		if (model != undefined) {
			for (let key in model) {
				params = params.append(key, model[key]);
			}
		}
        return this.getSearch<SettlementViewModel[]>(this.baseurl + this.apiUrlType + `/getsettlementlist`,params);
    }
}