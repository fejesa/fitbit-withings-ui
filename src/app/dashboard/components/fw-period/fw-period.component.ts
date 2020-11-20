import {Component, EventEmitter, Output} from '@angular/core';
import {getDefaultPeriod} from '../../../util/fw.utils';

@Component({
  selector: 'app-fw-period',
  templateUrl: './fw-period.component.html'
})
export class FWPeriodComponent {

  rangeValues: Date[];

  @Output()
  selectPeriod: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.rangeValues = getDefaultPeriod();
  }

  handlePeriodSelection(): void {
    this.selectPeriod.emit(this.rangeValues);
  }
}
