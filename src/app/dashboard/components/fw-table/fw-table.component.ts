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

  private toHeartZones(activitiesHeart: FitbitActivitiesHeart, bloodPressures: WithingsBloodPressure[]): FitbitHeartZones {
    const date = activitiesHeart.dateTime;
    const restingHeartRate = activitiesHeart.value.restingHeartRate;
    const heartRateZones = activitiesHeart.value.heartRateZones;
    const calories = heartRateZones.reduce((a, b) => a + b.caloriesOut, 0);

    return new FitbitHeartZones(date,
      restingHeartRate,
      this.zoneMins(HeartZone.FatBurn, heartRateZones),
      this.zoneMins(HeartZone.Cardio, heartRateZones),
      this.zoneMins(HeartZone.Peak, heartRateZones),
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
