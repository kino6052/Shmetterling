import Mousetrap from "mousetrap";
import {
  FullScreenSubject,
  IsIdleSubject,
  NextSongSubject,
  PrevSongSubject,
  toggleIsPlaying,
  IsPlayingSubject,
  PauseSubject,
  PlaySubject,
} from "./PlayerService";
import { InitSubject } from "./YouTubeService";

InitSubject.subscribe(() => {
  window.addEventListener("mousemove", () => {
    IsIdleSubject.next(false);
  });

  window.addEventListener("keypress", () => {
    IsIdleSubject.next(false);
  });

  Mousetrap.bind(["space", "spacebar"], () => {
    const isPlaying = IsPlayingSubject.getValue();
    isPlaying ? PauseSubject.next() : PlaySubject.next();
  });

  Mousetrap.bind("right", function () {
    NextSongSubject.next();
  });

  Mousetrap.bind("f", function () {
    FullScreenSubject.next(true);
  });

  Mousetrap.bind("left", function () {
    PrevSongSubject.next();
  });
});
