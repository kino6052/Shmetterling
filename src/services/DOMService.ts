import {
  BehaviorSubject,
  getDefaultCaseScenario,
  WidthCaseScenario,
  Subject,
} from "../utils/utils";
import { distinctUntilChanged } from "rxjs/operators";

const DEFAULT_SCENARIO = getDefaultCaseScenario();

export const WindowAspectRatioSubject = new BehaviorSubject<WidthCaseScenario>(
  DEFAULT_SCENARIO
);

const OnResizeSubject = new Subject<WidthCaseScenario>();

window.addEventListener("resize", () => {
  OnResizeSubject.next(getDefaultCaseScenario());
});

OnResizeSubject.pipe(distinctUntilChanged()).subscribe((scenario) => {
  WindowAspectRatioSubject.next(scenario);
});
