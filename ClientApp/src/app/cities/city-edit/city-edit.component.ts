import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { City } from '../city';
import { Country } from 'src/app/countries/country';
import { ApiResult } from 'src/app/Model/apiResult';

import { BaseFormComponent } from 'src/app/base.form.component';
import { CityService } from '../city.service';
import { CountryService } from 'src/app/countries/country.service';

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

  //Activity Log (for debugging purpose)
  activityLog: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cityService: CityService,
    private countryService: CountryService) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      lat: new FormControl('', [Validators.required, Validators.pattern('^[-]?[0-9]+(\.[0-9]{1,4})?$')]),
      lon: new FormControl('', [Validators.required, Validators.pattern('^[-]?[0-9]+(\.[0-9]{1,4})?$')]),
      countryId: new FormControl('', Validators.required)
    }, null, this.isDupeCity());

    // react to form changes
    this.form.valueChanges
      .subscribe(result => {
        if (!this.form.dirty) {
          this.log("Form Model has been loaded.");
        }
        else {
          this.log("Form was updated by the user.");
        }
      })

    // react to changes in the form.name control
    this.getControl('name')!.valueChanges
      .subscribe(result => {
        if (!this.form.dirty) {
          this.log("Name has been loaded with initial values.");
        }
        else {
          this.log("Name was updated by the user.");
        }
      })

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
      this.cityService.get(this.id)
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
    this.countryService.getData<ApiResult<Country>>(0, 9999, "name", null, null, null)
      .subscribe(result => {
        this.countries = result.data;
      }, error => console.error(error));
  }

  onSubmit() {
    let city = (this.id) ? this.city : <City>{};

    city.name = this.form.get("name").value;
    city.lat = +this.form.get("lat").value;
    city.lon = +this.form.get("lon").value;
    city.countryId = +this.form.get('countryId').value;

    if (this.id) {
      // EDIT MODE

      this.cityService.put(city)
        .subscribe(result => {
          console.log("City " + city.id + " has been updates.");

          //go back to cities view
          this.router.navigate(['/cities']);
        }, error => console.error(error));
    }
    else {
      // ADD NEW MODE

      this.cityService.post(city)
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

      return this.cityService.isDupeCity(city)
        .pipe(map(result => {
          return (result ? { isDupeCity: true } : null);
        }));
    }
  }

  log(message: string) {
    this.activityLog += "[" + new Date().toLocaleString() + "] " + message + "<br/>";
  }
}
