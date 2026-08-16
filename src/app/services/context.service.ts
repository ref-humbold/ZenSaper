import { Injectable, Signal, signal } from "@angular/core";

import { Context } from "src/app/models/context";

@Injectable({
  providedIn: "root"
})
export class ContextService {
  private readonly context_ = signal(new Context("assets/epicface.png"));

  public get context(): Signal<Context> {
    return this.context_.asReadonly();
  }

  public reload(image: string): void {
    this.context_.set(new Context(image));
  }
}
