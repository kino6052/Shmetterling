import { Add, ArrowBack } from "@material-ui/icons";
import * as React from "react";
import styled from "styled-components";
import {
  AddBandSubject,
  ArtistSubject,
  InputSubject,
  IsFetchingSubject,
  PlayListSubject,
  RelatedArtistsSubject,
} from "../../services/DataService";
import { Route, RouteSubject } from "../../services/RouteService";
import { getVW, useSharedState } from "../../utils/utils";
import { IListItem, ListContainerWrapper, ListItem } from "../List";
import { Spacer } from "../Spacer";

const SearchScreenWrapper = styled.div<{ currentRoute: Route }>`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: center;

  .container {
    display: flex;
    flex: 1;
    box-sizing: border-box;
    margin: ${getVW(24)}vw;
    flex-direction: column;
    align-items: flex-start;
    height: ${getVW(800)}vw;
    
    h4 {
      font-size: ${getVW(24)}vw;
    }

    .arrow-back {
      font-size: ${getVW(24)}vw;
    }

    input {
      font-size: ${getVW(120)}vw;
      width: 100%;
      color: white;
      background: none;
      border: none;
      // border-bottom: ${getVW(8)}vw solid white;
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
 
`;

const BandWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${getVW(500)}vw;
`;

const BandPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  margin-right: ${getVW(24)}vw;
  .progress {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    svg {
      height: ${getVW(100)}vw;
    }
  }
`;

export const SearchListContainer: React.SFC<{
  heading: string;
  items: IListItem[];
}> = (props) => {
  const { items = [], heading = "" } = props;
  return (
    <ListContainerWrapper>
      {heading && <h4>{heading}</h4>}
      {items.map((band) => (
        <ListItem band={band}>
          <Add
            onClick={() => {
              AddBandSubject.next(band);
            }}
          />
        </ListItem>
      ))}
    </ListContainerWrapper>
  );
};

export const SearchScreenDrawer: React.SFC = () => {
  const [playlist] = useSharedState(PlayListSubject);
  const [artists] = useSharedState(ArtistSubject);
  const [similarArtists] = useSharedState(RelatedArtistsSubject);
  const [isFetching] = useSharedState(IsFetchingSubject);
  const [route] = useSharedState(RouteSubject);
  const hasSimilarArtists = similarArtists.length > 0;
  return (
    <SearchScreenWrapper currentRoute={route}>
      <div className="container">
        <h4 className="blue" onClick={() => RouteSubject.next(Route.Main)}>
          Schmetterling{" "}
          <span>
            <ArrowBack classes={{ root: "arrow-back" }} />
          </span>
        </h4>
        <Spacer height={70} />
        <input
          placeholder="Enter Band Name"
          onChange={({ target: { value } }) => {
            InputSubject.next(value);
          }}
        />
        <Spacer height={70} />
        <BandWrapper>
          {/* <BandPanelWrapper>
            {isFetching && <CircularProgress classes={{ root: "progress" }} />}
            {!isFetching && (
              <SearchListContainer heading="Bands" items={artists} />
            )}
          </BandPanelWrapper> */}
        </BandWrapper>
      </div>
      <div className="container">
        {/* <h4 className="blue" onClick={() => RouteSubject.next(Route.Main)}>
          Current Playlist
        </h4> */}
        <Spacer height={70} />
        <BandWrapper>
          <BandPanelWrapper>
            {/* {isFetching && <CircularProgress classes={{ root: "progress" }} />}
            {!isFetching && (
              <SearchListContainer heading="Bands" items={artists} />
            )} */}
            {/* <ListContainer items={playlist} /> */}
            {/* {!isFetching && (
              <SearchListContainer
                heading="Similar Bands"
                items={similarArtists}
              />
            )} */}
          </BandPanelWrapper>
        </BandWrapper>
      </div>
    </SearchScreenWrapper>
  );
};