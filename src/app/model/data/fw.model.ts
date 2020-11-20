export class WithingsBloodPressure {
  constructor(public diastole: number,
              public systole: number,
              public heartRate: number,
              public timestamp: number) {}
}

export class FitbitUser {
  constructor(public displayName: string,
              public age: number,
              public height: number,
              public weight: number) {
  }
}

export class FitbitDevice {
  constructor(public deviceVersion: string,
              public type: string) {
  }
}

export class FitbitHeartRateZone {
  constructor(public caloriesOut: number,
              public max: number,
              public min: number,
              public minutes: number,
              public name: string) {
  }
}

export class FitbitActivitiesHeartRate {
  constructor(public heartRateZones: FitbitHeartRateZone[],
              public restingHeartRate: number) {
  }
}

export class FitbitActivitiesHeart {
  constructor(public dateTime: string,
              public value: FitbitActivitiesHeartRate) {
  }
}

export class FitbitUserActivities {
  constructor(public user: FitbitUser,
              public activitiesHeartList: FitbitActivitiesHeart[],
              public device: FitbitDevice) {
  }
}

export class FitbitHeartZones {
  constructor(public date: string,
              public restingHeartRate: number,
              public zoneFirstMinutes: number,
              public zoneSecondMinutes: number,
              public zoneThirdMinutes: number,
              public calories: number,
              public bloodPressureSeverity: string) {
  }
}

export enum HeartZone {
  OutOfRange= 'Out of Range',
  FatBurn = 'Fat Burn',
  Cardio = 'Cardio',
  Peak = 'Peak'
}

export enum BloodPressureSeverity {
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
  NA = 'na'
}
