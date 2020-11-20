import * as moment from 'moment';

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

export function getDifferenceInMins(v1: number, v2: number): number {
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

export function isSameDay(value1: string, value2: number): boolean {
  const timeAsString = getDateAsString(toDate(value2));
  return moment(value1).isSame(timeAsString, 'day');
}
