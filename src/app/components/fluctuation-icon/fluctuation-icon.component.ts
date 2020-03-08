import { Component, OnInit, Input } from "@angular/core";
import { RateFluctuation } from "src/app/models/rate-fluctuation.enum";

@Component({
  selector: "app-fluctuation-icon",
  templateUrl: "./fluctuation-icon.component.html"
})
export class FluctuationIconComponent implements OnInit {
  @Input() fluctuation: RateFluctuation;

  get fluctuationIcon() {
    switch (this.fluctuation) {
      case RateFluctuation.DOWN:
        return "trending_down";
      case RateFluctuation.UP:
        return "trending_up";
      case RateFluctuation.SAME:
      default:
        return "trending_flat";
    }
  }
  get fluctuationColor() {
    switch (this.fluctuation) {
      case RateFluctuation.DOWN:
        return "#d32f2f";
      case RateFluctuation.UP:
        return "#4caf50";
      case RateFluctuation.SAME:
      default:
        return "#333";
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
