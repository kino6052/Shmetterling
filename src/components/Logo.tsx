import * as React from "react";
import styled from "styled-components";
import { getVWString, BLUE } from "../utils/utils";
import { MusicVideo, ReplyOutlined } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { RouteSubject, Route } from "../services/RouteService";

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: ${() => getVWString(247)};
  h4 {
    margin: 0;
    color: white;
    font-size: ${() => getVWString(26)};
  }
  .logo-icon {
    height: ${() => getVWString(50)};
    width: ${() => getVWString(50)};
    color: ${BLUE};
    svg {
      color: ${BLUE};
      height: ${() => getVWString(50)};
      width: ${() => getVWString(50)};
    }
  }
  .back {
    color: white;
    svg {
      color: white;
    }
  }
`;

export const Logo: React.SFC = () => (
  <LogoWrapper>
    <MusicVideo classes={{ root: "logo-icon" }} />
    <h4 className="blue">Schmetterling</h4>
    <IconButton
      classes={{ root: "back" }}
      onClick={() => RouteSubject.next(Route.Main)}
    >
      <ReplyOutlined />
    </IconButton>
  </LogoWrapper>
);
