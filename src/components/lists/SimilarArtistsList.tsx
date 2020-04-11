import * as React from "react";
import { IListItem, ListContainerWrapper, ListItem } from "../List";
import { Add } from "@material-ui/icons";

export const SimilarArtistsList: React.SFC<{
  heading?: string;
  items: IListItem[];
}> = (props) => {
  const { items = [], heading = "" } = props;
  return (
    <ListContainerWrapper>
      {heading && <h4>{heading}</h4>}
      {items.map((band) => (
        <ListItem band={band} description="3 songs">
          <Add
            onClick={(e) => {
              // MenuSubject.next(e);
            }}
          />
        </ListItem>
      ))}
    </ListContainerWrapper>
  );
};
