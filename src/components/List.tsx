import styled from "styled-components";
import * as React from "react";
import { getVW, getVWString } from "../utils/utils";
import { Delete, FullscreenExitOutlined } from "@material-ui/icons";
import { RemoveBandSubject } from "../services/DataService";

export const ListContainerWrapper = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${getVWString(382)};
  overflow-y: scroll;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
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
  padding: ${getVW(36)}vw;
  margin: ${getVW(16)}vw 0;
  width: ${getVWString(502)};
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

export const ListItem: React.SFC<{ band: IListItem }> = (props) => {
  const { band: { name = "" } = {}, children } = props;
  return (
    <ListItemWrapper>
      <h4>{name}</h4>
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
      {items.map((band) => (
        <ListItem band={band}>
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
