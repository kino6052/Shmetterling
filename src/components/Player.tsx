import * as React from "react";
import styled, { css } from "styled-components";
import { Overlay } from "./Menus";
import { useSharedState } from "../utils/utils";
import { IsLoadingSubject } from "../services/PlayerService";
import CircularProgress from "@material-ui/core/CircularProgress";

const PlayerWrapper = styled.div<{ isLoading: boolean }>`
  width: 100%;
  height: 100vh;
  #player {
    display: flex;
    position: fixed;
    flex-direction: row;
    z-index: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    ${({ isLoading }) =>
      isLoading &&
      css`
        filter: blur(100px);
        transform: scale(2);
      `}
  }
`;

export const Player: React.SFC = (props) => {
  const [isLoading] = useSharedState(IsLoadingSubject);
  return (
    <PlayerWrapper isLoading={isLoading}>
      <Overlay />
      <div id="player">Player One</div>
    </PlayerWrapper>
  );
};
