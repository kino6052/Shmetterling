import { BehaviorSubject } from "rxjs";

export enum Route {
  Main = "main",
  Add = "add"
}

export const RouteSubject = new BehaviorSubject<Route>(Route.Main);
