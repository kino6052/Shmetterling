import * as React from "react";
import styled from "styled-components";
import { getVWString, useSharedState } from "../utils/utils";
import { IconButton } from "@material-ui/core";
import {
  SkipPreviousOutlined,
  PlayArrowOutlined,
  PauseOutlined,
  SkipNextOutlined,
  Reply,
} from "@material-ui/icons";
import {
  IsPlayingSubject,
  PrevSongSubject,
  NextSongSubject,
} from "../services/PlayerService";
import { RouteSubject, Route } from "../services/RouteService";

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  .icon {
    color: white;
    height: ${() => getVWString(102)};
    width: ${() => getVWString(102)};
    padding: 0;
    svg {
      font-size: ${() => getVWString(102)};
    }
  }
`;

export const Controls: React.SFC<{ route: Route; isPlaying: boolean }> = ({
  route,
  isPlaying,
}) => {
  const isMainRoute = route === Route.Main;
  return (
    <ControlsWrapper>
      {isMainRoute && (
        <React.Fragment>
          <IconButton classes={{ root: "icon" }} aria-label="Skip to Previous">
            <SkipPreviousOutlined
              onClick={() => {
                PrevSongSubject.next();
              }}
            />
          </IconButton>
          <IconButton
            classes={{ root: "icon" }}
            onClick={() => {
              IsPlayingSubject.next(!IsPlayingSubject.getValue());
            }}
          >
            {isPlaying ? <PauseOutlined /> : <PlayArrowOutlined />}
          </IconButton>
          <IconButton classes={{ root: "icon" }}>
            <SkipNextOutlined
              onClick={() => {
                NextSongSubject.next();
              }}
            />
          </IconButton>
        </React.Fragment>
      )}
      {!isMainRoute && (
        <IconButton classes={{ root: "icon" }} aria-label="Go Back">
          <Reply
            onClick={() => {
              RouteSubject.next(Route.Main);
            }}
          />
        </IconButton>
      )}
    </ControlsWrapper>
  );
};
