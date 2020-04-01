import styled, { css } from "styled-components";
import { getVW, BLUE } from "./utils";

export const PaneMixin = css`
  color: white;
  font-family: Roboto, sans-serif;
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
  text-align: left;
  padding: ${getVW(72)}vw;
  p {
    margin: 0;
    font-size: ${getVW(18)}vw;
  }
  h1 {
    margin: 0;
    font-size: ${getVW(64)}vw;
    max-width: ${getVW(308)}vw;
    width: 100%;
  }
  h4 {
    font-size: ${getVW(28)}vw;
    margin: 0;
  }
  .blue {
    color: ${BLUE};
  }
`;
