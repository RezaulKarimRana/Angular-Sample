import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { MenuItem } from "src/app/layouts/sidebar/menu.model";
import { MenuItemSearchModel } from "src/app/layouts/horizontaltopbar/menu.model";
@Injectable({ providedIn: "root" })
export class MenuItemService {
  baseurl = environment.baseUrl;
  apiUrlType = "menuPermission";

  constructor(private http: HttpClient) {}

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

  // public GetAllMenu(model: MenuItemSearchModel) {
  //     var params = new HttpParams();
  // 	if (model != undefined) {
  // 		for (let key in model) {
  // 			params = params.append(key, model[key]);
  // 		}
  // 	}
  //     return this.getSearch<MenuItem[]>(this.baseurl + this.apiUrlType + `/getallmenu`,params);
  // }
  public GetAllMenu(model: MenuItemSearchModel) {
    return this.http.get<MenuItem[]>(
      this.baseurl + this.apiUrlType + `/getall`
    );
  }
}
