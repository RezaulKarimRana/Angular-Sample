import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { CodeNamePair, UrlTypeModel } from '../../models/mastersetup-model/codenamepair.model';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { CodeNamePairApiEndPoints } from '../../enums/constants';


@Injectable({ providedIn: 'root' })

export class CodeNamePairService {
    baseurl = environment.baseUrl;
    urlTypeModel: UrlTypeModel = new UrlTypeModel();
    constructor(private http: HttpClient) { }

    public getAll(apiUrlType: string) {
        return this.http.get<CodeNamePair[]>(this.baseurl + apiUrlType + `/getall`);
    }

    public getById(id: string, apiUrlType: string) {
        return this.http.get<CodeNamePair>(this.baseurl + apiUrlType + `/getbyId/${id}`);
    }

    public save(data: CodeNamePair, apiUrlType: string): Observable<ServiceResponseDataModel<CodeNamePair>> {
        return this.http.post<ServiceResponseDataModel<CodeNamePair>>(this.baseurl + apiUrlType + '/Save', data).pipe(retry(1))
    }

    public update(data: CodeNamePair, apiUrlType: string): Observable<ServiceResponseDataModel<CodeNamePair>> {
        return this.http.post<ServiceResponseDataModel<CodeNamePair>>(this.baseurl + apiUrlType + '/update', data).pipe(retry(1))
    }

    public findCodeNamePairType(url : string) {
       
		if (url.includes('company')) {
            this.urlTypeModel.Codenamepair = 'Company';
            this.urlTypeModel.ApiUrlType = CodeNamePairApiEndPoints.company;
		} else if (url.includes('employeetype')) {
			this.urlTypeModel.Codenamepair = 'Employee type';
			this.urlTypeModel.ApiUrlType = CodeNamePairApiEndPoints.employeetype;
		} else if (url.includes('designation')) {
			this.urlTypeModel.Codenamepair = 'Designation';
			this.urlTypeModel.ApiUrlType = CodeNamePairApiEndPoints.designation;
		} else if (url.includes('department')) {
			this.urlTypeModel.Codenamepair = 'Department';
			this.urlTypeModel.ApiUrlType = CodeNamePairApiEndPoints.department;
		} else if (url.includes('officeLocation')) {
			this.urlTypeModel.Codenamepair = 'Office Location';
			this.urlTypeModel.ApiUrlType = CodeNamePairApiEndPoints.officeLocation;
		} else if (url.includes('taskType')) {
			this.urlTypeModel.Codenamepair = 'Task Type';
			this.urlTypeModel.ApiUrlType = CodeNamePairApiEndPoints.taskType;
		} else if (url.includes('taskTypeDetails')) {
			this.urlTypeModel.Codenamepair = 'Task Type Details';
			this.urlTypeModel.ApiUrlType = CodeNamePairApiEndPoints.taskTypeDetails;
		} else if (url.includes('thana')) {
			this.urlTypeModel.Codenamepair = 'Thana';
			this.urlTypeModel.ApiUrlType = CodeNamePairApiEndPoints.thana;
		}
        return  this.urlTypeModel;
	}
}
