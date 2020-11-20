import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {WithingsBloodPressure} from '../data/fw.model';
import {Observable, throwError} from 'rxjs';
import {getDateAsString} from '../../util/fw.utils';
import {catchError} from 'rxjs/operators';

export const WITHINGS_REST_URL = new InjectionToken('withings_rest_url');

@Injectable()
export class WithingsRestDatasource {

  constructor(private http: HttpClient,
              @Inject(WITHINGS_REST_URL) private url: string) { }

  getBloodPressures(period: Date[]): Observable<WithingsBloodPressure[]> {
    const start = getDateAsString(period[0]);
    const end = getDateAsString(period[1]);
    console.log(`Loading withings blood pressure records from ${start} - ${end}`);
    return this.http.request<WithingsBloodPressure[]>(
      'GET',
      this.url + `/bp?from=${start}&to=${end}`, {
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
