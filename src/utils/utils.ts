// @ts-nocheck

import { useState, useEffect } from "react";
import {
  BehaviorSubject as __BehaviorSubject,
  Subject as __Subject,
} from "rxjs";
import { skip, tap, debounceTime } from "rxjs/operators";
import { DEFAULT_DELAY } from "../constants";

const ASPECT_RATIO = 16 / 9;

export const getWidthToHeightRatio = (
  innerWidth: number,
  innerHeight: number
) => innerWidth / innerHeight;

export enum WidthCaseScenario {
  "Normal",
  "DependentOnHeight",
}

export const getWidthCaseScenario = (ratio: number): WidthCaseScenario =>
  ratio < ASPECT_RATIO
    ? WidthCaseScenario.Normal
    : WidthCaseScenario.DependentOnHeight;

export const getDefaultCaseScenario = () => {
  const { innerWidth = 0, innerHeight = 0 } = window || {};
  const ratio = getWidthToHeightRatio(innerWidth, innerHeight);
  return getWidthCaseScenario(ratio);
};

const DEFAULT_WIDTH = 1445;

// export const getVW = (value: number) =>
//   (value / (getWidthToHeightRatio() < 1 ? (1435 * 9) / 16 : 1435)) * 100;

export const getVWString = (value: number) => {
  const { innerWidth = 0, innerHeight = 0 } = window || {};
  const ratio = getWidthToHeightRatio(innerWidth, innerHeight);
  const scenario = getWidthCaseScenario(ratio);
  const result = (value / DEFAULT_WIDTH) * 100;
  switch (scenario) {
    case WidthCaseScenario.Normal:
      return `${result}vw`;
    case WidthCaseScenario.DependentOnHeight:
      return `${result * ASPECT_RATIO}vh`;
  }
};

export const MARGIN = () => getVWString(597);
export const BLUE = "#26BEFF";
export const ZERO = 5;

export const useSharedState = <T>(
  subject: __BehaviorSubject<T>
): [T, typeof useState] => {
  const [value, setState] = useState(subject.getValue());
  useEffect(() => {
    const sub = subject.pipe(skip(1)).subscribe((s) => setState(s));
    return () => sub.unsubscribe();
  });
  const newSetState = (state: T) => subject.next(state);
  // @ts-ignore
  return [value, newSetState];
};

export const appendToSubjectValue = <T>(
  subject: __BehaviorSubject<Array<T>>,
  nextValue: Array<T>
) => {
  const currentValue = subject.getValue();
  subject.next([...currentValue, ...nextValue]);
};

export const debug = (name?: string) =>
  tap((...args) => console.warn(name, args));

export const BehaviorSubject = class<T> extends __BehaviorSubject<T> {
  constructor(input: T, name?: string) {
    super(input);
    const pipe = !!name ? [debug(name), debounceTime(DEFAULT_DELAY)] : [];
    // @ts-ignore
    this.pipe(...pipe).subscribe();
  }
};

export const Subject = class<T> extends __Subject<T> {
  constructor(name?: string) {
    super();
    const pipe = !!name ? [debug(name), debounceTime(DEFAULT_DELAY)] : [];
    // @ts-ignore
    this.pipe(...pipe).subscribe();
  }
};

export const shuffle = <T>(array: Array<T>) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const elem = document.documentElement;

/* View in fullscreen */
export const openFullscreen = () => {
  try {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  } catch (e) {
    console.warn(e.message);
  }
};

/* Close fullscreen */
export const closeFullscreen = () => {
  try {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
    }
  } catch (e) {
    console.warn(e.message);
  }
};
