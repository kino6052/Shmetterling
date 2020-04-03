import { BehaviorSubject, forkJoin, Subject } from "rxjs";
import { filter, skip, take } from "rxjs/operators";
import { useScript } from "../utils/useScript";

interface IPlayer {
  loadVideoById: (id: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
}

export const InitSubject = new Subject();
export const TestSubject = new BehaviorSubject(null);
export const PlayerRefSubject = new BehaviorSubject<IPlayer[]>([]);
export const YouTubeScriptLoadedStateSubject = new BehaviorSubject(false);
export const PlayerReadySubject = new BehaviorSubject({ id: 0 });
export const PlayerStateChangeSubject = new BehaviorSubject<{
  id: number;
  e: unknown;
}>({ id: 0, e: null });

export const useYouTubeScript = () => {
  const [loaded] = useScript("https://www.youtube.com/player_api");
  setTimeout(() => {
    YouTubeScriptLoadedStateSubject.next(loaded);
  }, 500);
};

const initPlayer = () => {
  // @ts-ignore
  const player: IPlayer = new YT.Player("player", {
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 0,
      rel: 0,
      fs: 0,
      modestbranding: 1,
    },
    events: {
      onReady: () => {
        PlayerReadySubject.next({ id: 1 });
      },
      onStateChange: (e: unknown) => {
        PlayerStateChangeSubject.next({ id: 1, e });
      },
    },
  });
  PlayerRefSubject.next([player]);
};

YouTubeScriptLoadedStateSubject.pipe(filter((isLoaded) => isLoaded)).subscribe(
  initPlayer
);

forkJoin(
  PlayerReadySubject.pipe(skip(1), take(1)),
  PlayerRefSubject.pipe(skip(1), take(1))
).subscribe(() => {
  InitSubject.next();
});
