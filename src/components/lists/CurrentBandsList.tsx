import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Delete, MoreVert, Search } from "@material-ui/icons";
import * as React from "react";
import { BehaviorSubject } from "rxjs";
import {
  IArtist,
  MusicVideoSubject,
  RemoveBandSubject,
  SelectedArtistSubject,
} from "../../services/DataService";
import { ShouldShowMenuSubject } from "../../services/PlayerService";
import { Route, RouteSubject } from "../../services/RouteService";
import { useSharedState } from "../../utils/utils";
import { IListItem, ListContainerWrapper, ListItem } from "../List";

export const MenuSubject = new BehaviorSubject<unknown>(null);
export const IsDropdownMenuOpenSubject = new BehaviorSubject<boolean>(false);
export const CurrentCoordinateSubject = new BehaviorSubject<[number, number]>([
  0,
  0,
]);

MenuSubject.subscribe((e) => {
  // @ts-ignore
  if (!e || !e.target) return;
  // @ts-ignore
  const { x = 0, y = 0 } = e.target.getBoundingClientRect();
  CurrentCoordinateSubject.next([x, y]);
  IsDropdownMenuOpenSubject.next(true);
});

export const _Menu: React.SFC = () => {
  const [isOpen, setIsOpen] = useSharedState(IsDropdownMenuOpenSubject);
  const [x, y] = CurrentCoordinateSubject.getValue();
  return (
    <Menu
      elevation={0}
      anchorReference={"anchorPosition"}
      anchorPosition={{ left: x, top: y }}
      classes={{ paper: "menu-paper", list: "menu-list" }}
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <MenuItem
        onClick={() => {
          RouteSubject.next(Route.Similar);
          setIsOpen(false);
        }}
      >
        <ListItemIcon>
          <Search fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Find Similar Bands" />
      </MenuItem>
      <MenuItem
        onClick={() => {
          RemoveBandSubject.next();
          setIsOpen(false);
        }}
      >
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Remove" />
      </MenuItem>
    </Menu>
  );
};

const getDescriptionForBand = (band: IArtist) => {
  const musicVideos = MusicVideoSubject.getValue();
  const length = musicVideos.filter((mv) => mv.name === band.name).length;
  return `${length} videos`;
};

export const ListContainer: React.SFC<{
  heading?: string;
  items: IListItem[];
}> = (props) => {
  const { items = [], heading = "" } = props;
  return (
    <ListContainerWrapper items={items}>
      {heading && <h4>{heading}</h4>}
      <div className="container">
        {items.map((band) => (
          <ListItem band={band} description={getDescriptionForBand(band)}>
            <IconButton
              classes={{ root: "list-button" }}
              onClick={(e) => {
                MenuSubject.next(e);
                SelectedArtistSubject.next(band.name);
              }}
            >
              <MoreVert />
            </IconButton>
          </ListItem>
        ))}
      </div>
      <_Menu />
    </ListContainerWrapper>
  );
};
