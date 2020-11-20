import {Component, DoCheck} from '@angular/core';
import {WithingsRestDatasource} from '../../../model/datasource/withings.rest.datasource';
import {FitbitRestDatasource} from '../../../model/datasource/fitbit.rest.datasource';
import {forkJoin} from 'rxjs';
import {FitbitActivitiesHeart, FitbitUser, FitbitUserActivities, WithingsBloodPressure} from '../../../model/data/fw.model';
import {getDefaultPeriod} from '../../../util/date.util';

@Component({
    selector: 'app-fw-dashboard',
    templateUrl: './fw-dashboard.component.html',
    styleUrls: ['./fw-dashboard.component.css']
  }
)
export class FWDashboardComponent implements DoCheck {

  private period: Date[];

  private user: FitbitUser;

  private data: [WithingsBloodPressure[], FitbitActivitiesHeart[]];

  private state = {
    period: getDefaultPeriod()
  };

  constructor(private withingsDataSource: WithingsRestDatasource,
              private fitbitDataSource: FitbitRestDatasource) {
    this.period = getDefaultPeriod();
  }

  handlePeriod(event: Date[]): void {
    this.period = event;
  }

  getUser(): FitbitUser {
    return this.user;
  }

  getData(): [WithingsBloodPressure[], FitbitActivitiesHeart[]] {
    return this.data;
  }

  ngDoCheck(): void {
    if (this.isChanged()) {
      this.updateState();

      forkJoin([this.withingsDataSource
        .getBloodPressures(this.period), this.fitbitDataSource
        .getUserActivities(this.period)])
        .subscribe(results => {
          this.data = [results[0], results[1].activitiesHeartList];
          this.user = results[1].user;
        });
    }
  }

  private isChanged(): boolean {
    return (!this.state.period || this.state.period !== this.period);
  }

  private updateState(): void {
    this.state.period = this.period;
  }
}
