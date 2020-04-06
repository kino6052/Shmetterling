import * as React from "react";
import "./styles.css";
import { useYouTubeScript } from "./services/YouTubeService";
import { Player } from "./components/Player";
import "./services/IOService";
import { ThemeProvider } from "@material-ui/core";
import { theme } from "./utils/theme";

export default function App() {
  useYouTubeScript();
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Player />
      </ThemeProvider>
    </div>
  );
}
