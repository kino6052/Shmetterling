import styled from "styled-components";
import * as React from "react";
import { getVW, getVWString, useSharedState, BLUE } from "../utils/utils";
import { Delete, FullscreenExitOutlined } from "@material-ui/icons";
import { RemoveBandSubject, MusicVideoSubject } from "../services/DataService";

export const ListContainerWrapper = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  height: ${getVWString(382)};
  overflow-y: scroll;
  &::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: ${getVW(16)}vw;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: white;
  }
  h4 {
    margin: 0;
    margin-bottom: ${getVW(24)}vw;
    text-align: left;
  }
`;

export interface IListItem {
  name: string;
  id: string;
}

export const ListItemWrapper = styled.div`
  box-sizing: border-box;
  margin: ${getVW(8)}vw 0;
  width: ${getVWString(501.97)};
  height: ${getVWString(81.66)};
  padding: ${getVWString(23)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #4d4d4d66;
  background-blend-mode: overlay;
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    h4 {
      margin: 0;
      color: white;
      font-size: ${getVWString(18)};
      line-height: ${getVWString(21)};
    }
    p {
      margin: 0;
      color: ${BLUE};
      font-size: ${getVWString(12)};
      line-height: ${getVWString(14)};
      font-weight: bold;
    }
  }
  .extra {
    font-size: ${getVW(16)}vw;
    margin: 0 ${getVW(24)}vw;
  }
`;

export const ListItem: React.SFC<{ band: IListItem; description: string }> = (
  props
) => {
  const { band: { name = "" } = {}, description, children } = props;
  return (
    <ListItemWrapper>
      <div className="content">
        <h4>{name}</h4>
        <p>{description}</p>
      </div>
      <div className="extra">{children}</div>
    </ListItemWrapper>
  );
};

export const ListContainer: React.SFC<{
  heading?: string;
  items: IListItem[];
}> = (props) => {
  const { items = [], heading = "" } = props;
  return (
    <ListContainerWrapper>
      {heading && <h4>{heading}</h4>}
      {[
        ...items,
        ...items,
        ...items,
        ...items,
        ...items,
        ...items,
        ...items,
        ...items,
      ].map((band) => (
        <ListItem band={band} description="3 songs">
          <Delete
            onClick={() => {
              RemoveBandSubject.next(band);
            }}
          />
        </ListItem>
      ))}
    </ListContainerWrapper>
  );
};
