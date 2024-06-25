import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs/operators';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { BankAccountInitModel, BankAccountModel } from '../../models/mastersetup-model/bankaccount.model';


@Injectable({ providedIn: 'root' })

export class BankAccountService {

    baseurl = environment.baseUrl;
    apiUrlType = 'bankaccount';

    constructor(private http: HttpClient) { }

    public getInitData() {
        return this.http.get<BankAccountInitModel>(this.baseurl + this.apiUrlType + `/getInitData`);
    }

    public getAll() {
        return this.http.get<BankAccountModel[]>(this.baseurl + this.apiUrlType + `/getall`);
    }

    public getById(id: number,) {
        return this.http.get<BankAccountModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }

    public save(data: BankAccountModel): Observable<ServiceResponseDataModel<BankAccountModel>> {
        return this.http.post<ServiceResponseDataModel<BankAccountModel>>(this.baseurl + this.apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: BankAccountModel): Observable<ServiceResponseDataModel<BankAccountModel>> {
        return this.http.post<ServiceResponseDataModel<BankAccountModel>>(this.baseurl + this.apiUrlType + '/update', data).pipe(retry(1))
    }

    public getAllWithUserName() {
        return this.http.get<BankAccountModel[]>(this.baseurl + this.apiUrlType + `/getallwithusername`);
    }
}
