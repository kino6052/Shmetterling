import { createMuiTheme } from "@material-ui/core";
import { BLUE } from "./utils";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: BLUE,
    },
  },
  props: {
    MuiButtonBase: {
      TouchRippleProps: {
        classes: { root: "ripple" },
      },
    },
  },
});
