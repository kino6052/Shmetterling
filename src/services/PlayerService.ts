import { combineLatest, Subject as ISubject } from "rxjs";
import { debounceTime, filter, map, skip, throttleTime } from "rxjs/operators";
import { DEFAULT_DELAY, IDLE_DELAY } from "../constants";
import {
  BehaviorSubject,
  Subject,
  closeFullscreen,
  openFullscreen,
} from "../utils/utils";
import {
  CurrentVideoSubject,
  ErrorSubject,
  ICurrentVideo,
  removeCurrentVideo,
} from "./DataService";
import { Route, RouteSubject } from "./RouteService";
import {
  InitSubject,
  PlayerErrorSubject,
  PlayerRefSubject,
  PlayerStateChangeSubject,
  VolumeSubject,
} from "./YouTubeService";
import { GLOBAL } from "./DOMService";

export const IsPlayingSubject = new BehaviorSubject<boolean>(
  true,
  "IsPlayingSubject"
);
export const NextSongSubject = new Subject("NextSongSubject").pipe(
  throttleTime(DEFAULT_DELAY)
) as ISubject<unknown>;

export const PrevSongSubject = new Subject("PrevSongSubject");
export const IsLoadingSubject = new BehaviorSubject<boolean>(true);
export const IsIdleSubject = new BehaviorSubject<boolean>(true);
export const ShouldShowMenuSubject = new BehaviorSubject(true);
export const DislikeSubject = new Subject("Dislike");
export const FullScreenSubject = new BehaviorSubject(false);

// @ts-ignore
GLOBAL.FullScreenSubject = FullScreenSubject;

export const __ShouldShowMenuSubject = combineLatest(
  IsIdleSubject.pipe(
    filter(() => {
      const route = RouteSubject.getValue();
      return route === Route.Main;
    })
  ),
  IsPlayingSubject,
  RouteSubject
).pipe(
  map(([isIdle, isPlaying, route]) => {
    return !isIdle || !isPlaying || [Route.Add, Route.Similar].includes(route);
  })
);

export const toggleIsPlaying = () => {
  const isPlaying = IsPlayingSubject.getValue();
  IsPlayingSubject.next(!isPlaying);
};

export const pause = () => {
  const [player] = PlayerRefSubject.getValue();
  try {
    player.pauseVideo();
  } catch (e) {
    ErrorSubject.next(e.message);
  }
};

export const play = () => {
  const [player] = PlayerRefSubject.getValue();
  try {
    player.playVideo();
  } catch (e) {
    ErrorSubject.next(e.message);
  }
};

export const loadVideo = (currentVideo: ICurrentVideo) => {
  const [player] = PlayerRefSubject.getValue();
  try {
    player.loadVideoById(currentVideo.source_data);
  } catch (e) {
    ErrorSubject.next(e.message);
  }
};

export const setVolume = (volume: number) => {
  const [player] = PlayerRefSubject.getValue();
  try {
    player.setVolume(volume);
  } catch (e) {
    ErrorSubject.next(e.message);
  }
};

export const toggleFullScreen = () => {
  const isFullScreen = FullScreenSubject.getValue();
  FullScreenSubject.next(!isFullScreen);
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
    if (hasEnded) {
      setTimeout(() => {
        // For some reason player doesn't catch the events immediately
        NextSongSubject.next();
      }, DEFAULT_DELAY);
    }
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

  VolumeSubject.pipe(skip(1)).subscribe((volume) => {
    setVolume(volume);
  });

  DislikeSubject.subscribe(() => {
    removeCurrentVideo();
    NextSongSubject.next();
  });

  FullScreenSubject.pipe(skip(1)).subscribe((isFullScreen) => {
    isFullScreen ? openFullscreen() : closeFullscreen();
  });

  NextSongSubject.next();
});
