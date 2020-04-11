import * as React from "react";
import styled, { css } from "styled-components";
import { Overlay } from "./Overlay";
import { useSharedState, getVWString } from "../utils/utils";
import {
  IsLoadingSubject,
  IsPlayingSubject,
  ShouldShowMenuSubject,
} from "../services/PlayerService";
import { Loader } from "./Loader";

const PlayerWrapper = styled.div<{
  isLoading: boolean;
  isPaused: boolean;
  hasMenu: boolean;
}>`
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
    transition: filter 0.5s;
    ${({ isLoading, isPaused, hasMenu }) =>
      (isLoading || isPaused || hasMenu) &&
      css`
        filter: blur(${getVWString(40)}) brightness(0.6);
        transform: scale(1.1);
      `}
  }
`;

export const Player: React.SFC = () => {
  const [isLoading] = useSharedState(IsLoadingSubject);
  const [isPlaying] = useSharedState(IsPlayingSubject);
  const [hasMenu] = useSharedState(ShouldShowMenuSubject);
  return (
    <PlayerWrapper
      isLoading={isLoading}
      isPaused={!isPlaying}
      hasMenu={hasMenu}
    >
      <Loader />
      <Overlay />
      <div id="player">Player One</div>
    </PlayerWrapper>
  );
};
