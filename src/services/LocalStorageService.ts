import {
  IArtist,
  ErrorSubject,
  IMusicVideo,
  PlayListSubject,
  MusicVideoSubject,
} from "./DataService";
import { InitSubject } from "./YouTubeService";
import { skip } from "rxjs/operators";

export enum LocalStorageKey {
  Playlist = "Playlist",
  MusicVideos = "MusicVideos",
  AreCookiesAccepted = "AreCookiesAccepted",
}

const getFromLocalStorageByKey = <T>(key: LocalStorageKey): T[] => {
  try {
    const result = JSON.parse(localStorage.getItem(key) || "");
    return result || [];
  } catch (e) {
    ErrorSubject.next(e.message);
    return ([] as unknown) as T[];
  }
};

const saveToLocalStorageByKey = <T>(key: LocalStorageKey, value: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    ErrorSubject.next(e.message);
  }
};

export const getPlaylistFromStorage = (): IArtist[] => {
  return getFromLocalStorageByKey(LocalStorageKey.Playlist);
};

export const getMusicVideosFromStorage = (): IMusicVideo[] => {
  return getFromLocalStorageByKey(LocalStorageKey.MusicVideos);
};

export const savePlaylistToStorage = (playlist: IArtist[]) => {
  saveToLocalStorageByKey(LocalStorageKey.Playlist, playlist);
};

export const saveMusicVideosToStorage = (musicVideos: IMusicVideo[]) => {
  saveToLocalStorageByKey(LocalStorageKey.MusicVideos, musicVideos);
};

export const getAreCookiesAccepted = (): boolean[] => {
  return getFromLocalStorageByKey(LocalStorageKey.AreCookiesAccepted);
};

export const saveAreCookiesAccepted = (value: boolean[]) => {
  saveToLocalStorageByKey(LocalStorageKey.AreCookiesAccepted, value);
};

export const initializePlaylist = () => {
  const pl = PlayListSubject.getValue();
  const cache = getPlaylistFromStorage();
  let playlist: IArtist[] = [];
  if (!cache.length) playlist = [...pl];
  playlist = [...playlist, ...cache];
  PlayListSubject.next(playlist);
};

export const initializeMusicVideos = () => {
  const mv = MusicVideoSubject.getValue();
  const cache = getMusicVideosFromStorage();
  let musicVideos: IMusicVideo[] = [];
  if (!cache.length) musicVideos = [...mv];
  musicVideos = [...musicVideos, ...cache];
  MusicVideoSubject.next(musicVideos);
};

InitSubject.subscribe(() => {
  initializePlaylist();
  initializeMusicVideos();

  PlayListSubject.pipe(skip(1)).subscribe((playlist) => {
    savePlaylistToStorage(playlist);
  });

  MusicVideoSubject.pipe(skip(1)).subscribe((musicVideos) => {
    saveMusicVideosToStorage(musicVideos);
  });
});
