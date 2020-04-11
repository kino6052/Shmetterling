import styled from "styled-components";
import { getVWString } from "../utils/utils";

export const Spacer = styled.div<{ height: number }>`
  display: flex;
  width: 100%;
  /* background-color: red; */
  height: ${({ height }) => {
    return () => getVWString(height);
  }};
`;
