import * as React from "react";
import { Snackbar as __Snackbar } from "@material-ui/core";
import { useSharedState } from "../utils/utils";
import { ErrorSubject } from "../services/DataService";

export const Snackbar: React.SFC = () => {
  const [message] = useSharedState(ErrorSubject);
  const isOpen = !!message;
  return (
    <__Snackbar
      message={message}
      open={isOpen}
      autoHideDuration={6000}
      onClose={() => ErrorSubject.next("")}
    />
  );
};
