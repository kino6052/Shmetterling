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
export const CurrentCoordinateSubject = new BehaviorSubject<[number, number]>([
  0,
  0,
]);

MenuSubject.subscribe((e) => {
  // @ts-ignore
  // if (!e || !e.currentTarget) return;
  // const [x, y] = MouseCoordinateSubject.getValue();
  // CurrentCoordinateSubject.next([x, y]);
});

export const _Menu: React.SFC = () => {
  const [e, setE] = useSharedState(MenuSubject);
  const [isOpen, setIsOpen] = React.useState(false);
  const [shouldShowMenu] = useSharedState(ShouldShowMenuSubject);
  // @ts-ignore
  if (!isOpen && e && e.currentTarget && shouldShowMenu) {
    setIsOpen(true);
  } else if (!shouldShowMenu && isOpen) setIsOpen(false);
  return (
    <Menu
      elevation={0}
      anchorReference={"anchorPosition"}
      classes={{ paper: "menu-paper", list: "menu-list" }}
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        MenuSubject.next(null);
      }}
    >
      <MenuItem
        onClick={() => {
          RouteSubject.next(Route.Similar);
          setE(null);
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
          setE(null);
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
