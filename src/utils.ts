import { useState, useEffect } from "react";
import { BehaviorSubject } from "rxjs";
import { skip } from "rxjs/operators";

export const getVW = (value: number) => (value / 1440) * 100;

export const MARGIN = getVW(597);
export const BLUE = "#26BEFF";
export const ZERO = 5;

export const useSharedState = <T>(
  subject: BehaviorSubject<T>
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
