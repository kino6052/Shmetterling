import * as React from "react";
import styled from "styled-components";
import { PaneMixin } from "./Menus";

const SearchScreenWrapper = styled.div`
  ${PaneMixin}
  width: 100%;
  .arrow-back {
    font-size: ${getVW(24)}vw;
  }
  input {
    font-size: ${getVW(64)}vw;
    width: ${getVW(1000)}vw;
    color: white;
    background: none;
    border: none;
    border-bottom: 2px solid white;
  }
`;

const BandWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const BandPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${getVW(500)}vw;
  height: ${getVW(300)}vw;
  margin-right: ${getVW(24)}vw;
  overflow-y: scroll;
`;

const SearchScreen: React.SFC = props => {
  const [playlist] = useSharedState(PlayListSubject);
  const [artists] = useSharedState(ArtistSubject);
  const [similarArtists] = useSharedState(SimilarArtistsSubject);
  return (
    <SearchScreenWrapper {...props}>
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
        <BandPanelWrapper>
          <SearchListContainer heading="Bands" items={artists} />
          <SearchListContainer heading="Similar Bands" items={similarArtists} />
        </BandPanelWrapper>
        <BandPanelWrapper>
          <ListContainer heading="Current Playlist" items={playlist} />
        </BandPanelWrapper>
      </BandWrapper>
    </SearchScreenWrapper>
  );
};
