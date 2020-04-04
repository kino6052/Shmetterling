import { useState, useEffect } from "react";
import {
  BehaviorSubject as __BehaviorSubject,
  Subject as __Subject,
} from "rxjs";
import { skip, tap, debounceTime } from "rxjs/operators";
import { DEFAULT_DELAY } from "../constants";

export const getVW = (value: number) => (value / 1440) * 100;

export const MARGIN = getVW(597);
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
