import * as React from "react";
import { Snackbar as __Snackbar, Button } from "@material-ui/core";
import {
  getAreCookiesAccepted,
  saveAreCookiesAccepted,
} from "../services/LocalStorageService";

const MESSAGE =
  "We use Google Analytics. By using this website you consent to use cookies.";

export const ConsentModal: React.SFC = () => {
  const [init = false] = getAreCookiesAccepted();
  const [areCookiesAccepted, setAreCookiesAccepted] = React.useState(init);
  return (
    <__Snackbar
      message={MESSAGE}
      open={!areCookiesAccepted}
      action={
        <Button
          color="primary"
          size="small"
          onClick={() => {
            saveAreCookiesAccepted([true]);
            setAreCookiesAccepted(true);
          }}
        >
          OK
        </Button>
      }
      onClose={() => {
        saveAreCookiesAccepted([true]);
        setAreCookiesAccepted(true);
      }}
    />
  );
};
