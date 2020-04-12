import * as React from "react";
import { useSharedState, getVWString, BLUE } from "../../utils/utils";
import { Spacer } from "../Spacer";
import {
  CurrentVideoSubject,
  PlayListSubject,
} from "../../services/DataService";
import { IsPlayingSubject } from "../../services/PlayerService";
import { CurrentPlaylistDrawer } from "../../services/DrawerService";
import { DrawerWrapper } from "./Drawer";
import { ListContainer } from "../lists/CurrentBandsList";
import styled from "styled-components";
import { IconButton, Grid, Slider } from "@material-ui/core";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  AddOutlined,
  VolumeDown,
  VolumeUp,
} from "@material-ui/icons";
import { RouteSubject, Route } from "../../services/RouteService";
import { _Menu } from "../lists/CurrentBandsList";
import { VolumeSubject } from "../../services/YouTubeService";

const BandListDrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 56.25vw;
  padding: ${() => getVWString(38)} ${() => getVWString(86)};
  box-sizing: border-box;
  h4 {
    margin: 0;
    font-weight: bold;
    color: white;
    font-size: ${() => getVWString(24)};
    line-height: ${() => getVWString(28)};
    margin-bottom: ${() => getVWString(12)};
  }
  h1 {
    margin: 0;
    color: ${BLUE};
    font-size: ${() => getVWString(48)};
    line-height: ${() => getVWString(52)};
    margin-bottom: ${() => getVWString(38)};
  }
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`;

export const AddButton = styled.button`
  box-sizing: border-box;
  margin: 0 ${() => getVWString(16)} ${() => getVWString(8)} 0;
  width: ${() => getVWString(501.97)};
  height: ${() => getVWString(81.66)};
  border: ${() => getVWString(2)} dashed white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  background-blend-mode: overlay;
  &:hover {
    // transform: scale(1.1);
  }
  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .add {
      margin-right: ${() => getVWString(8)};
      svg {
        color: white;
        height: ${() => getVWString(18)};
        width: ${() => getVWString(18)};
        font-size: ${() => getVWString(18)};
      }
    }
    h4 {
      margin: 0;
      color: white;
      font-size: ${() => getVWString(18)};
      line-height: ${() => getVWString(21)};
    }
    p {
      margin: 0;
      color: ${BLUE};
      font-size: ${() => getVWString(12)};
      line-height: ${() => getVWString(14)};
      font-weight: bold;
    }
  }
  .extra {
    font-size: ${() => getVWString(16)};
  }
`;

export const ControlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: ${() => getVWString(487)};
  justify-content: space-between;
  .volume {
    width: ${() => getVWString(190)};
  }
  .full-screen {
    color: white;
    height: ${() => getVWString(102)};
    width: ${() => getVWString(102)};
    padding: 0;
    svg {
      font-size: ${() => getVWString(102)};
    }
  }
`;

export const BandListDrawer: React.SFC = () => {
  const [currentVideo] = useSharedState(CurrentVideoSubject);
  const [volume] = useSharedState(VolumeSubject);
  const [playList] = useSharedState(PlayListSubject);
  const [x] = useSharedState(CurrentPlaylistDrawer.position);
  const num = playList.length;
  return (
    <DrawerWrapper x={x} time={CurrentPlaylistDrawer.time}>
      <BandListDrawerWrapper>
        <TopWrapper>
          <h4>Your Band List</h4>
          <h1>
            {num} Band{num !== 1 && "s"}
          </h1>
        </TopWrapper>
        <AddButton onClick={() => RouteSubject.next(Route.Add)}>
          <div className="content">
            <IconButton className="add">
              <AddOutlined />
            </IconButton>
            <h4>Add Band</h4>
          </div>
        </AddButton>
        <ListContainer items={playList} />
        <ControlWrapper>
          <Grid container spacing={2} classes={{ root: "volume" }}>
            <Grid item>
              <VolumeDown />
            </Grid>
            <Grid item xs>
              <Slider
                value={volume}
                onChange={(_, v) => VolumeSubject.next(v as number)}
                aria-labelledby="continuous-slider"
              />
            </Grid>
          </Grid>
          <IconButton
            classes={{ root: "full-screen" }}
            aria-label="Full-screen"
          >
            <FullscreenOutlined />
          </IconButton>
        </ControlWrapper>
      </BandListDrawerWrapper>
    </DrawerWrapper>
  );
};
