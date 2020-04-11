import { BehaviorSubject } from "../utils/utils";

export enum Route {
  Main = "main",
  Add = "add",
  Similar = "similar",
}

export const RouteSubject = new BehaviorSubject<Route>(
  Route.Main,
  "RouteSubject"
);
