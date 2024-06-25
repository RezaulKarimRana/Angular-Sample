import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { User } from '../models/auth.models';
import { environment } from '../../../environments/environment';
import { CodeNamePair } from '../models/mastersetup-model/codenamepair.model';
import { PasswordChangeModel, PasswordResetModel } from '../models/password.model';
import { ServiceResponseDataModel } from '../query-model/query-results.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
    baseurl = environment.baseUrl;
    apiUrlType = 'Account';
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public loginByAdmin(email: string, password: string, apiUrl : string) {
        return this.http.post<any>(this.baseurl + `Account/`+ apiUrl, { email, password })
            .pipe(map(user => {
                if (user && user.Token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('currentLoginUser', JSON.stringify(user.User));
                    localStorage.setItem('currentUserAdvanceApproverList', JSON.stringify(user.ApproverList));
                    localStorage.setItem('ProfilePicUrl', JSON.stringify(user.ProfilePicUrl))
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }
    public login(email: string, password: string, employeeTypeId :number,apiUrl : string) {
        return this.http.post<any>(this.baseurl + `Account/`+ apiUrl, { email, password, employeeTypeId })
            .pipe(map(user => {
                if (user && user.Token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('currentLoginUser', JSON.stringify(user.User));
                    localStorage.setItem('currentUserAdvanceApproverList', JSON.stringify(user.ApproverList));
                    localStorage.setItem('ProfilePicUrl', JSON.stringify(user.ProfilePicUrl))
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }
    public logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentLoginUser');
        localStorage.removeItem('currentUserAdvanceApproverList');
        this.currentUserSubject.next(null);
    }

    public IsLoggedIn() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.Token) {
            return true;
        }
        return false;
    }

    public getInitData() {
        return this.http.get<CodeNamePair[]>(this.baseurl + this.apiUrlType + `/getInitData`);
    }
    public resetPassword(model: PasswordResetModel): Observable<ServiceResponseDataModel<PasswordResetModel>> {
        return this.http.post<ServiceResponseDataModel<PasswordResetModel>>(this.baseurl + this.apiUrlType + '/resetpassword', model);
    }
    public changePassword(model: PasswordChangeModel): Observable<ServiceResponseDataModel<PasswordChangeModel>> {
        return this.http.post<ServiceResponseDataModel<PasswordChangeModel>>(this.baseurl + this.apiUrlType + '/changePassword', model);
    }
}
