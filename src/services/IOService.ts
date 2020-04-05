import Mousetrap from "mousetrap";
import { openFullscreen, closeFullscreen } from "../utils/utils";
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

  Mousetrap.bind("f", function () {
    openFullscreen();
  });

  Mousetrap.bind("left", function () {
    PrevSongSubject.next();
  });

  Mousetrap.bind(["esc", "escape"], function () {
    closeFullscreen();
    IsIdleSubject.next(true);
    ShouldShowMenuSubject.next(false);
  });
});
