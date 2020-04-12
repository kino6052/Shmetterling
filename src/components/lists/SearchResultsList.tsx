import * as React from "react";
import { IListItem, ListContainerWrapper, ListItem } from "../List";
import { Add } from "@material-ui/icons";
import { AddBandSubject } from "../../services/DataService";

export const SearchResultListContainer: React.SFC<{
  heading?: string;
  items: IListItem[];
}> = (props) => {
  const { items = [], heading = "" } = props;
  return (
    <ListContainerWrapper items={items}>
      {heading && <h4>{heading}</h4>}
      <div className="container">
        {items.map((band) => (
          <ListItem band={band} description="">
            <Add
              onClick={() => {
                AddBandSubject.next(band);
              }}
            />
          </ListItem>
        ))}
      </div>
    </ListContainerWrapper>
  );
};
