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

export const MouseCoordinateSubject = new BehaviorSubject<[number, number]>([
  0,
  0,
]);

const OnResizeSubject = new Subject<WidthCaseScenario>();

window.addEventListener("resize", () => {
  OnResizeSubject.next(getDefaultCaseScenario());
});

window.addEventListener("mousemove", ({ clientX, clientY }) => {
  MouseCoordinateSubject.next([clientX, clientY]);
});

OnResizeSubject.pipe(distinctUntilChanged()).subscribe((scenario) => {
  WindowAspectRatioSubject.next(scenario);
});
