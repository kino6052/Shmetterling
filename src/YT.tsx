import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { useScript } from "./useScript";
import styled from "styled-components";
import { Overlay } from "./Menus";
import * as React from "react";
import { IsPlayingSubject, NextSongSubject } from "./Player";
import { MusicVideo } from "@material-ui/icons";
import {
  MusicVideoSubject,
  ICurrentVideo,
  CurrentVideoSubject,
} from "./DataService";
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
  PlayerRefSubject.next([player]);
};

export const loadSong = (songId: string) => {
  const isPlaying = IsPlayingSubject.getValue();
  // @ts-ignore
  const [player] = PlayerRefSubject.getValue();
  fetch(`/link?id=${songId}`)
    .then((res) => {
      console.warn(res);
      return res.json();
    })
    .then((data) => {
      CurrentVideoSubject.next(data as ICurrentVideo);
      // @ts-ignore
      player.loadVideoById(data.source_data);
      // @ts-ignore
      // bgPlayer.loadVideoById(songId);
      if (isPlaying) return;
      // @ts-ignore
      player.pauseVideo();
      // @ts-ignore
      // bgPlayer.pauseVideo();
    });
};

export const pause = () => {
  // @ts-ignore
  const [player] = PlayerRefSubject.getValue();
  // @ts-ignore
  player.pauseVideo();
};

export const play = () => {
  // @ts-ignore
  const [player] = PlayerRefSubject.getValue();
  // @ts-ignore
  player.playVideo();
};

YouTubeScriptLoadedStateSubject.pipe(filter((isLoaded) => isLoaded)).subscribe(
  initPlayer
);

PlayerReadySubject.pipe(filter(({ id }) => id === 1)).subscribe(() => {
  // @ts-ignore
  const [player] = PlayerRefSubject.getValue();
  // console.warn("body", player);
});

PlayerStateChangeSubject.subscribe((a) => {
  // @ts-ignore
  console.warn("Data", a && a.data);
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
    <div id="player">Player One</div>
  </PlayerWrapper>
);

PlayerReadySubject.subscribe(() => {
  NextSongSubject.subscribe(() => {
    const videos = MusicVideoSubject.getValue();
    const index = Math.round(Math.random() * (videos.length - 1));
    console.warn(index, videos[index].id);
    loadSong(videos[index].id);
  });
  IsPlayingSubject.subscribe((isPlaying) => {
    isPlaying ? play() : pause();
  });
});
