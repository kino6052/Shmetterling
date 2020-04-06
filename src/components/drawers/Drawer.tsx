import * as React from "react";
import styled from "styled-components";

export const DrawerWrapper = styled.div<{ x: number; time: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  transform: translateX(${({ x }) => 2 * x}%);
  transition: ${({ time: speed }) => speed}s;
  transition-timing-function: ease-in-out;
`;
