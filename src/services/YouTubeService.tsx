import { BehaviorSubject, Subject } from "../utils/utils";
import { filter, skip, take } from "rxjs/operators";
import { useScript } from "../utils/useScript";
import { forkJoin } from "rxjs";

interface IPlayer {
  loadVideoById: (id: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
}

export const InitSubject = new Subject("InitSubject");
export const TestSubject = new BehaviorSubject(null, "TestSubject");
export const VolumeSubject = new BehaviorSubject<number>(100);
export const PlayerRefSubject = new BehaviorSubject<IPlayer[]>(
  [],
  "PlayerRefSubject"
);
export const YouTubeScriptLoadedStateSubject = new BehaviorSubject(
  false,
  "YouTubeScriptLoadedStateSubject"
);
export const PlayerReadySubject = new BehaviorSubject(
  { id: 0 },
  "PlayerReadySubject"
);
export const PlayerStateChangeSubject = new BehaviorSubject<{
  id: number;
  e: unknown;
}>({ id: 0, e: null }, "PlayerStateChangeSubject");
export const PlayerErrorSubject = new BehaviorSubject<{
  id: number;
  e: unknown;
}>({ id: 0, e: null }, "PlayerErrorSubject");

export const useYouTubeScript = async () => {
  const [loaded] = useScript("https://www.youtube.com/player_api");
  const [ref] = PlayerRefSubject.getValue();
  if (ref) return; // Reference to a player already exists;
  const interval = setInterval(() => {
    try {
      // @ts-ignore
      new YT.Player("initialize");
      clearInterval(interval);
      YouTubeScriptLoadedStateSubject.next(loaded);
    } catch (e) {
      console.warn("Retrying", e.message);
    }
  }, 500);
};

const initPlayer = () => {
  // @ts-ignore
  const player: IPlayer = new YT.Player("player", {
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
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
      onError: (e: unknown) => {
        PlayerErrorSubject.next({ id: 1, e });
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
