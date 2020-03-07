import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LatestPageComponent } from "./views/latest-page/latest-page.component";
import { ComparisonPageComponent } from "./views/comparison-page/comparison-page.component";
import { HistoricPageComponent } from "./views/historic-page/historic-page.component";
import { HomePageComponent } from "./views/home-page/home-page.component";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "latest", component: LatestPageComponent },
  { path: "comparison", component: ComparisonPageComponent },
  { path: "historic", component: HistoricPageComponent },
  { path: "historic/:secondary", component: HistoricPageComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
