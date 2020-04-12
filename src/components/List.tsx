import { Add } from "@material-ui/icons";
import * as React from "react";
import styled from "styled-components";
import { AddBandSubject } from "../services/DataService";
import { BLUE, getVWString } from "../utils/utils";

export interface IListItem {
  name: string;
  id: string;
}

export const ListContainerWrapper = styled.div<{ items?: IListItem[] }>`
  margin: 0;
  display: flex;
  flex-direction: column;
  h4 {
    margin: 0;
    margin-bottom: ${() => getVWString(24)};
    text-align: left;
  }
  .container {
    height: ${() => getVWString(274)};
    width: ${() => getVWString(512)};
    overflow-y: ${({ items }) => {
      if (items && items.length > 3) return "scroll";
      return "hidden";
    }};
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
  }
`;

export const ListItemWrapper = styled.div`
  box-sizing: border-box;
  margin: 0 ${() => getVWString(8)} ${() => getVWString(8)} 0;
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
    .loader {
      z-index: 100;
      height: ${() => getVWString(100)}!important;
      width: ${() => getVWString(100)}!important;
      color: red;
      svg {
        height: ${() => getVWString(100)};
      }
    }
  }
  .extra {
    .list-button {
      color: white;
      height: ${() => getVWString(20)};
      width: ${() => getVWString(20)};
      padding: 0;
      svg {
        font-size: ${() => getVWString(20)};
      }
    }
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
