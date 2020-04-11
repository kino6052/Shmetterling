import { IconButton } from "@material-ui/core";
import {
  PauseOutlined,
  PlayArrowOutlined,
  SkipNextOutlined,
  SkipPreviousOutlined,
  ThumbDown,
} from "@material-ui/icons";
import * as React from "react";
import styled from "styled-components";
import { CurrentVideoSubject } from "../../services/DataService";
import { MainDrawer as MainDrawerObject } from "../../services/DrawerService";
import {
  IsPlayingSubject,
  NextSongSubject,
  PrevSongSubject,
} from "../../services/PlayerService";
import { BLUE, getVWString, useSharedState } from "../../utils/utils";
import { Logo } from "../Logo";
import { DrawerWrapper } from "./Drawer";

const MainDrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 56.25vw;
  padding: ${() => getVWString(38)} ${() => getVWString(86)};
  box-sizing: border-box;
`;

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

const CurrentBandWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  p {
    font-size: ${() => getVWString(18)};
    line-height: ${() => getVWString(21)};
    margin: 0;
    margin-bottom: ${() => getVWString(48)};
  }
  h1 {
    font-size: ${() => getVWString(64)};
    line-height: ${() => getVWString(75)};
    font-weight: bold;
    margin: 0;
    margin-bottom: ${() => getVWString(40)};
  }
  h4 {
    font-size: ${() => getVWString(24)};
    line-height: ${() => getVWString(28)};
    color: ${BLUE};
    margin: 0;

    .dislike {
      color: white;
      height: ${() => getVWString(24)};
      width: ${() => getVWString(24)};
      padding: 0;
      margin-left: ${() => getVWString(24)};
      svg {
        height: ${() => getVWString(24)};
      }
    }
  }
`;

export const MainDrawer: React.SFC = () => {
  const [currentVideo] = useSharedState(CurrentVideoSubject);
  const [isPlaying] = useSharedState(IsPlayingSubject);
  const [x] = useSharedState(MainDrawerObject.position);
  return (
    <DrawerWrapper x={x} time={MainDrawerObject.time}>
      <MainDrawerWrapper>
        <Logo />
        <CurrentBandWrapper>
          <p>You're watching</p>
          <h1>{currentVideo && currentVideo.name}</h1>
          <h4 className="blue">
            {currentVideo && currentVideo.song_title}{" "}
            <IconButton
              classes={{ root: "dislike" }}
              color="primary"
              aria-label="Thumb Down"
            >
              <ThumbDown />
            </IconButton>
          </h4>
        </CurrentBandWrapper>
        <ControlsWrapper>
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
            {!isPlaying && <PlayArrowOutlined />}
            {isPlaying && <PauseOutlined />}
          </IconButton>
          <IconButton classes={{ root: "icon" }}>
            <SkipNextOutlined
              onClick={() => {
                NextSongSubject.next();
              }}
            />
          </IconButton>
        </ControlsWrapper>
      </MainDrawerWrapper>
    </DrawerWrapper>
  );
};
