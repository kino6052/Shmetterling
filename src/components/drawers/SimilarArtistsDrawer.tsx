import * as React from "react";
import styled from "styled-components";
import { RelatedArtistsSubject } from "../../services/DataService";
import { SimilarBandsDrawer } from "../../services/DrawerService";
import { Route } from "../../services/RouteService";
import { BLUE, getVWString, useSharedState } from "../../utils/utils";
import { Controls } from "../Controls";
import { SimilarArtistsList } from "../lists/SimilarArtistsList";
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

export const SimilarArtistsDrawer: React.SFC = () => {
  const [[selectedArtist, similarArtists]] = useSharedState(
    RelatedArtistsSubject
  );
  const [x] = useSharedState(SimilarBandsDrawer.position);
  return (
    <DrawerWrapper x={x} time={SimilarBandsDrawer.time}>
      <MainDrawerWrapper>
        <Logo />
        <CurrentBandWrapper>
          <p>Bands similar to</p>
          <h1>{selectedArtist}</h1>
        </CurrentBandWrapper>
        <SimilarArtistsList items={similarArtists} />
        <Controls route={Route.Similar} />
      </MainDrawerWrapper>
    </DrawerWrapper>
  );
};
