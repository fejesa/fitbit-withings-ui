import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-fw-table',
  templateUrl: './fw-table.component.html'
})
export class FwTableComponent {

  @Input()
  period: Date[];

  constructor(private router: Router) {}
}
