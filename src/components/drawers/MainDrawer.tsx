import * as React from "react";
import { DrawerWrapper } from "./Drawer";
import { useSharedState, BLUE, getVWString } from "../../utils/utils";
import { LeftDrawer } from "../../services/DrawerService";
import { CurrentVideoSubject } from "../../services/DataService";
import {
  IsPlayingSubject,
  PrevSongSubject,
  NextSongSubject,
} from "../../services/PlayerService";
import { Spacer } from "../Spacer";
import styled from "styled-components";
import {
  SkipPreviousOutlined,
  PlayArrowOutlined,
  PauseOutlined,
  SkipNextOutlined,
  MusicVideo,
  ThumbDown,
} from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

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

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: ${() => getVWString(247)};
  h4 {
    margin: 0;
    color: white;
    font-size: ${() => getVWString(26)};
  }
  .logo-icon {
    height: ${() => getVWString(50)};
    width: ${() => getVWString(50)};
    color: ${BLUE};
    svg {
      color: ${BLUE};
      height: ${() => getVWString(50)};
      width: ${() => getVWString(50)};
    }
  }
`;

export const MainDrawer: React.SFC = (props) => {
  const [currentVideo] = useSharedState(CurrentVideoSubject);
  const [isPlaying] = useSharedState(IsPlayingSubject);
  const [x] = useSharedState(LeftDrawer.position);
  return (
    <DrawerWrapper x={x} time={LeftDrawer.time}>
      <MainDrawerWrapper>
        <LogoWrapper>
          <MusicVideo classes={{ root: "logo-icon" }} />
          <h4 className="blue">Schmetterling</h4>
        </LogoWrapper>
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
