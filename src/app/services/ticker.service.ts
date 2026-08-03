import { Injectable, Signal, signal } from "@angular/core";
import { Subscription, interval } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TickerService {
  private readonly seconds_ = signal<number>(0);
  private subscription = Subscription.EMPTY;

  constructor() {}

  public get seconds(): Signal<number> {
    return this.seconds_.asReadonly();
  }

  public create(): void {
    this.destroy();
    this.seconds_.set(0);
  }

  public start(): void {
    this.subscription = interval(1000).subscribe(() => this.seconds_.update(value => value + 1));
  }

  public destroy(): void {
    this.subscription.unsubscribe();
  }
}
