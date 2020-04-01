import { Injectable, Inject } from "@angular/core";
import { BaseService } from "../base.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { City } from "./city";

@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseService<City> {
  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    super(http, baseUrl);
  }

  getData<ApiResult>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult> {
    let url = this.baseUrl + 'api/Cities';
    let params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }

    return this.http.get<ApiResult>(url, { params });
  }

  get(id: number): Observable<City> {
    let url = this.baseUrl + "api/Cities/" + id;
    return this.http.get<City>(url);
  }

  put(item: City): Observable<City> {
    let url = this.baseUrl + "api/Cities/" + item.id;
    return this.http.put<City>(url, item);
  }

  post(item: City): Observable<City> {
    let url = this.baseUrl + "api/Cities/" + item.id;
    return this.http.post<City>(url, item);
  }

  isDupeCity(city: City): Observable<boolean> {
    let url = this.baseUrl + "api/cities/isDupeCity";
    return this.http.post<boolean>(url, city);
  }
}
