import * as React from "react";
import "./styles.css";
import { useYouTubeScript, Player } from "./YT";

export default function App() {
  useYouTubeScript();
  return (
    <div className="App">
      <Player />
    </div>
  );
}
