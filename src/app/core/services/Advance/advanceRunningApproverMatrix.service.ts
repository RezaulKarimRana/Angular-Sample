import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { retry } from "rxjs/operators";
import { ServiceResponseDataModel } from "../../query-model/query-results.model";
import { AdvanceDashboardInitModel } from "../../models/advance-model/advanceRunningApproverMatrix.model";
import { AdvanceRunningApproverMatrixSupervisorViewModel } from "../../models/advance-model/advanceRunningApproverMatrix.model";
import {
  AdvanceBulkPaymentModel,
  AdvanceSearchModel,
  AdvanceViewModel,
} from "../../models/advance-model/advance.model";
import { CodeNamePair } from "../../models/mastersetup-model/codenamepair.model";
import { RunningApproverMatrixViewModel } from "../../models/runningApproverMatrix.model";
import { SearchModel } from "../../models/search-model";
@Injectable({ providedIn: "root" })
export class AdvanceRunningApproverMatrixService {
  baseurl = environment.baseUrl;
  apiUrlType = "advanceApproverRunningMatrix";

  constructor(private http: HttpClient) {}

  public getInitData() {
    return this.http.get<CodeNamePair[]>(
      this.baseurl + this.apiUrlType + `/getInitData`
    );
  }
  public getDashboardInitData() {
    return this.http.get<AdvanceDashboardInitModel>(
      this.baseurl + this.apiUrlType + `/getDashboardInitData`
    );
  }
  public saveAsBulkApproverApproved(
    data: AdvanceBulkPaymentModel
  ): Observable<ServiceResponseDataModel<AdvanceBulkPaymentModel>> {
    return this.http.post<ServiceResponseDataModel<AdvanceBulkPaymentModel>>(
      this.baseurl + this.apiUrlType + "/saveAsBulkApproverApproved",
      data
    );
  }
  public getAll() {
    return this.http.get<RunningApproverMatrixViewModel[]>(
      this.baseurl + this.apiUrlType + `/getall`
    );
  }

  public getById(id: number) {
    return this.http.get<RunningApproverMatrixViewModel>(
      this.baseurl + this.apiUrlType + `/getbyId/${id}`
    );
  }

  public saveAsApproved(
    data: AdvanceRunningApproverMatrixSupervisorViewModel
  ): Observable<
    ServiceResponseDataModel<AdvanceRunningApproverMatrixSupervisorViewModel>
  > {
    return this.http
      .post<
        ServiceResponseDataModel<AdvanceRunningApproverMatrixSupervisorViewModel>
      >(this.baseurl + this.apiUrlType + "/saveAsApproved", data)
      .pipe(retry(1));
  }

  public saveAsApproverApproved(
    data: AdvanceRunningApproverMatrixSupervisorViewModel
  ): Observable<
    ServiceResponseDataModel<AdvanceRunningApproverMatrixSupervisorViewModel>
  > {
    return this.http
      .post<
        ServiceResponseDataModel<AdvanceRunningApproverMatrixSupervisorViewModel>
      >(this.baseurl + this.apiUrlType + "/saveAsApproverApproved", data)
      .pipe(retry(1));
  }

  public saveAsApproverReturn(
    data: AdvanceRunningApproverMatrixSupervisorViewModel
  ): Observable<
    ServiceResponseDataModel<AdvanceRunningApproverMatrixSupervisorViewModel>
  > {
    return this.http.post<
      ServiceResponseDataModel<AdvanceRunningApproverMatrixSupervisorViewModel>
    >(this.baseurl + this.apiUrlType + "/saveAsApproverReturn", data);
  }

  public saveAsInternalControlApproved(
    data: AdvanceRunningApproverMatrixSupervisorViewModel
  ): Observable<
    ServiceResponseDataModel<AdvanceRunningApproverMatrixSupervisorViewModel>
  > {
    return this.http
      .post<
        ServiceResponseDataModel<AdvanceRunningApproverMatrixSupervisorViewModel>
      >(
        this.baseurl + this.apiUrlType + "/saveAsInternalControlGroupApproved",
        data
      )
      .pipe(retry(1));
  }

  public getSuperVisorList(model: AdvanceSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceViewModel[]>(
      this.baseurl + this.apiUrlType + `/getSupervisorAdvancedTaskListByStatus`,
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
      this.baseurl + this.apiUrlType + `/getApproverAdvancedTaskListByStatus`,
      params
    );
  }
  public getApproverList(model: AdvanceSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceViewModel[]>(
      this.baseurl + this.apiUrlType + `/getApproverAdvancedTaskListByStatus`,
      params
    );
  }

  public getReleiverApproverList(model: AdvanceSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceViewModel[]>(
      this.baseurl +
        this.apiUrlType +
        `/getReleiverApproverAdvancedTaskListByStatus`,
      params
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
