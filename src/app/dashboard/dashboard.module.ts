import {NgModule} from '@angular/core';
import {FwDashboardComponent} from './containers/fw-dashboard/fw-dashboard.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {FwPeriodComponent} from './components/fw-period/fw-period.component';
import {FwTableComponent} from './components/fw-table/fw-table.component';

@NgModule({
  declarations: [
    FwDashboardComponent,
    FwPeriodComponent,
    FwTableComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule, RouterModule],
  exports: [FwDashboardComponent]
})
export class FWDashboardModule {

}
