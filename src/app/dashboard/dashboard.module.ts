import {NgModule} from '@angular/core';
import {FWDashboardComponent} from './containers/fw-dashboard/fw-dashboard.component';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {FWPeriodComponent} from './components/fw-period/fw-period.component';
import {FwTableComponent} from './components/fw-table/fw-table.component';
import {FWModelModule} from '../model/fw.model.module';
import {FWUserComponent} from './components/fw-user/fw.user.component';
import {FwChartComponent} from './components/fw-chart/fw-chart.component';

@NgModule({
  declarations: [
    FWDashboardComponent,
    FWPeriodComponent,
    FWUserComponent,
    FwChartComponent,
    FwTableComponent
  ],
  imports: [
    FWModelModule,
    CommonModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule, RouterModule],
  exports: [FWDashboardComponent]
})
export class FWDashboardModule {

}
