import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialDesignModule } from "./material-design/material-design.module";
import { MainNavigationComponent } from "./main-navigation/main-navigation.component";
import { HistoricPageComponent } from "./views/historic-page/historic-page.component";
import { LatestPageComponent } from "./views/latest-page/latest-page.component";
import { ComparisonPageComponent } from "./views/comparison-page/comparison-page.component";

@NgModule({
  declarations: [
    AppComponent,
    MainNavigationComponent,
    HistoricPageComponent,
    LatestPageComponent,
    ComparisonPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MaterialDesignModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
