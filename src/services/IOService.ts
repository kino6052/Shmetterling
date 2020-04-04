import Mousetrap from "mousetrap";
import { InitSubject } from "./YouTubeService";
import {
  IsIdleSubject,
  toggleIsPlaying,
  NextSongSubject,
  PrevSongSubject,
  ShouldShowMenuSubject,
} from "./PlayerService";

InitSubject.subscribe(() => {
  window.addEventListener("mousemove", () => {
    IsIdleSubject.next(false);
  });

  window.addEventListener("keydown", () => {
    IsIdleSubject.next(false);
  });

  Mousetrap.bind("space", function () {
    toggleIsPlaying();
  });

  Mousetrap.bind("right", function () {
    NextSongSubject.next();
  });

  Mousetrap.bind("left", function () {
    PrevSongSubject.next();
  });

  Mousetrap.bind(["esc", "escape"], function () {
    IsIdleSubject.next(true);
    ShouldShowMenuSubject.next(false);
  });
});
