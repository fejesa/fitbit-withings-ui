import {Component, OnDestroy, OnInit} from '@angular/core';
import {WithingsRestDatasource} from '../../../model/datasource/withings.rest.datasource';
import {FitbitRestDatasource} from '../../../model/datasource/fitbit.rest.datasource';
import {ActivatedRoute} from '@angular/router';
import {forkJoin} from 'rxjs';

@Component({
  templateUrl: './fw-chart.component.html'
})
export class FwChartComponent implements OnDestroy, OnInit {

  constructor(private withingsDataSource: WithingsRestDatasource,
              private fitbitDataSource: FitbitRestDatasource, private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    const d = this.route.snapshot.paramMap.get('date');
    const date = new Date(d);

    forkJoin([
      this.withingsDataSource.getBloodPressures([date, date]),
      this.fitbitDataSource.getUserIntradayActivities(date)])
      .subscribe(results => {
        console.log(results[0]);
        console.log(results[1]);
      });
  }
}
