import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Country } from './country';
import { ApiResult } from '../Model/apiResult';
import { City } from '../cities/city';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3'];
  public countries: MatTableDataSource<Country>;

  private defaultPageIndex: number = 0;
  private defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: string = "asc";
  public defaultFilterColumn: string = "name";
  private filterQuery: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) { }

    ngOnInit(): void {
      this.loadData();
    }

    loadData(query: string = null) {
      var pageEvent = new PageEvent();
      pageEvent.pageIndex = this.defaultPageIndex;
      pageEvent.pageSize = this.defaultPageSize;
      if (query)
        this.filterQuery = query;
      this.getData(pageEvent);
    }

    getData(event: PageEvent) {
      var url = this.baseUrl + 'api/Countries';
      var params = new HttpParams()
        .set("pageIndex", event.pageIndex.toString())
        .set("pageSize", event.pageSize.toString())
        .set("sortColumn", (this.sort)
          ? this.sort.active
          : this.defaultSortColumn)
        .set("sortOrder", (this.sort)
          ? this.sort.direction
          : this.defaultSortOrder);

      if (this.filterQuery) {
        params = params
          .set("filterColumn", this.defaultFilterColumn)
          .set("filterQuery", this.filterQuery);
      }

      this.http.get<ApiResult<Country>>(url, { params })
        .subscribe(result => {
          this.paginator.length = result.totalCount;
          this.paginator.pageIndex = result.pageIndex;
          this.paginator.pageSize = result.pageSize;
          this.countries = new MatTableDataSource<Country>(result.data);
        }, error => console.error(error));
    }

}
