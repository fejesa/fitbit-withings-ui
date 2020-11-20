import * as moment from 'moment';

// systolic
export function isOptimalSystolic(value: number): boolean {
  return value > 0 && value < 120;
}

export function isNormalSystolic(value: number): boolean {
  return value >= 120 && value < 130;
}

export function isHighNormalSystolic(value: number): boolean {
  return value >= 130 && value < 140;
}

export function isGrade1HypertensionSystolic(value: number): boolean {
  return value >= 140 && value < 160;
}

export function isGrade2HypertensionSystolic(value: number): boolean {
  return value >= 160 && value < 180;
}

export function isGrade3HypertensionSystolic(value: number): boolean {
  return value >= 180;
}

export function isGradeHypertensionSystolic(value: number): boolean {
  return isGrade1HypertensionSystolic(value) || isGrade2HypertensionSystolic(value) || isGrade3HypertensionSystolic(value);
}

// diastolic
export function isOptimalDiastolic(value: number): boolean {
  return value > 0 && value < 80;
}

export function isNormalDiastolic(value: number): boolean {
  return value >= 80 && value < 85;
}

export function isHighNormalDiastolic(value: number): boolean {
  return value >= 85 && value < 90;
}

export function isGrade1HypertensionDiastolic(value: number): boolean {
  return value >= 90 && value < 100;
}

export function isGrade2HypertensionDiastolic(value: number): boolean {
  return value >= 100 && value < 110;
}

export function isGrade3HypertensionDiastolic(value: number): boolean {
  return value >= 110;
}

export function isGradeHypertensionDiastolic(value: number): boolean {
  return isGrade1HypertensionDiastolic(value) || isGrade2HypertensionDiastolic(value) || isGrade3HypertensionDiastolic(value);
}

export function getDefaultPeriod(): Date[] {
  const periodStart = new Date();
  const periodEnd = new Date();
  periodStart.setDate(periodStart.getDate() - 7);
  return [periodStart, periodEnd];
}

export function getDateAsString(value: Date): string {
  return moment(value).format('YYYY-MM-DD');
}

export function getDateTimeAsString(value: number): string {
  return moment(toDate(value)).format('YY-MM-DD HH:mm');
}

export function toDate(value: number): Date {
  return new Date(value * 1000);
}

export function getDifferenceInHours(v1: number, v2: number): number {
  const a = moment(toDate(v1));
  const b = moment(toDate(v2));

  return a.diff(b, 'hours');
}

export function  getDifferenceInMins(v1: number, v2: number): number {
  const a = moment(toDate(v1));
  const b = moment(toDate(v2));

  return a.diff(b, 'minutes');
}

export function isMorningTime(value: number): boolean {
  const d = toDate(value);
  return d.getHours() <= 8 && d.getHours() > 6;
}

export function isMiddayTime(value: number): boolean {
  const d = toDate(value);
  return d.getHours() > 8 && d.getHours() <= 18;
}

export function isEveningTime(value: number): boolean {
  const d = toDate(value);
  return d.getHours() > 18 && d.getHours() <= 22;
}
