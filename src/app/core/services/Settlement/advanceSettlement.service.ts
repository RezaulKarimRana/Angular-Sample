import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { ServiceResponseDataModel } from "../../query-model/query-results.model";
import { ResponseModel } from "../../models/response.model";
import {
  AdvanceSettlementSearchModel,
  AdvanceSettlementViewModel,
  AdvancedSettlementListModel,
} from "../../models/settlement-model/settlement.model";
import { SearchModel } from "../../models/search-model";

@Injectable({ providedIn: "root" })
export class AdvanceSettlementService {
  baseurl = environment.baseUrl;
  apiUrlType = "advanceSettlement";
  constructor(private http: HttpClient) {}

  public getInitData() {
    return this.http.get<AdvancedSettlementListModel>(
      this.baseurl + this.apiUrlType + `/getInitData`
    );
  }
  public getDashboardInitData() {
    return this.http.get<AdvancedSettlementListModel>(
      this.baseurl + this.apiUrlType + `/getDashboardInitData`
    );
  }
  public getReadyForSettlement(model: AdvanceSettlementSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceSettlementViewModel[]>(
      this.baseurl + this.apiUrlType + `/getReadyForSettlement`,
      params
    );
  }
  public getAllByParams(model: AdvanceSettlementSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceSettlementViewModel[]>(
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
    return this.getSearch<AdvanceSettlementViewModel[]>(
      this.baseurl + this.apiUrlType + `/getall`,
      params
    );
  }
  public getAllBySubordinateParams(model: AdvanceSettlementSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceSettlementViewModel[]>(
      this.baseurl + this.apiUrlType + `/getallBySubordinateUser`,
      params
    );
  }
  public getById(id: string) {
    return this.http.get<ServiceResponseDataModel<AdvanceSettlementViewModel>>(
      this.baseurl + this.apiUrlType + `/getbyId/${id}`
    );
  }
  public create(data: FormData) {
    return this.http.post<ServiceResponseDataModel<ResponseModel>>(
      this.baseurl + this.apiUrlType + `/create`,
      data
    );
  }
  public update(data: FormData) {
    return this.http.post<ServiceResponseDataModel<ResponseModel>>(
      this.baseurl + this.apiUrlType + `/update`,
      data
    );
  }
  public getByIdforSupvisor(id: string) {
    return this.http.get<ServiceResponseDataModel<AdvanceSettlementViewModel>>(
      this.baseurl + this.apiUrlType + `/getbyIdforSupvisor/${id}`
    );
  }
  public getByIdforApprover(id: string) {
    return this.http.get<ServiceResponseDataModel<AdvanceSettlementViewModel>>(
      this.baseurl + this.apiUrlType + `/getByIdforApprover/${id}`
    );
  }
  public getByIdforInternalControl(id: string) {
    return this.http.get<ServiceResponseDataModel<AdvanceSettlementViewModel>>(
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
  public deleteExistingAttachment(id: Number) {
    return this.http.get<ServiceResponseDataModel<ResponseModel>>(
      this.baseurl + this.apiUrlType + `/deleteExistingAttachment/${id}`
    );
  }
}
