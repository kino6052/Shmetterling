import Mousetrap from "mousetrap";
import { openFullscreen, closeFullscreen } from "../utils/utils";
import { InitSubject } from "./YouTubeService";
import {
  IsIdleSubject,
  toggleIsPlaying,
  NextSongSubject,
  PrevSongSubject,
  ShouldShowMenuSubject,
  FullScreenSubject,
} from "./PlayerService";

InitSubject.subscribe(() => {
  window.addEventListener("mousemove", () => {
    IsIdleSubject.next(false);
  });

  window.addEventListener("keypress", () => {
    IsIdleSubject.next(false);
  });

  Mousetrap.bind("space", function () {
    toggleIsPlaying();
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

  Mousetrap.bind(
    ["esc", "escape"],
    function () {
      FullScreenSubject.next(false);
    },
    "keyup"
  );
});
