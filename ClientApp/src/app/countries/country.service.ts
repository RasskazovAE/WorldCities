import { Injectable, Inject } from "@angular/core";
import { BaseService } from "../base.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { Country } from "./country";

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseService<Country> {
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
    let url = this.baseUrl + 'api/Countries';
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

  get(id: number): Observable<Country> {
    let url = this.baseUrl + "api/Countries/" + id;
    return this.http.get<Country>(url);
  }

  put(country: Country): Observable<Country> {
    let url = this.baseUrl + "api/Countries/" + country.id;
    return this.http.put<Country>(url, country);
  }

  post(country: Country): Observable<Country> {
    let url = this.baseUrl + "api/Countries/" + country.id;
    return this.http.post<Country>(url, country);
  }

  isDupeField(countryId: number, fieldName: string, fieldValue: string): Observable<boolean> {
    let params = new HttpParams()
      .set("countryId", countryId.toString())
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);
    let url = this.baseUrl + "api/countries/isDupeField";
    return this.http.post<boolean>(url, null, { params });
  }
}
