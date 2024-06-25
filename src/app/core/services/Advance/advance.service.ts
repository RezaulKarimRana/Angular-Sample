import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  AdvancedListModel,
  AdvanceSearchModel,
  AdvanceViewModel,
} from "../../models/advance-model/advance.model";
import { ServiceResponseDataModel } from "../../query-model/query-results.model";
import { DistrictModel } from "../../models/mastersetup-model/district.model";
import { ResponseModel } from "../../models/response.model";
import { SearchModel } from "../../models/search-model";

@Injectable({ providedIn: "root" })
export class AdvanceService {
  baseurl = environment.baseUrl;
  apiUrlType = "advance";
  constructor(private http: HttpClient) {}

  public getInitData() {
    return this.http.get<AdvancedListModel>(
      this.baseurl + this.apiUrlType + `/getInitData`
    );
  }
  public getDashboardInitData() {
    return this.http.get<AdvancedListModel>(
      this.baseurl + this.apiUrlType + `/getDashboardInitData}`
    );
  }
  public getAllByParams(model: AdvanceSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceViewModel[]>(
      this.baseurl + this.apiUrlType + `/getall`,
      params
    );
  }
  public getDataByParams(model: SearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceViewModel[]>(
      this.baseurl + this.apiUrlType + `/getall`,
      params
    );
  }
  public getDeptWiseList(model: AdvanceSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceViewModel[]>(
      this.baseurl + this.apiUrlType + `/getDeptWiseList`,
      params
    );
  }
  public getAllApprovedByParams(model: AdvanceSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceViewModel[]>(
      this.baseurl + this.apiUrlType + `/getallApproved`,
      params
    );
  }
  public getAllBySubordinateParams(model: AdvanceSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceViewModel[]>(
      this.baseurl + this.apiUrlType + `/getallBySubordinateUser`,
      params
    );
  }
  public getById(id: string) {
    return this.http.get<ServiceResponseDataModel<AdvanceViewModel>>(
      this.baseurl + this.apiUrlType + `/getbyId/${id}`
    );
  }
  public save(data: FormData) {
    return this.http.post<ServiceResponseDataModel<ResponseModel>>(
      this.baseurl + this.apiUrlType + `/save`,
      data
    );
  }
  public getByIdforSupvisor(id: string) {
    return this.http.get<ServiceResponseDataModel<AdvanceViewModel>>(
      this.baseurl + this.apiUrlType + `/getbyIdforSupvisor/${id}`
    );
  }
  public getByIdforApprover(id: string) {
    return this.http.get<ServiceResponseDataModel<AdvanceViewModel>>(
      this.baseurl + this.apiUrlType + `/getByIdforApprover/${id}`
    );
  }
  public getReadyForSettlement() {
    return this.getSearch<AdvanceViewModel[]>(
      this.baseurl + this.apiUrlType + `/getReadyForSettlement`
    );
  }
  public getByIdforInternalControl(id: string) {
    return this.http.get<ServiceResponseDataModel<AdvanceViewModel>>(
      this.baseurl + this.apiUrlType + `/getByIdforInternalControl/${id}`
    );
  }

  public getSearch<T>(
    url: string,
    queryParams?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    let httpHeaders =
      headers != undefined
        ? headers
        : new HttpHeaders({
            "Content-Type": "application/json",
          });
    return this.http.get<T>(url, { headers: httpHeaders, params: queryParams });
  }
}
