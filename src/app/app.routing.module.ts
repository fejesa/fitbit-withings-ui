import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FWDashboardComponent} from './dashboard/containers/fw-dashboard/fw-dashboard.component';
import {FwChartComponent} from './dashboard/components/fw-chart/fw-chart.component';

const routes: Routes = [
  {path: 'dashboard', component: FWDashboardComponent},
  {path: 'chart/:date', component: FwChartComponent},
  {path: '**', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
