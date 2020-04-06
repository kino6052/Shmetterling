import * as React from "react";
import { useSharedState, getVWString, BLUE } from "../../utils/utils";
import { Spacer } from "../Spacer";
import {
  CurrentVideoSubject,
  PlayListSubject,
} from "../../services/DataService";
import { IsPlayingSubject } from "../../services/PlayerService";
import { RightDrawer } from "../../services/DrawerService";
import { DrawerWrapper } from "./Drawer";
import { ListContainer } from "../List";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import { FullscreenExitOutlined, FullscreenOutlined } from "@material-ui/icons";

const BandListDrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 56.25vw;
  padding: ${getVWString(38)} ${getVWString(86)};
  box-sizing: border-box;
  h4 {
    margin: 0;
    font-weight: bold;
    color: white;
    font-size: ${getVWString(24)};
    line-height: ${getVWString(28)};
    margin-bottom: ${getVWString(12)};
  }
  h1 {
    margin: 0;
    color: ${BLUE};
    font-size: ${getVWString(48)};
    line-height: ${getVWString(52)};
    margin-bottom: ${getVWString(38)};
  }
  .full-screen {
    color: white;
    height: ${getVWString(102)};
    width: ${getVWString(102)};
    padding: 0;
    svg {
      font-size: ${getVWString(102)};
    }
  }
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`;

export const BandListDrawer: React.SFC = () => {
  const [currentVideo] = useSharedState(CurrentVideoSubject);
  const [isPlaying] = useSharedState(IsPlayingSubject);
  const [playList] = useSharedState(PlayListSubject);
  const [x] = useSharedState(RightDrawer.position);
  const num = playList.length;
  return (
    <DrawerWrapper x={x} time={RightDrawer.time}>
      <BandListDrawerWrapper>
        <TopWrapper>
          <h4>Your Band List</h4>
          <h1>
            {num} Band{num !== 1 && "s"}
          </h1>
        </TopWrapper>
        <ListContainer items={playList} />
        <IconButton classes={{ root: "full-screen" }} aria-label="Full-screen">
          <FullscreenOutlined />
        </IconButton>
      </BandListDrawerWrapper>
    </DrawerWrapper>
  );
};
