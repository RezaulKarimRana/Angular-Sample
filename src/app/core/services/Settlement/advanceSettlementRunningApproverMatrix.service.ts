import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { retry } from "rxjs/operators";
import { ServiceResponseDataModel } from "../../query-model/query-results.model";
import { AdvanceDashboardInitModel } from "../../models/advance-model/advanceRunningApproverMatrix.model";
import { CodeNamePair } from "../../models/mastersetup-model/codenamepair.model";
import {
  AdvanceSettlementSearchModel,
  AdvanceSettlementViewModel,
} from "../../models/settlement-model/settlement.model";
import { AdvanceSettlementRunningApproverMatrixSupervisorViewModel } from "../../models/settlement-model/advanceSettlementRunningApproverMatrix.model";
import { RunningApproverMatrixViewModel } from "../../models/runningApproverMatrix.model";
import { SearchModel } from "../../models/search-model";
@Injectable({ providedIn: "root" })
export class AdvanceSettlementRunningApproverMatrixService {
  baseurl = environment.baseUrl;
  apiUrlType = "advanceSettlementApproverRunningMatrix";

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
    data: AdvanceSettlementRunningApproverMatrixSupervisorViewModel
  ): Observable<
    ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>
  > {
    return this.http
      .post<
        ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>
      >(this.baseurl + this.apiUrlType + "/saveAsApproved", data)
      .pipe(retry(1));
  }

  public saveAsApproverApproved(
    data: AdvanceSettlementRunningApproverMatrixSupervisorViewModel
  ): Observable<
    ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>
  > {
    return this.http
      .post<
        ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>
      >(this.baseurl + this.apiUrlType + "/saveAsApproverApproved", data)
      .pipe(retry(1));
  }

  public saveAsApproverReturn(
    data: AdvanceSettlementRunningApproverMatrixSupervisorViewModel
  ): Observable<
    ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>
  > {
    return this.http.post<
      ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>
    >(this.baseurl + this.apiUrlType + "/saveAsApproverReturn", data);
  }

  public saveAsInternalControlApproved(
    data: AdvanceSettlementRunningApproverMatrixSupervisorViewModel
  ): Observable<
    ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>
  > {
    return this.http
      .post<
        ServiceResponseDataModel<AdvanceSettlementRunningApproverMatrixSupervisorViewModel>
      >(
        this.baseurl + this.apiUrlType + "/saveAsInternalControlGroupApproved",
        data
      )
      .pipe(retry(1));
  }

  public getSuperVisorList(model: AdvanceSettlementSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceSettlementViewModel[]>(
      this.baseurl + this.apiUrlType + `/getSupervisorAdvancedTaskListByStatus`,
      params
    );
  }

  public getApproverList(model: AdvanceSettlementSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceSettlementViewModel[]>(
      this.baseurl + this.apiUrlType + `/getApproverAdvancedTaskListByStatus`,
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
      this.baseurl + this.apiUrlType + `/getApproverAdvancedTaskListByStatus`,
      params
    );
  }
  public getReleiverApproverList(model: AdvanceSettlementSearchModel) {
    var params = new HttpParams();
    if (model != undefined) {
      for (let key in model) {
        params = params.append(key, model[key]);
      }
    }
    return this.getSearch<AdvanceSettlementViewModel[]>(
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
