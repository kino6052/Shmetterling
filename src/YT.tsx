import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { useScript } from "./useScript";
import styled from "styled-components";
import { Overlay } from "./Menus";
import * as React from "react";

export const TestSubject = new BehaviorSubject(null);
export const PlayerRefSubject = new BehaviorSubject(null);
export const YouTubeScriptLoadedStateSubject = new BehaviorSubject(false);
export const PlayerReadySubject = new BehaviorSubject({ id: 0 });
export const PlayerStateChangeSubject = new BehaviorSubject({ id: 0, e: null });

export const useYouTubeScript = () => {
  const [loaded] = useScript("https://www.youtube.com/player_api");
  setTimeout(() => {
    YouTubeScriptLoadedStateSubject.next(loaded);
  }, 500);
};

const initPlayer = () => {
  const test = new YT.Player("player", {
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 0,
      fs: 0,
      modestbranding: 1
    },
    events: {
      onReady: () => {
        PlayerReadySubject.next({ id: 1 });
      },
      onStateChange: e => {
        PlayerStateChangeSubject.next({ id: 1, e });
      }
    }
  });
  PlayerRefSubject.next(test);
};

YouTubeScriptLoadedStateSubject.pipe(filter(isLoaded => isLoaded)).subscribe(
  () => {
    initPlayer();
  }
);

PlayerReadySubject.pipe(filter(({ id }) => id === 1)).subscribe(() => {
  const test = PlayerRefSubject.getValue();
  console.warn("body", test);
});

PlayerStateChangeSubject.subscribe(a => {
  console.warn("TEST", a);
});

PlayerRefSubject.subscribe(console.warn);

const PlayerWrapper = styled.div`
  width: 82.99vw;
  height: 46.67vw;
  #player {
    display: flex;
    width: 100%;
    height: 100%;
  }
`;

export const Player: React.SFC = props => (
  <PlayerWrapper>
    <Overlay />
    <div id="player">Hello CodeSandbox</div>
  </PlayerWrapper>
);
