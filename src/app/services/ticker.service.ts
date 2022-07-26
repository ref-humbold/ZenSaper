import { Injectable } from "@angular/core";
import { Subscription, interval } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TickerService {
  private seconds_: number = 0;
  private subscription: Subscription = Subscription.EMPTY;

  constructor() {}

  public get isValid(): boolean {
    return this.subscription.closed ?? false;
  }

  public get seconds(): number {
    return this.seconds_;
  }

  public create(callback?: (seconds: number) => void): void {
    this.destroy();
    this.subscription = interval(1000).subscribe(() => callback?.(++this.seconds_));
  }

  public destroy(): void {
    this.subscription.unsubscribe();
    this.seconds_ = 0;
  }
}
