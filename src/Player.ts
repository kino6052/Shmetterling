import { BehaviorSubject, Subject } from "rxjs";

export const IsPlayingSubject = new BehaviorSubject<boolean>(false);
export const NextSongSubject = new Subject();
export const PrevSongSubject = new Subject();
