import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {FWDashboardModule} from './dashboard/dashboard.module';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, FWDashboardModule, CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
