import { BehaviorSubject, Subject } from "rxjs";
import { InitSubject, PlayerRefSubject } from "./YouTubeService";
import {
  MusicVideoSubject,
  CurrentVideoSubject,
  ICurrentVideo,
} from "./DataService";
import { skip } from "rxjs/operators";

export const IsPlayingSubject = new BehaviorSubject<boolean>(true);
export const NextSongSubject = new Subject();
export const PrevSongSubject = new Subject();

export const pause = () => {
  const [player] = PlayerRefSubject.getValue();
  player.pauseVideo();
};

export const play = () => {
  const [player] = PlayerRefSubject.getValue();
  player.playVideo();
};

const playNext = () => {
  IsPlayingSubject.next(true);
  const videos = MusicVideoSubject.getValue();
  if (!videos || !videos.length) return;
  const index = Math.round(Math.random() * (videos.length - 1));
  console.warn(index, videos[index].id);
  loadSong(videos[index].id);
};

export const loadSong = (songId: string) => {
  const isPlaying = IsPlayingSubject.getValue();
  const [player] = PlayerRefSubject.getValue();
  fetch(`/link?id=${songId}`)
    .then((res) => {
      console.warn(res);
      return res.json();
    })
    .then((data) => {
      CurrentVideoSubject.next(data as ICurrentVideo);
      player.loadVideoById(data.source_data);
      if (isPlaying) return;
      player.pauseVideo();
    });
};

InitSubject.subscribe(() => {
  NextSongSubject.subscribe(() => playNext());
  IsPlayingSubject.pipe(skip(1)).subscribe((isPlaying) => {
    isPlaying ? play() : pause();
  });
  NextSongSubject.next();
});
