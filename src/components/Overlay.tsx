import * as React from "react";
import styled, { css } from "styled-components";
import { ShouldShowMenuSubject } from "../services/PlayerService";
import { useSharedState, getVWString } from "../utils/utils";
import { BandListDrawer } from "./drawers/BandListDrawer";
import { MainDrawer } from "./drawers/MainDrawer";
import { SearchScreenDrawer } from "./drawers/SearchScreenDrawer";

const OverlayWrapper = styled.div`
  width: 100vw; /* 90% of viewport vidth */
  height: ${(9 / 16) * 100}; /* ratio = 9/16 * 90 = 50.625 */
  max-height: 100vh;
  max-width: ${(16 / 9) * 100}vh; /* 16/9 * 90 = 160 */
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: 0.5s;
  color: white;
  z-index: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

export const Overlay: React.SFC = () => {
  return (
    <OverlayWrapper>
      <MainDrawer />
      <BandListDrawer />
      <SearchScreenDrawer />
    </OverlayWrapper>
  );
};
