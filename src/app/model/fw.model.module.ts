import {NgModule} from '@angular/core';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {WithingsRestDatasource, WITHINGS_REST_URL} from './datasource/withings.rest.datasource';
import {FITBIT_REST_URL, FitbitRestDatasource} from './datasource/fitbit.rest.datasource';

@NgModule({
  imports: [HttpClientModule, HttpClientJsonpModule],
  providers: [
    WithingsRestDatasource, { provide: WITHINGS_REST_URL, useValue: `http://localhost:8080` },
    FitbitRestDatasource, {provide: FITBIT_REST_URL, useValue: `http://localhost:8081`}
    ]
})
export class FWModelModule { }
