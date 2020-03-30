import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { City } from '../city';
import { Country } from 'src/app/countries/country';
import { ApiResult } from 'src/app/Model/apiResult';

import { BaseFormComponent } from 'src/app/base.form.component';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent extends BaseFormComponent implements OnInit {
  //the view title
  title: string;
  //the city object to edit or create
  city: City;
  //the city object id, as fetched from the active route:
  // It's NULL when we're adding a new city,
  // and not nNULL when we're editing an existing one.
  id?: number;
  //the countries array for the select
  countries: Country[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lat: new FormControl('', [Validators.required, Validators.pattern('^[-]?[0-9]+(\.[0-9]{1,4})?$')]),
      lon: new FormControl('', [Validators.required, Validators.pattern('^[-]?[0-9]+(\.[0-9]{1,4})?$')]),
      countryId: new FormControl('', Validators.required)
    }, null, this.isDupeCity());
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
      let url = this.baseUrl + "api/cities/" + this.id;
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
    let url = this.baseUrl + "api/countries";
    let params = new HttpParams()
      .set("pageSize", "9999")
      .set("sortColumn", "name");

    this.http.get<ApiResult<Country>>(url, { params })
      .subscribe(result => {
        this.countries = result.data;
      }, error => console.error(error));
  }

  onSubmit() {
    let city = (this.id) ? this.city : <City>{};

    city.name = this.form.get("name").value;
    city.lat = +this.form.get("lat").value;
    city.lon = +this.form.get("lon").value;
    city.countryId = +this.form.get('countryId').valid;

    if (this.id) {
      // EDIT MODE

      let url = this.baseUrl + "api/cities/" + this.city.id;
      this.http.put<City>(url, city)
        .subscribe(result => {
          console.log("City " + city.id + " has been updates.");

          //go back to cities view
          this.router.navigate(['/cities']);
        }, error => console.error(error));
    }
    else {
      // ADD NEW MODE

      let url = this.baseUrl + "api/cities/";
      this.http.post<City>(url, city)
        .subscribe(result => {
          console.log("City " + city.id + " has been created.");

          //go back to cities view
          this.router.navigate(['/cities']);
        }, error => console.error(error));
    }
  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      let city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.get('name').value;
      city.lat = +this.form.get('lat').value;
      city.lon = +this.form.get('lon').value;
      city.countryId = +this.form.get('countryId').value;

      let url = this.baseUrl + "api/cities/isDupeCity";
      return this.http.post<boolean>(url, city).pipe(map(result => {
        return (result ? { isDupeCity: true } : null);
      }))
    }
  }
}
