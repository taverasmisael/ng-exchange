import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LatestPageComponent } from "./views/latest-page/latest-page.component";
import { ComparisonPageComponent } from "./views/comparison-page/comparison-page.component";
import { HistoricPageComponent } from "./views/historic-page/historic-page.component";

const routes: Routes = [
  { path: "", component: LatestPageComponent },
  { path: "comparison", component: ComparisonPageComponent },
  { path: "historic/:base", component: HistoricPageComponent },
  { path: "historic/:base/:symbol", component: HistoricPageComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
