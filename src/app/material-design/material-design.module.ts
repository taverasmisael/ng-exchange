import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

const MaterialModules = [
  MatToolbarModule,
  MatButtonModule,
  MatButtonToggleModule
];

@NgModule({
  imports: MaterialModules,
  exports: MaterialModules
})
export class MaterialDesignModule {}
