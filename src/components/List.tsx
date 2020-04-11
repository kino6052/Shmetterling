import { Delete } from "@material-ui/icons";
import * as React from "react";
import styled from "styled-components";
import { RemoveBandSubject } from "../services/DataService";
import { BLUE, getVWString } from "../utils/utils";

export const ListContainerWrapper = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  height: ${() => getVWString(274)};
  overflow-y: scroll;
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: ${() => getVWString(8)};
    background-color: transparent;
    border-radius: ${() => getVWString(100)};
    border: 1px solid white;
  }
  &::-webkit-scrollbar-thumb {
    background-color: white;
    border-radius: ${() => getVWString(100)};
  }
  h4 {
    margin: 0;
    margin-bottom: ${() => getVWString(24)};
    text-align: left;
  }
`;

export interface IListItem {
  name: string;
  id: string;
}

export const ListItemWrapper = styled.div`
  box-sizing: border-box;
  margin: 0 ${() => getVWString(8)}vw ${() => getVWString(8)}vw 0;
  width: ${() => getVWString(501.97)};
  height: ${() => getVWString(81.66)};
  padding: ${() => getVWString(23)};
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
      font-size: ${() => getVWString(18)};
      line-height: ${() => getVWString(21)};
    }
    p {
      margin: 0;
      color: ${BLUE};
      font-size: ${() => getVWString(12)};
      line-height: ${() => getVWString(14)};
      font-weight: bold;
    }
  }
  .extra {
    font-size: ${() => getVWString(16)};
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
      {items.map((band) => (
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
