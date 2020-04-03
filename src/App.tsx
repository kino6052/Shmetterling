import * as React from "react";
import "./styles.css";
import { useYouTubeScript } from "./services/YouTubeService";
import { Player } from "./components/Player";

export default function App() {
  useYouTubeScript();
  return (
    <div className="App">
      <Player />
    </div>
  );
}
