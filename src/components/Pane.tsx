import styled, { css } from "styled-components";
import { getVW, BLUE } from "../utils/utils";
import { RouteSubject, Route } from "../services/RouteService";

export const getPaneMixin = (currentRoute: Route, route: Route) => {
  const isSameRoute = route === currentRoute;
  const opacity = isSameRoute ? "1" : "0";
  const zIndex = isSameRoute ? "1" : "-1";
  const scale = isSameRoute ? "1" : "2";
  const width = currentRoute === Route.Add ? "100%" : "50%";
  console.warn(currentRoute, route, opacity, zIndex);
  return css`
    opacity: ${opacity};
    z-index: ${zIndex};
    transform: scale(${scale});
    position: absolute;
    box-sizing: border-box;
    top: 0;
    display: flex;
    transition-timing-function: ease-in;
    flex-direction: column;
    justify-content: center;
    color: white;
    font-family: Roboto, sans-serif;
    width: ${width};
    height: 100%;
    text-align: left;
    padding: 0 ${getVW(72)}vw;
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
    }
    .blue {
      color: ${BLUE};
    }
  `;
};
