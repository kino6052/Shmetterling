import { css } from "styled-components";
import { Route } from "../services/RouteService";
import { BLUE, getVWString } from "../utils/utils";

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
    padding: 0 ${() => getVWString(72)};
    p {
      margin: 0;
      font-size: ${() => getVWString(18)};
    }
    h1 {
      margin: 0;
      font-size: ${() => getVWString(64)};
      max-width: ${() => getVWString(308)};
      width: 100%;
    }
    h4 {
      font-size: ${() => getVWString(28)};
    }
    .blue {
      color: ${BLUE};
    }
  `;
};
