import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {
  BloodPressureSeverity,
  FitbitActivitiesHeart,
  FitbitHeartRateZone,
  FitbitHeartZones,
  HeartZone,
  WithingsBloodPressure
} from '../../../model/data/fw.model';
import {isSameDay} from '../../../util/date.util';
import {
  isGradeHypertensionDiastolic,
  isGradeHypertensionSystolic,
  isHighNormalDiastolic,
  isHighNormalSystolic
} from '../../../util/fw.utils';

@Component({
  selector: 'app-fw-table',
  styleUrls: ['./fw-table.component.css'],
  templateUrl: './fw-table.component.html'
})
export class FwTableComponent {

  @Input()
  data: [WithingsBloodPressure[], FitbitActivitiesHeart[]];

  constructor(private router: Router) {}

  isEmpty(): boolean {
    return !this.data || this.data[1].length === 0;
  }

  getHeartZones(): FitbitHeartZones[] {
    console.log('getHeartZones');
    return this.data[1].map(a => this.toHeartZones(a, this.data[0]));
  }

  getFatBurnCellClass(value: number): string {
    return value > 0 ? 'badge badge-pill result-label result-fatburn' : 'badge result-label';
  }

  getPeakCellClass(value: number): string {
    return value > 0 ? 'badge badge-pill result-label result-peak' : 'badge result-label';
  }

  getCardioCellClass(value: number): string {
    return value > 0 ? 'badge badge-pill result-label result-cardio' : 'badge result-label';
  }

  private toHeartZones(activitiesHeart: FitbitActivitiesHeart, bloodPressures: WithingsBloodPressure[]): FitbitHeartZones {
    const date = activitiesHeart.dateTime;
    const restingHeartRate = activitiesHeart.value.restingHeartRate;
    const heartRateZones = activitiesHeart.value.heartRateZones;
    const caloriesSum = heartRateZones.reduce((a, b) => a + b.caloriesOut, 0);
    const calories = Math.round(caloriesSum);
    const fatBurnMins = this.zoneMins(HeartZone.FatBurn, heartRateZones);
    const cardioMins = this.zoneMins(HeartZone.Cardio, heartRateZones);
    const peakMins = this.zoneMins(HeartZone.Peak, heartRateZones);
    const activeZoneMins = fatBurnMins + 2 * cardioMins + 2 * peakMins;

    return new FitbitHeartZones(date,
      restingHeartRate,
      fatBurnMins,
      cardioMins,
      peakMins,
      activeZoneMins,
      calories,
      this.bpmSeverity(date, bloodPressures));
  }

  private zoneMins(zone: string, heartRateZones: FitbitHeartRateZone[]): number {
    return heartRateZones.find(hrz => hrz.name === zone).minutes;
  }

  private bpmSeverity(date: string, bloodPressures: WithingsBloodPressure[]): string {
    const measuredOnDate = bloodPressures
      .filter(bp => isSameDay(date, bp.timestamp))
      .filter(bp => bp.systole > 0 && bp.diastole > 0);
    if (measuredOnDate.length === 0) {
      return;
    }
    if (this.hasDanger(measuredOnDate)) {
      return BloodPressureSeverity.Danger;
    }
    if (this.hasHighNormal(measuredOnDate)) {
      return BloodPressureSeverity.Warning;
    }
    return BloodPressureSeverity.Success;
  }

  private hasHighNormal(bloodPressures: WithingsBloodPressure[]): boolean {
    return bloodPressures
      .find(bp => isHighNormalSystolic(bp.systole) || isHighNormalDiastolic(bp.diastole)) != null;
  }

  private hasDanger(bloodPressures: WithingsBloodPressure[]): boolean {
    return bloodPressures
      .find(bp => isGradeHypertensionSystolic(bp.systole) || isGradeHypertensionDiastolic(bp.diastole)) != null;
  }
}
