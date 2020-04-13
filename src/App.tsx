import { ThemeProvider } from "@material-ui/core";
import * as React from "react";
import { Player } from "./components/Player";
import "./services/IOService";
import "./services/LocalStorageService";
import { useYouTubeScript } from "./services/YouTubeService";
import "./styles.css";
import { theme } from "./utils/theme";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { useSharedState } from "./utils/utils";
import { WindowAspectRatioSubject } from "./services/DOMService";
import { Snackbar } from "./components/Snackbar";

export default function App() {
  useYouTubeScript();
  const [scenario] = useSharedState(WindowAspectRatioSubject);
  return (
    <div className="App">
      <StyledThemeProvider theme={{ scenario }}>
        <ThemeProvider theme={theme}>
          <Player />
          <Snackbar />
        </ThemeProvider>
      </StyledThemeProvider>
    </div>
  );
}
