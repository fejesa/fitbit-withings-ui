import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FitbitUserActivities, WithingsBloodPressure} from '../data/fw.model';
import {Observable, throwError} from 'rxjs';
import {getDateAsString} from '../../util/fw.utils';
import {catchError} from 'rxjs/operators';

export const FITBIT_REST_URL = new InjectionToken('fitbit_rest_url');

@Injectable()
export class FitbitRestDatasource {

  constructor(private http: HttpClient,
              @Inject(FITBIT_REST_URL) private url: string) { }

  getUserActivities(period: Date[]): Observable<FitbitUserActivities> {
    const start = getDateAsString(period[0]);
    const end = getDateAsString(period[1]);
    console.log(`Loading fitbit user activities records from ${start} - ${end}`);
    return this.http.request<FitbitUserActivities>(
      'GET',
      this.url + `/activities?from=${start}&to=${end}`, {
        headers: this.createRequestHeaders()
      }
    ).pipe(catchError((error: Response) =>
      throwError(`Network Error: ${error.statusText} (${error.status})`)));
  }

  private createRequestHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Access-Control-Allow-Origin', '*');
    return headers;
  }
}
