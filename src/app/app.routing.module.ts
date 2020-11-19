import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FwDashboardComponent} from './dashboard/containers/fw-dashboard/fw-dashboard.component';

const routes: Routes = [
  {path: 'dashboard', component: FwDashboardComponent},
  {path: '**', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
