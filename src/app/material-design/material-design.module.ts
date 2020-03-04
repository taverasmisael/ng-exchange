import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatMenuModule } from "@angular/material/menu";

const MaterialModules = [
  MatToolbarModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatMenuModule
];

@NgModule({
  imports: MaterialModules,
  exports: MaterialModules
})
export class MaterialDesignModule {}
