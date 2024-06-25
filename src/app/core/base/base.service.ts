import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class BaseService {
	baseurl = environment.baseUrl;
	apiCommonUrl = 'common';
	apiReportUrl = "report";
	constructor(private http: HttpClient) { }

	downloadFile(fileId: number): Observable<any> {
		const url = `${this.baseurl}${this.apiCommonUrl}/downloadFile/${fileId}`;
		return this.http.get(url, { responseType: 'blob' as 'json' })
			.pipe(
				catchError(err => {
					return null;
				}));
	}
	downloadAdvanceSettlementFile(fileId: number): Observable<any> {
		const url = `${this.baseurl}${this.apiCommonUrl}/downloadAdvanceSettlementFile/${fileId}`;
		return this.http.get(url, { responseType: 'blob' as 'json' })
			.pipe(
				catchError(err => {
					return null;
				}));
	}
	downloadTASettlementFile(fileId: number): Observable<any> {
		const url = `${this.baseurl}${this.apiCommonUrl}/downloadTASettlementFile/${fileId}`;
		return this.http.get(url, { responseType: 'blob' as 'json' })
			.pipe(
				catchError(err => {
					return null;
				}));
	}
	downloadUserManual(): Observable<any> {
		const url = `${this.baseurl}${this.apiCommonUrl}/downloadUserManual`;
		return this.http.get(url, { responseType: 'blob' as 'json' })
			.pipe(
				catchError(err => {
					return null;
				}));
	}
	public deleteAttachement(id: number) {
		return this.http.delete(this.baseurl + this.apiCommonUrl + `/deleteAttachement/${id}`);
	}

	downloadPDFFile(id: string, sourcetype: string): Observable<any> {
		const source = this.getPdfSourceType(sourcetype);
		const url = `${this.baseurl}${this.apiReportUrl}/${source}/${id}`;
		return this.http.get(url, { responseType: 'blob' as 'json' })
			.pipe(
				catchError(err => {
					return null;
				}));
	}

	downloadExcelFile(id: string, sourcetype: string): Observable<any> {
		const source = this.getExcelSourceType(sourcetype);
		const url = `${this.baseurl}${this.apiReportUrl}/${source}/${id}`;
		return this.http.get(url, { responseType: 'blob' as 'json' })
			.pipe(
				catchError(err => {
					return null;
				}));
	}
	public getPdfSourceType(resourceType) {
		let sourceType = "";

		switch (resourceType) {
			case 'Advance':
				sourceType = "generate_AR_PDF";
				return sourceType;
			case 'Advance_Settlement':
				sourceType = "generate_AR_Settlement_PDF";
				return sourceType;
			case 'TravelAuthorization':
				sourceType = "generate_TA_PDF";
				return sourceType;
			case 'TA_Settlement':
				sourceType = "generate_TA_Settlement_PDF";
				return sourceType;
			default:
				return sourceType;
		}
	}
	public getExcelSourceType(resourceType: string) {
		let sourceType = "";
		switch (resourceType) {
			case 'Advance':
				sourceType ="genarate_AR_Excel";
				return sourceType;
			case 'Advance_Settlement':
				sourceType ="generate_AR_Settlement_Excel";
				return sourceType;
			case 'TravelAuthorization':
				sourceType ="generate_TA_Excel";
				return sourceType;
			case 'TA_Settlement':
				sourceType ="generate_TA_Settlement_Excel";
				return sourceType;
			default:
				return sourceType;
		}
	}
}
