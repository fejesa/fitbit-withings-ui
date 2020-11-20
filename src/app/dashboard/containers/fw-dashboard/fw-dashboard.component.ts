import {Component, DoCheck} from '@angular/core';
import {WithingsRestDatasource} from '../../../model/datasource/withings.rest.datasource';
import {FitbitRestDatasource} from '../../../model/datasource/fitbit.rest.datasource';
import {getDefaultPeriod} from '../../../util/fw.utils';
import {forkJoin} from 'rxjs';
import {FitbitUser} from '../../../model/data/fw.model';

@Component({
    selector: 'app-fw-dashboard',
    templateUrl: './fw-dashboard.component.html',
    styleUrls: ['./fw-dashboard.component.css']
  }
)
export class FWDashboardComponent implements DoCheck {

  private period: Date[];

  private user: FitbitUser;

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

  ngDoCheck(): void {
    if (this.isChanged()) {
      this.updateState();

      forkJoin([this.withingsDataSource
        .getBloodPressures(this.period), this.fitbitDataSource
        .getUserActivities(this.period)])
        .subscribe(results => {
          console.log(JSON.stringify(results[0]));
          console.log(JSON.stringify(results[1]));

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
