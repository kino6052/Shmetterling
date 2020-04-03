import styled from "styled-components";
import * as React from "react";
import { getVW } from "../utils/utils";
import { removeItem } from "../services/DataService";
import { Delete } from "@material-ui/icons";

export const ListContainerWrapper = styled.div`
  margin: 0;
  /* overflow-y: scroll; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  h4 {
    margin: ${getVW(16)}vw;
  }
`;

export interface IListItem {
  name: string;
  id: string;
}

export const ListItemWrapper = styled.div`
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

export const ListItem: React.SFC<{ item: IListItem }> = (props) => {
  const { item: { name = "" } = {}, children } = props;
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
      {items.map((item) => (
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
