import { IconButton } from "@material-ui/core";
import { MusicVideo, ReplyOutlined } from "@material-ui/icons";
import * as React from "react";
import styled from "styled-components";
import { ArtistSubject, InputSubject } from "../../services/DataService";
import { SearchDrawer } from "../../services/DrawerService";
import { Route, RouteSubject } from "../../services/RouteService";
import { BLUE, getVWString, useSharedState } from "../../utils/utils";
import { SearchResultListContainer } from "../List";
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

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: ${() => getVWString(493)};
  height: ${() => getVWString(71)};
  input {
    width: 100%;
    background: none;
    border: none;
    border-bottom: ${() => getVWString(4)} solid white;
    &::placeholder {
      color: #ffffff66;
    }
    color: white;
    font-size: ${() => getVWString(64)};
    line-height: ${() => getVWString(75)};
    font-weight: bold;
    margin: 0;
    margin-bottom: ${() => getVWString(40)};
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
  .back {
    color: white;
    svg {
      color: white;
    }
  }
`;

export const SearchScreenDrawer: React.SFC = () => {
  const [artist] = useSharedState(ArtistSubject);
  const [x] = useSharedState(SearchDrawer.position);
  return (
    <DrawerWrapper x={x} time={SearchDrawer.time}>
      <MainDrawerWrapper>
        <LogoWrapper>
          <MusicVideo classes={{ root: "logo-icon" }} />
          <h4 className="blue">Schmetterling</h4>
          <IconButton
            classes={{ root: "back" }}
            onClick={() => RouteSubject.next(Route.Main)}
          >
            <ReplyOutlined />
          </IconButton>
        </LogoWrapper>
        <SearchWrapper>
          <input
            placeholder="Search for Band"
            onChange={({ target: { value = "" } }) => InputSubject.next(value)}
          />
        </SearchWrapper>
        <SearchResultListContainer heading="Search Results" items={artist} />
      </MainDrawerWrapper>
    </DrawerWrapper>
  );
};
