import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { useScript } from "./useScript";
import styled from "styled-components";
import { Overlay } from "./Menus";
import * as React from "react";
import { IsPlayingSubject, NextSongSubject } from "./Player";
import { MusicVideo } from "@material-ui/icons";
import { MusicVideoSubject } from "./DataService";
import { getVW } from "./utils";

export const TestSubject = new BehaviorSubject(null);
export const PlayerRefSubject = new BehaviorSubject(null);
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
  const player = new YT.Player("player", {
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
  // @ts-ignore
  const bgPlayer = new YT.Player("bg-player", {
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 0,
      fs: 0,
      modestbranding: 1,
    },
    events: {
      onReady: () => {
        PlayerReadySubject.next({ id: 2 });
      },
      onStateChange: (e: unknown) => {
        PlayerStateChangeSubject.next({ id: 2, e });
      },
    },
  });
  // @ts-ignore
  PlayerRefSubject.next([player, bgPlayer]);
};

export const loadSong = (songId: string) => {
  const isPlaying = IsPlayingSubject.getValue();
  // @ts-ignore
  const [player] = PlayerRefSubject.getValue();
  // @ts-ignore
  player.loadVideoById(songId);
  // @ts-ignore
  // bgPlayer.loadVideoById(songId);
  if (isPlaying) return;
  // @ts-ignore
  player.pauseVideo();
  // @ts-ignore
  // bgPlayer.pauseVideo();
};

YouTubeScriptLoadedStateSubject.pipe(filter((isLoaded) => isLoaded)).subscribe(
  () => {
    initPlayer();
  }
);

PlayerReadySubject.pipe(filter(({ id }) => id === 1)).subscribe(() => {
  // @ts-ignore
  const [player] = PlayerRefSubject.getValue();
  console.warn("body", player);
});

PlayerStateChangeSubject.subscribe((a) => {
  console.warn("TEST", a);
});

PlayerRefSubject.subscribe(console.warn);

const PlayerWrapper = styled.div`
  width: 100%;
  height: 100vh;
  #player {
    display: flex;
    position: fixed;
    flex-direction: row;
    z-index: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
  }
`;

export const Player: React.SFC = (props) => (
  <PlayerWrapper>
    <Overlay />
    {/* <div id="bg-player">Background Player</div> */}
    <div id="player">Player One</div>
  </PlayerWrapper>
);

PlayerReadySubject.subscribe(() => {
  NextSongSubject.subscribe(() => {
    // const videos = MusicVideoSubject.getValue();
    loadSong("RvnkAtWcKYg");
  });
});

const test = (player: unknown) => {
  IsPlayingSubject.subscribe((isPlaying) => {
    if (isPlaying) {
      // @ts-ignore
      player.playVideo();
    } else {
      // @ts-ignore
      player.pauseVideo();
    }
  });
};

PlayerReadySubject.pipe(filter(({ id }) => id === 2)).subscribe(() => {
  // @ts-ignore
  const [_, player] = PlayerRefSubject.getValue();
  test(player);
});

PlayerReadySubject.pipe(filter(({ id }) => id === 1)).subscribe(() => {
  // @ts-ignore
  const [player] = PlayerRefSubject.getValue();
  test(player);
});
