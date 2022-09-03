import { Injectable } from "@angular/core";
import { Subscription, interval, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TickerService {
  private readonly seconds = new BehaviorSubject<number>(0);
  private subscription = Subscription.EMPTY;

  constructor() {}

  public subscribe(callback: (seconds: number) => void): Subscription {
    return this.seconds.subscribe(callback);
  }

  public create(): void {
    this.destroy();
    this.seconds.next(0);
    this.subscription = interval(1000).subscribe(() => this.seconds.next(this.seconds.value + 1));
  }

  public destroy(): void {
    this.subscription.unsubscribe();
  }
}
