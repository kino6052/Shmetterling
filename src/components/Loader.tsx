import * as React from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IsLoadingSubject } from "../services/PlayerService";
import { useSharedState, getVWString } from "../utils/utils";

const LoaderWrapper = styled.div<{ isLoading: boolean }>`
  display: ${({ isLoading }) => (isLoading ? "flex" : "none")};
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  .loader {
    z-index: 100;
    height: ${() => getVWString(100)}vw!important;
    width: ${() => getVWString(100)}vw!important;
    color: red;
    svg {
      height: ${() => getVWString(100)};
    }
  }
`;

export const Loader: React.SFC = () => {
  const [isLoading] = useSharedState(IsLoadingSubject);
  return (
    <LoaderWrapper isLoading={isLoading}>
      <CircularProgress classes={{ root: "loader" }} />
    </LoaderWrapper>
  );
};
