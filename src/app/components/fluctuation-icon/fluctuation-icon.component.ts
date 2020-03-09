import { Component, Input } from "@angular/core";
import { RateFluctuation } from "src/app/models/rate-fluctuation.enum";

@Component({
  selector: "app-fluctuation-icon",
  templateUrl: "./fluctuation-icon.component.html"
})
export class FluctuationIconComponent {
  @Input() fluctuation: RateFluctuation;
  private readonly FLUCTUATION_ICONS: RateFluctuationMap = {
    [RateFluctuation.UP]: "trending_up",
    [RateFluctuation.SAME]: "trending_flat",
    [RateFluctuation.DOWN]: "trending_down"
  };

  private readonly FLUCTUATION_COLORS: RateFluctuationMap = {
    [RateFluctuation.UP]: "#4caf50",
    [RateFluctuation.SAME]: "#333",
    [RateFluctuation.DOWN]: "#d32f2f"
  };

  get fluctuationIcon() {
    return this.FLUCTUATION_ICONS[this.fluctuation || RateFluctuation.SAME];
  }
  get fluctuationColor() {
    return this.FLUCTUATION_COLORS[this.fluctuation || RateFluctuation.SAME];
  }

  constructor() {}
}

type RateFluctuationMap = {
  [key in RateFluctuation]: string;
};

type GetFromValueFromMap = (
  map: RateFluctuationMap,
  fluctuation?: RateFluctuation
) => string;
