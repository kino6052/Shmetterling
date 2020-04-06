import { skip, throttleTime, filter, debounceTime, map } from "rxjs/operators";
import {
  CurrentVideoSubject,
  ICurrentVideo,
  InputSubject,
} from "./DataService";
import {
  InitSubject,
  PlayerErrorSubject,
  PlayerRefSubject,
  PlayerStateChangeSubject,
} from "./YouTubeService";
import { DEFAULT_DELAY, IDLE_DELAY } from "../constants";
import { BehaviorSubject, Subject, debug } from "../utils/utils";
import { Subject as ISubject, concat, forkJoin, combineLatest } from "rxjs";
import { RouteSubject, Route } from "./RouteService";

export const IsPlayingSubject = new BehaviorSubject<boolean>(
  true,
  "IsPlayingSubject"
);
export const NextSongSubject = new Subject("NextSongSubject").pipe(
  throttleTime(DEFAULT_DELAY)
) as ISubject<unknown>;

export const PrevSongSubject = new Subject("PrevSongSubject");

export const IsLoadingSubject = new BehaviorSubject<boolean>(
  true,
  "IsLoadingSubject"
);
export const IsIdleSubject = new BehaviorSubject<boolean>(true);

export const ShouldShowMenuSubject = new BehaviorSubject(true);

export const __ShouldShowMenuSubject = combineLatest(
  IsIdleSubject,
  IsPlayingSubject,
  RouteSubject
).pipe(
  map(([isIdle, isPlaying, route]) => {
    return !isIdle || !isPlaying || route === Route.Add;
  })
);

export const toggleIsPlaying = () => {
  const isPlaying = IsPlayingSubject.getValue();
  IsPlayingSubject.next(!isPlaying);
};

export const pause = () => {
  const [player] = PlayerRefSubject.getValue();
  player.pauseVideo();
};

export const play = () => {
  const [player] = PlayerRefSubject.getValue();
  player.playVideo();
};

export const loadVideo = (currentVideo: ICurrentVideo) => {
  const [player] = PlayerRefSubject.getValue();
  player.loadVideoById(currentVideo.source_data);
};

InitSubject.subscribe(() => {
  __ShouldShowMenuSubject.subscribe((shouldShowMenu) => {
    ShouldShowMenuSubject.next(shouldShowMenu);
  });

  IsIdleSubject.pipe(
    filter((isIdle) => !isIdle),
    debounceTime(IDLE_DELAY)
  ).subscribe(() => {
    IsIdleSubject.next(true);
  });

  PlayerErrorSubject.pipe(skip(1)).subscribe(() => {
    NextSongSubject.next();
  });

  PlayerStateChangeSubject.pipe(skip(1)).subscribe(({ e }) => {
    const { data } = e as { data: number };
    const hasEnded = data === 0;
    if (hasEnded) NextSongSubject.next();
    const isLoading = ![0, 1, 2].includes(data);
    IsLoadingSubject.next(isLoading);
  });

  CurrentVideoSubject.pipe(skip(1)).subscribe((currentVideo) => {
    if (!currentVideo) return;
    loadVideo(currentVideo);
  });

  NextSongSubject.subscribe(() => {
    IsPlayingSubject.next(true);
  });

  IsPlayingSubject.pipe(skip(1)).subscribe((isPlaying) => {
    isPlaying ? play() : pause();
  });

  NextSongSubject.next();
});
