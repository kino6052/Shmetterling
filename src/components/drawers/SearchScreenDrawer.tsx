import * as React from "react";
import styled from "styled-components";
import { ArtistSubject, InputSubject } from "../../services/DataService";
import { SearchDrawer } from "../../services/DrawerService";
import { getVWString, useSharedState } from "../../utils/utils";
import { SearchResultListContainer } from "../lists/SearchResultsList";
import { Logo } from "../Logo";
import { DrawerWrapper } from "./Drawer";
import { Route } from "../../services/RouteService";
import { Controls } from "../Controls";

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

export const SearchScreenDrawer: React.SFC = () => {
  const [artist] = useSharedState(ArtistSubject);
  const [x] = useSharedState(SearchDrawer.position);
  return (
    <DrawerWrapper x={x} time={SearchDrawer.time}>
      <MainDrawerWrapper>
        <Logo />
        <SearchWrapper>
          <input
            placeholder="Search for Band"
            onChange={({ target: { value = "" } }) => InputSubject.next(value)}
          />
        </SearchWrapper>
        <SearchResultListContainer heading="Search Results" items={artist} />
        <Controls route={Route.Add} />
      </MainDrawerWrapper>
    </DrawerWrapper>
  );
};
