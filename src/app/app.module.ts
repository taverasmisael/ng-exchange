import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { ChartsModule } from "ng2-charts";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MaterialDesignModule } from "./material-design/material-design.module";
import { HistoricPageComponent } from "./views/historic-page/historic-page.component";
import { LatestPageComponent } from "./views/latest-page/latest-page.component";
import { ComparisonPageComponent } from "./views/comparison-page/comparison-page.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { FluctuationIconComponent } from "./components/fluctuation-icon/fluctuation-icon.component";
import { HomePageComponent } from './views/home-page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HistoricPageComponent,
    LatestPageComponent,
    ComparisonPageComponent,
    MainNavComponent,
    FluctuationIconComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MaterialDesignModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
