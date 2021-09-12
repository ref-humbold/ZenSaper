import { Injectable } from "@angular/core";
import { Subscription, interval } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TickerService {
  public create(callback: () => void): Subscription {
    return interval(1000).subscribe(callback);
  }
}
