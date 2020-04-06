import * as React from "react";
import styled from "styled-components";
import { ShouldShowMenuSubject } from "../services/PlayerService";
import { useSharedState, getVWString } from "../utils/utils";
import { BandListDrawer } from "./drawers/BandListDrawer";
import { MainDrawer } from "./drawers/MainDrawer";

const OverlayWrapper = styled.div<{ isBlurred: boolean }>`
  ${({ isBlurred }) => `
    color: white;
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    transition: 1s;
    ${
      isBlurred &&
      `
        backdrop-filter: blur(${getVWString(20)});
        background-color: rgba(0,0,0,0.5);  
      `
    }
  `}
`;

export const Overlay: React.SFC = () => {
  const [isBlurred] = useSharedState(ShouldShowMenuSubject);
  return (
    <OverlayWrapper isBlurred={isBlurred}>
      <MainDrawer />
      <BandListDrawer />
      {/* <SearchScreenDrawer /> */}
    </OverlayWrapper>
  );
};
