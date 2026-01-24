import { Injectable } from "@angular/core";

import { Context } from "src/app/models/context";

@Injectable({
  providedIn: "root"
})
export class ContextService {
  private context_: Context = new Context("assets/epicface.png");

  public get context(): Context {
    return this.context_;
  }

  public reload(image: string): void {
    this.context_ = new Context(image);
  }
}
