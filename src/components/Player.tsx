import * as React from "react";
import styled from "styled-components";
import { Overlay } from "./Menus";

const PlayerWrapper = styled.div`
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
  }
`;

export const Player: React.SFC = (props) => (
  <PlayerWrapper>
    <Overlay />
    <div id="player">Player One</div>
  </PlayerWrapper>
);
