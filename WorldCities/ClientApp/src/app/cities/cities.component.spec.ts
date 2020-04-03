import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from '../angular-material.module';
import { of } from 'rxjs';

import { CitiesComponent } from './cities.component';
import { CityService } from './city.service';
import { ApiResult } from '../Model/apiResult';
import { City } from './city';

describe('CitiesComponent', () => {
  let component: CitiesComponent;
  let fixture: ComponentFixture<CitiesComponent>;

  // async beforeEach(): testBed initialization
  beforeEach(async(() => {

    // create a mock cityService object with a mock 'getData' method
    let cityService = jasmine.createSpyObj<CityService>('CityService', ['getData']);

    // configure the 'getData' spy method
    cityService.getData.and.returnValue(
      // return an Observable with some test data
      of<ApiResult<City>>(<ApiResult<City>>{
        data: [
          <City>{
            name: 'TestCity1',
            id: 1, lat: 1, lon: 1,
            countryId: 1, countryName: 'TestCountry1'
          },
          <City>{
            name: 'TestCity2',
            id: 2, lat: 1, lon: 1,
            countryId: 1, countryName: 'TestCountry1'
          },
          <City>{
            name: 'TestCity3',
            id: 3, lat: 1, lon: 1,
            countryId: 1, countryName: 'TestCountry1'
          }
        ],
        totalCount: 3,
        pageIndex: 0,
        pageSize: 10
      }));

    TestBed.configureTestingModule({
      declarations: [CitiesComponent],
      imports: [
        BrowserAnimationsModule,
        AngularMaterialModule
      ],
      providers: [
        {
          provide: CityService,
          useValue: cityService
        }
      ]
    })
      .compileComponents();
  }));

  // synchronous beforeEach(): fixture and components setup
  beforeEach(() => {
    fixture = TestBed.createComponent(CitiesComponent);
    component = fixture.componentInstance;

    component.paginator = jasmine.createSpyObj("MatPaginator", ["length", "pageIndex", "pageSize"]);
    fixture.detectChanges();
  });

  it('should display a "Cities" title',
    async(() => {
      let title = fixture.nativeElement.querySelector('h1');
      expect(title.textContent).toEqual('Cities');
    }));

  it('should contain a table with a list of one or more cities',
    async(() => {
      let table = fixture.nativeElement.querySelector('table.mat-table');
      let tableRows = table.querySelectorAll('tr.mat-row');
      expect(tableRows.length).toBeGreaterThan(0);
    }));
});
