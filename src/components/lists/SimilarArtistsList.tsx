import * as React from "react";
import { IListItem, ListContainerWrapper, ListItem } from "../List";
import { Add } from "@material-ui/icons";
import { AddBandSubject, IsFetchingSubject } from "../../services/DataService";
import { CircularProgress } from "@material-ui/core";
import { useSharedState } from "../../utils/utils";

export const SimilarArtistsList: React.SFC<{
  heading?: string;
  items: IListItem[];
}> = (props) => {
  const { items = [], heading = "" } = props;
  const [isLoading] = useSharedState(IsFetchingSubject);
  return (
    <ListContainerWrapper items={items}>
      {heading && <h4>{heading}</h4>}
      <div className="container">
        {isLoading && <CircularProgress classes={{ root: "loader" }} />}
        {items.map((band) => (
          <ListItem band={band} description="">
            <Add
              onClick={(e) => {
                AddBandSubject.next(band);
              }}
            />
          </ListItem>
        ))}
      </div>
    </ListContainerWrapper>
  );
};
