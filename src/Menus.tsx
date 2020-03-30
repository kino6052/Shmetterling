import * as React from "react";
import styled, { css } from "styled-components";
import { getVW, useSharedState } from "./utils";
import {
  PlayListSubject,
  addItem,
  removeItem,
  ArtistSubject,
  SimilarArtistsSubject,
  InputSubject
} from "./DataService";
import { BehaviorSubject } from "rxjs";
import {
  FastForward,
  FastRewind,
  PlayArrow,
  Pause,
  ArrowBack,
  Delete,
  Add
} from "@material-ui/icons";

const OverlayWrapper = styled.div`
  color: white;
  position: absolute;
  z-index: 1;
  width: 82.99vw;
  height: 46.67vw;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  /* #slide {
    margin-left: -25vw;
  } */
`;

enum Route {
  Main = "main",
  Add = "add"
}

export const RouteSubject = new BehaviorSubject<Route>(Route.Main);

export const MARGIN = getVW(597);

export const BLUE = "#26BEFF";

export const ZERO = 5;

export const PaneMixin = css`
  color: white;
  font-family: Roboto, sans-serif;
  position: absolute;
  flex-direction: column;
  display: flex;
  margin: ${getVW(72)}vw;
  width: ${getVW(597)}vw;
  height: 100%;
  text-align: left;
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

const PaneWrapper = styled.div<{ position: "right" | "left" }>`
  ${PaneMixin}
  ${({ position }) => {
    const isLeft = position === "left";
    const l = css`
      left: 0;
      align-items: flex-start;
      text-align: left;
    `;
    const r = css`
      right: 0;
      align-items: flex-end;
      text-align: right;
    `;
    return isLeft ? l : r;
  }}

  &.in {
    animation: ${({ position }) =>
        position === "left" ? "in-left" : "in-right"}
      0.5s forwards;
  }

  &.out {
    animation: ${({ position }) =>
        position === "left" ? "out-left" : "out-right"}
      0.5s forwards;
  }

  @keyframes in-left {
    0% {
      margin-left: -${MARGIN}vw;
    }
    100% {
      margin-left: ${ZERO};
    }
  }

  @keyframes out-left {
    0% {
      margin-left: ${ZERO};
    }
    100% {
      margin-left: -${MARGIN}vw;
    }
  }

  @keyframes in-right {
    0% {
      margin-right: -${MARGIN}vw;
    }
    100% {
      margin-right: ${ZERO};
    }
  }

  @keyframes out-right {
    0% {
      margin-right: ${ZERO};
    }
    100% {
      margin-right: -${MARGIN}vw;
    }
  }
`;

const Spacer = styled.div`
  display: flex;
  width: 100%;
  /* background-color: red; */
  height: ${({ height }) => {
    return getVW(height);
  }}vw;
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  .icon {
    font-size: ${getVW(102)}vw;
  }
`;

const LeftPane: React.SFC = props => {
  return (
    <PaneWrapper id="slide" {...props}>
      <h4 className="blue">Schmetterling</h4>
      <Spacer height={70} />
      <p>You're watching</p>
      <h1>London Grammar</h1>
      <h4 className="blue">Non-believer</h4>
      <Spacer height={70} />
      <ControlsWrapper>
        <FastRewind classes={{ root: "icon" }} />
        <Pause classes={{ root: "icon" }} />
        <FastForward classes={{ root: "icon" }} />
      </ControlsWrapper>
    </PaneWrapper>
  );
};

const ListContainerWrapper = styled.div`
  margin: 0;
  /* overflow-y: scroll; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  h4 {
    margin: ${getVW(16)}vw;
  }
`;

interface IListItem {
  name: string;
}

const ListItemWrapper = styled.div`
  height: ${getVW(68)}vw;
  margin: ${getVW(16)}vw 0;
  width: ${getVW(418)}vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  p,
  h4 {
    margin: 0 ${getVW(24)}vw;
    font-size: ${getVW(16)}vw;
  }
  .extra {
    font-size: ${getVW(16)}vw;
    margin: 0 ${getVW(24)}vw;
  }
`;

const ListItem: React.SFC<{ item: IListItem }> = props => {
  const { item: { name = "" } = {}, children } = props;
  return (
    <ListItemWrapper>
      <h4>{name}</h4>
      <div className="extra">{children}</div>
    </ListItemWrapper>
  );
};

const ListContainer: React.SFC<{
  heading: string;
  items: IListItem[];
}> = props => {
  const { items = [], heading = "" } = props;
  return (
    <ListContainerWrapper>
      {heading && <h4>{heading}</h4>}
      {items.map(item => (
        <ListItem item={item}>
          <Delete
            onClick={() => {
              removeItem(item);
            }}
          />
        </ListItem>
      ))}
    </ListContainerWrapper>
  );
};

const SearchListContainer: React.SFC<{
  heading: string;
  items: IListItem[];
}> = props => {
  const { items = [], heading = "" } = props;
  return (
    <ListContainerWrapper>
      {heading && <h4>{heading}</h4>}
      {items.map(item => (
        <ListItem item={item}>
          <Add
            onClick={() => {
              addItem(item);
            }}
          />
        </ListItem>
      ))}
    </ListContainerWrapper>
  );
};

const RightPane: React.SFC = props => {
  const [playList] = useSharedState(PlayListSubject);
  return (
    <PaneWrapper position="right" {...props}>
      <h4>Your Band List</h4>
      <h1>
        <span class="blue" onClick={() => RouteSubject.next(Route.Add)}>
          +
        </span>{" "}
        {playList.length} Bands
      </h1>
      <Spacer height={70} />
      <ListContainer items={playList} />
    </PaneWrapper>
  );
};

export const Overlay: React.SFC = props => {
  const [isIn, setIsIn] = React.useState(false);
  const [route] = useSharedState(RouteSubject);
  const className = isIn ? "in" : "out";
  const isMain = route === Route.Main;
  const isAdd = route === Route.Add;
  console.warn(isIn);
  return (
    <OverlayWrapper
      onMouseEnter={() => {
        setIsIn(true);
      }}
      onMouseLeave={() => {
        setIsIn(false);
      }}
    >
      {isMain && (
        <React.Fragment>
          <LeftPane position="left" className={className} />
          <RightPane position="right" className={className} />
        </React.Fragment>
      )}
      {isAdd && (
        <React.Fragment>
          <SearchScreen />
          {/* <div onClick={() => RouteSubject.next(Route.Main)}>Back</div> */}
        </React.Fragment>
      )}
    </OverlayWrapper>
  );
};
