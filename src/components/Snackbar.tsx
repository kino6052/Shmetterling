import * as React from "react";
import { Snackbar as __Snackbar } from "@material-ui/core";
import { useSharedState } from "../utils/utils";
import { NotificationSubject } from "../services/DataService";

export const Snackbar: React.SFC = () => {
  const [message] = useSharedState(NotificationSubject);
  const isOpen = !!message;
  return (
    <__Snackbar
      message={message}
      open={isOpen}
      autoHideDuration={3000}
      onClose={() => NotificationSubject.next("")}
    />
  );
};
