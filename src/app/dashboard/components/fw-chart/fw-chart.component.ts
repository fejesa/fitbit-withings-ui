import {Component, OnDestroy, OnInit} from '@angular/core';
import {WithingsRestDatasource} from '../../../model/datasource/withings.rest.datasource';
import {FitbitRestDatasource} from '../../../model/datasource/fitbit.rest.datasource';
import {ActivatedRoute} from '@angular/router';
import {forkJoin} from 'rxjs';
import * as moment from 'moment';

import {
  Axis,
  AxisTickStrategies,
  ChartXY,
  Color,
  ColorHEX,
  ColorRGBA,
  emptyLine,
  IndividualPointFill,
  lightningChart,
  Point,
  PointShape,
  SolidFill,
  SolidLine,
  Themes
} from '@arction/lcjs';
import {FitbitHeartRateZone, FitbitUserIntradayActivities, HeartZone, WithingsBloodPressure} from '../../../model/data/fw.model';
import {getDateTime, toDate} from '../../../util/date.util';
import {
  isGradeHypertensionDiastolic,
  isGradeHypertensionSystolic,
  isHighNormalDiastolic,
  isHighNormalSystolic,
  isNormalDiastolic,
  isNormalSystolic,
  isOptimalDiastolic,
  isOptimalSystolic
} from '../../../util/fw.utils';

@Component({
  templateUrl: './fw-chart.component.html'
})
export class FwChartComponent implements OnDestroy, OnInit {

  chart: ChartXY;

  private normalColor = ColorRGBA(40, 167, 69);
  private highNormalColor = ColorRGBA(230, 172, 0);
  private hypertensionColor = ColorRGBA(220, 53, 69);

  constructor(private withingsDataSource: WithingsRestDatasource,
              private fitbitDataSource: FitbitRestDatasource,
              private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.chart.dispose();
  }

  ngOnInit(): void {

    const d = this.route.snapshot.paramMap.get('date');
    const date = new Date(d);

    this.chart = lightningChart().ChartXY({
      theme: Themes.light
    }).setTitle(`Fitbit Heart Rate & Withings Blood Pressure : ${d}`);

    const axisX = this.chart
      .getDefaultAxisX()
      .setTickStrategy(AxisTickStrategies.DateTime, (tickStrategy) => tickStrategy.setDateOrigin(date));

    const individualStyle = new IndividualPointFill();
    individualStyle.setFallbackColor(this.normalColor);

    const bpmParser = (builder, series, Xvalue, Yvalue) => {
      return builder
        .addRow(series.getName() + ' (mm Hg): ' + Math.floor(Yvalue));
    };

    const heartRateParser = (builder, series, Xvalue, Yvalue) => {
      return builder
        .addRow(series.getName() + ' HR: ' + Math.floor(Yvalue));
    };

    const hrAxisY = this.chart.getDefaultAxisY()
      .setTitle('Heart Rate')
      .setScrollStrategy(undefined)
      .setInterval(0, 220, true, true)
      .setTickStrategy(AxisTickStrategies.Numeric, tickStrategy => tickStrategy
        .setMajorTickStyle(tickStyle => tickStyle.setGridStrokeStyle(emptyLine)));

    const bpmAxisY = this.chart.addAxisY(false)
      .setTitle('mmHg')
      .setInterval(0, 200, true, true)
      .setTickStrategy(AxisTickStrategies.Numeric, tickStrategy => tickStrategy
        .setMajorTickStyle(tickStyle => tickStyle.setGridStrokeStyle(emptyLine)));

    const systoleSeries = this.chart.addPointSeries(
      { xAxis: axisX,
               yAxis: bpmAxisY,
               pointShape: PointShape.Circle
             })
      .setName('Sys')
      .setPointFillStyle(individualStyle)
      .setPointSize(10).setResultTableFormatter(bpmParser);

    const diastoleSeries = this.chart.addPointSeries(
      {
               xAxis: axisX,
               yAxis: bpmAxisY,
               pointShape: PointShape.Triangle
             })
      .setName('Dia')
      .setPointFillStyle(individualStyle)
      .setPointSize(10).setResultTableFormatter(bpmParser);

    const heartRateSeries = this.chart.addSplineSeries(
      {
               xAxis: axisX,
               yAxis: hrAxisY
             }
      ).setName('Fitbit')
      .setStrokeStyle(new SolidLine({
        thickness: 1,
        fillStyle: new SolidFill({ color: ColorHEX('#DC3545') })
      }))
      .setPointFillStyle(new SolidFill({ color: ColorHEX('#DC3545') }))
      .setPointSize(3)
      .setResultTableFormatter(heartRateParser);

    forkJoin([
      this.withingsDataSource.getBloodPressures([date, date]),
      this.fitbitDataSource.getUserIntradayActivities(date)])
      .subscribe(results => {

        const systolePoints = this.getSystolePoints(date, results[0]);
        const diastolePoints = this.getDiastolePoints(date, results[0]);
        const heartRatePoints = this.getHeartRatePoints(date, results[1]);

        const dataFrequency = 1000 * 60;
        this.chart.getDefaultAxisX()
          .setInterval(0, 60 * 24 * dataFrequency, true, true);

        systoleSeries.add(
          systolePoints.map((point) => (
            {
              x: point.x * dataFrequency,
              y: point.y,
              color: this.getSystoleColor(point.y)
            }
          )));

        diastoleSeries.add(
          diastolePoints.map((point) => (
            {
              x: point.x * dataFrequency,
              y: point.y,
              color: this.getDiastoleColor(point.y)
            }
          )));

        heartRateSeries.add(heartRatePoints
          .map((point) => (
            {
              x: point.x * dataFrequency,
              y: point.y
            })));

        this.chart.setAutoCursor(cursor => {
          (cursor)
            .setResultTableAutoTextStyle(true)
            .setTickMarkerXAutoTextStyle(true)
            .setTickMarkerYAutoTextStyle(true);
        });

        this.addHRBand(hrAxisY, this.getZoneBoundaries(results[1], HeartZone.FatBurn), '#ffe6b3');
        this.addHRBand(hrAxisY, this.getZoneBoundaries(results[1], HeartZone.Cardio), '#ffd9b3');
        this.addHRBand(hrAxisY, this.getZoneBoundaries(results[1], HeartZone.Peak), '#ffccd0');
      });
  }

  private addHRBand(hrAxisY: Axis, {min, max}, color: string): void {
    const diaBand = hrAxisY.addBand(false)
      .setValueStart(min)
      .setValueEnd(max)
      .setStrokeStyle(
        new SolidLine({
          thickness: 1,
          fillStyle: new SolidFill({ color: ColorHEX(color) })
        })
      )
      .setFillStyle(
        new SolidFill({ color: ColorHEX(color) })
      );
  }

  // tslint:disable-next-line:typedef
  private getZoneBoundaries(data: FitbitUserIntradayActivities, zone: HeartZone) {
    const heartZone = data.activities[0].value.heartRateZones.find(hz => hz.name === zone);
    return {
      min: heartZone.min,
      max: heartZone.max
    };
  }

  private getHeartRatePoints(baseDate: Date, data: FitbitUserIntradayActivities): Point[] {
    const heartRateZones = data.activities[0].value.heartRateZones;
    return data.dataset.dataset
      .map(hr => {
        return {
          x: this.diffHr(baseDate, hr.time),
          y: hr.value,
          color: this.getHeartRateColor(hr.value, heartRateZones)
        };
      });
  }

  private getHeartRateColor(value: number, heartRateZones: FitbitHeartRateZone[]): Color {
    const zone = heartRateZones
      .find(hz => hz.min <= value && hz.max >= value);
    return this.getHeartRateColorByZone(zone.name);
  }

  private getHeartRateColorByZone(name: string): Color {
    switch (name) {
      case 'Out of Range': return ColorHEX('#1FB4BF');
      case 'Fat Burn': return ColorHEX('#FDAC00');
      case 'Cardio': return ColorHEX('#FD6400');
      case 'Peak': return ColorHEX('#FD0000');
    }
  }

  private getSystolePoints(baseDate: Date, data: WithingsBloodPressure[]): Point[] {
    return data
      .filter(bp => bp.systole > 0)
      .map(bp => {
        return {
          x: this.diffBpm(baseDate, bp.timestamp),
          y: bp.systole
        };
      });
  }

  private getDiastolePoints(baseDate: Date, data: WithingsBloodPressure[]): Point[] {
    return data
      .filter(bp => bp.diastole > 0)
      .map(bp => {
        return {
          x: this.diffBpm(baseDate, bp.timestamp),
          y: bp.diastole
        };
      });
  }

  private diffHr(base: Date, time: string): number {
    const timestamp = getDateTime(base, time);
    return moment(timestamp).diff(base, 'minutes');
  }

  private diffBpm(base: Date, timestamp: number): number {
    return moment(toDate(timestamp)).diff(base, 'minutes');
  }

  private getSystoleColor(value: number): Color {
    if (isOptimalSystolic(value) || isNormalSystolic(value)) {
      return this.normalColor;
    }
    if (isHighNormalSystolic(value)) {
      return this.highNormalColor;
    }
    if (isGradeHypertensionSystolic(value)) {
      return this.hypertensionColor;
    }
  }

  private getDiastoleColor(value: number): Color {
    if (isOptimalDiastolic(value) || isNormalDiastolic(value)) {
      return this.normalColor;
    }
    if (isHighNormalDiastolic(value)) {
      return this.highNormalColor;
    }
    if (isGradeHypertensionDiastolic(value)) {
      return this.hypertensionColor;
    }
  }
}
