import * as React from "react";
import styled from "styled-components";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Send, Drafts, Delete, Search } from "@material-ui/icons";
import { BehaviorSubject } from "rxjs";
import { useSharedState } from "../../utils/utils";
import { ShouldShowMenuSubject } from "../../services/PlayerService";
import { ListContainerWrapper, IListItem, ListItem } from "../List";
import { MouseCoordinateSubject } from "../../services/DOMService";
import { RouteSubject, Route } from "../../services/RouteService";
import { SelectedArtistSubject } from "../../services/DataService";

export const MenuSubject = new BehaviorSubject<unknown>(null);
export const CurrentCoordinateSubject = new BehaviorSubject<[number, number]>([
  0,
  0,
]);

MenuSubject.subscribe((e) => {
  // @ts-ignore
  if (!e || !e.currentTarget) return;
  const [x, y] = MouseCoordinateSubject.getValue();
  CurrentCoordinateSubject.next([x, y]);
});

export const _Menu: React.SFC = () => {
  const [e] = useSharedState(MenuSubject);
  const [[x, y]] = useSharedState(CurrentCoordinateSubject);
  const [isOpen, setIsOpen] = React.useState(false);
  const [shouldShowMenu] = useSharedState(ShouldShowMenuSubject);
  // @ts-ignore
  if (!isOpen && e && e.currentTarget && shouldShowMenu) {
    setIsOpen(true);
  } else if (!shouldShowMenu && isOpen) setIsOpen(false);
  return (
    <Menu
      elevation={0}
      anchorPosition={{ top: y, left: x }}
      anchorReference={"anchorPosition"}
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        MenuSubject.next(null);
      }}
    >
      <MenuItem
        onClick={() => {
          RouteSubject.next(Route.Similar);
        }}
      >
        <ListItemIcon>
          <Search fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Find Similar Bands" />
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Remove" />
      </MenuItem>
    </Menu>
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
      <_Menu />
      {items.map((band) => (
        <ListItem band={band} description="3 songs">
          <Delete
            onClick={(e) => {
              MenuSubject.next(e);
              SelectedArtistSubject.next(band.name);
            }}
          />
        </ListItem>
      ))}
    </ListContainerWrapper>
  );
};
