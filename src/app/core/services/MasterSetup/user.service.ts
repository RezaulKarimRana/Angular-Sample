import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { IdTextNameModel } from '../../models/mastersetup-model/codenamepair.model';
import { environment } from 'src/environments/environment';
import { User } from '../../models/auth.models';
import { ServiceResponseDataModel } from '../../query-model/query-results.model';
import { UserAllInfoModel, UserModel } from '../../models/mastersetup-model/user.model';
@Injectable({ providedIn: 'root' })
export class UserProfileService {

    baseurl = environment.baseUrl;
    apiUrlType = 'user';
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`/api/login`);
    }

    register(user: User) {
        return this.http.post(`/users/register`, user);
    }
    
    public getUserInitData() {
        return this.http.get<UserModel>(this.baseurl + this.apiUrlType + `/getUserInitData`);
    }
    public getAllUser(start,end) {
        return this.http.get<UserModel[]>(this.baseurl + this.apiUrlType + `/getall/${start}/${end}`);
    }
    public getUserByDepartment(departmentId :number) {
        return this.http.get<UserModel[]>(this.baseurl + this.apiUrlType + `/getUserByDepartment?departmentId=${departmentId}`);
    }
    public getById(id: number,) {
        return this.http.get<UserModel>(this.baseurl + this.apiUrlType + `/getbyId/${id}`);
    }
    public getUserSupervisorsByUserId(id: number) {
        return this.http.get<UserModel>(this.baseurl + this.apiUrlType + `/getusersupervisorsbyuserid/${id}`);
    }
    public getUserAllInfoByUserId(id: number) {
        return this.http.get<UserAllInfoModel>(this.baseurl + this.apiUrlType + `/getuserallinfobyuserid/${id}`);
    }
    public updateUserProfilePic(data: FormData) {
        return this.http.post<ServiceResponseDataModel<UserAllInfoModel>>(this.baseurl + this.apiUrlType+`/updateuserprofilepic`, data);
    }
    public getUserAllInfoByDepartmentId(id: number) {
        return this.http.get<UserAllInfoModel[]>(this.baseurl + this.apiUrlType + `/getUserAllInfoByDepartmentId/${id}`);
    }
}
