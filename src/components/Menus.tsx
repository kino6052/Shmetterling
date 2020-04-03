import { FastForward, FastRewind, Pause, PlayArrow } from "@material-ui/icons";
import * as React from "react";
import { BehaviorSubject } from "rxjs";
import styled, { css } from "styled-components";
import { PlayListSubject, CurrentVideoSubject } from "../services/DataService";
import { ListContainer } from "./List";
import { PaneMixin } from "./Pane";
import { Route, RouteSubject } from "../services/RouteService";
import { SearchScreen } from "./SearchScreen";
import { Spacer } from "./Spacer";
import { getVW, MARGIN, useSharedState, ZERO } from "../utils/utils";
import {
  IsPlayingSubject,
  PrevSongSubject,
  NextSongSubject,
} from "../services/PlayerService";

const OverlayWrapper = styled.div`
  color: white;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  &.in {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(15px);
    animation: shrink 0.5s normal;
    margin-left: 0%;
    width: 100%;
    opacity: 1;
  }
  &.out {
    background: none;
    backdrop-filter: none;
    animation: grow 0.5s normal;
    margin-left: -50%;
    width: 200%;
    opacity: 0;
  }
  @keyframes shrink {
    0% {
      background: none;
      backdrop-filter: none;
      margin-left: -50%;
      width: 200%;
      opacity: 0;
    }
    100% {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      margin-left: 0%;
      width: 100%;
      opacity: 1;
    }
  }
  @keyframes grow {
    0% {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      margin-left: 0;
      width: 100%;
      opacity: 1;
    }
    100% {
      background: none;
      backdrop-filter: none;
      margin-left: -50%;
      width: 200%;
      opacity: 0;
    }
  }
`;

const PaneWrapper = styled.div<{ position: "right" | "left" }>`
  ${PaneMixin}
  ${({ position }) => {
    const isLeft = position === "left";
    const l = css`
      align-items: flex-start;
      text-align: left;
    `;
    const r = css`
      align-items: flex-end;
      text-align: right;
    `;
    return isLeft ? l : r;
  }}
`;

export const MouseOverSubject = new BehaviorSubject(false);

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  .icon {
    font-size: ${getVW(102)}vw;
  }
`;

const LeftPane: React.SFC = (props) => {
  const [currentVideo] = useSharedState(CurrentVideoSubject);
  const [isPlaying] = useSharedState(IsPlayingSubject);
  return (
    <PaneWrapper position="left" id="slide">
      <h4 className="blue">Schmetterling</h4>
      <Spacer height={70} />
      <p>You're watching</p>
      <h1>{currentVideo && currentVideo.name}</h1>
      <h4 className="blue">{currentVideo && currentVideo.song_title}</h4>
      <Spacer height={70} />
      <ControlsWrapper>
        <FastRewind
          classes={{ root: "icon" }}
          onClick={() => {
            PrevSongSubject.next();
          }}
        />
        <span
          onClick={() => {
            IsPlayingSubject.next(!IsPlayingSubject.getValue());
          }}
        >
          {!isPlaying && <PlayArrow classes={{ root: "icon" }} />}
          {isPlaying && <Pause classes={{ root: "icon" }} />}
        </span>
        <FastForward
          classes={{ root: "icon" }}
          onClick={() => {
            NextSongSubject.next();
          }}
        />
      </ControlsWrapper>
    </PaneWrapper>
  );
};

const RightPane: React.SFC = (props) => {
  const [playList] = useSharedState(PlayListSubject);
  return (
    <PaneWrapper position="right">
      <h4>Your Band List</h4>
      <h1>
        <span className="blue" onClick={() => RouteSubject.next(Route.Add)}>
          +
        </span>{" "}
        {playList.length} Bands
      </h1>
      <Spacer height={70} />
      <ListContainer items={playList} />
    </PaneWrapper>
  );
};

const Main: React.SFC = (props) => (
  <React.Fragment>
    <LeftPane />
    <RightPane />
  </React.Fragment>
);

export const Overlay: React.SFC = (props) => {
  const [route] = useSharedState(RouteSubject);
  const isMain = route === Route.Main;
  const isAdd = route === Route.Add;
  const [isIn] = useSharedState(MouseOverSubject);
  const className = isIn ? "in" : "out";
  return (
    <OverlayWrapper
      className={className}
      onMouseEnter={() => {
        MouseOverSubject.next(true);
      }}
      onMouseLeave={() => {
        MouseOverSubject.next(false);
      }}
    >
      {isMain && <Main />}
      {isAdd && <SearchScreen />}
    </OverlayWrapper>
  );
};
