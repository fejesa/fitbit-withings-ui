import {Component, OnDestroy, OnInit} from '@angular/core';
import {WithingsRestDatasource} from '../../../model/datasource/withings.rest.datasource';
import {FitbitRestDatasource} from '../../../model/datasource/fitbit.rest.datasource';
import {ActivatedRoute} from '@angular/router';

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
    this.route.queryParams.subscribe(params => {
      console.log('Date: ' + params.date);
    });
  }

}
