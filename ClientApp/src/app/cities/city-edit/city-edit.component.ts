import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

import { City } from '../city';
import { Country } from 'src/app/countries/country';
import { ApiResult } from 'src/app/Model/apiResult';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent implements OnInit {
  //the view title
  public title: string;
  //the form model
  public form: FormGroup;
  //the city object to edit or create
  public city: City;
  //the city object id, as fetched from the active route:
  // It's NULL when we're adding a new city,
  // and not nNULL when we're editing an existing one.
  public id?: number;
  //the countries array for the select
  countries: Country[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', Validators.required),
      lon: new FormControl('', Validators.required),
      countryId: new FormControl('', Validators.required)
    });
    this.loadData();
  }

  loadData() {
    //load countries
    this.loadCountries();

    //retrieve the ID from the 'id' parameter
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    if (this.id) {
      // EDIT MODE

      //fetch the city from the server
      var url = this.baseUrl + "api/cities/" + this.id;
      this.http.get<City>(url)
        .subscribe(result => {
          this.city = result;
          this.title = "Edit - " + this.city.name;

          //update the form with the city value
          this.form.patchValue(this.city);
        }, error => console.error(error));
    }
    else {
      // ADD NEW MODE

      this.title = "Create a new City";
    }
  }

  loadCountries() {
    var url = this.baseUrl + "api/countries";
    var params = new HttpParams()
      .set("pageSize", "9999")
      .set("sortColumn", "name");

    this.http.get<ApiResult<Country>>(url, { params })
      .subscribe(result => {
        this.countries = result.data;
      }, error => console.error(error));
  }

  onSubmit() {
    var city = (this.id) ? this.city : <City>{};

    city.name = this.form.get("name").value;
    city.lat = +this.form.get("lat").value;
    city.lon = +this.form.get("lon").value;
    city.countryId = +this.form.get('countryId').valid;

    if (this.id) {
      // EDIT MODE

      var url = this.baseUrl + "api/cities/" + this.city.id;
      this.http.put<City>(url, city)
        .subscribe(result => {
          console.log("City " + city.id + " has been updates.");

          //go back to cities view
          this.router.navigate(['/cities']);
        }, error => console.error(error));
    }
    else {
      // ADD NEW MODE

      var url = this.baseUrl + "api/cities/";
      this.http.post<City>(url, city)
        .subscribe(result => {
          console.log("City " + city.id + " has been created.");

          //go back to cities view
          this.router.navigate(['/cities']);
        }, error => console.error(error));
    }


  }

}
