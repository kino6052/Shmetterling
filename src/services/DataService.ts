import { BehaviorSubject, Subject, shuffle } from "../utils/utils";
import {
  debounceTime,
  filter,
  skip,
  distinctUntilChanged,
} from "rxjs/operators";
import { InitSubject, PlayerErrorSubject } from "./YouTubeService";
import {
  NextSongSubject,
  IsPlayingSubject,
  PrevSongSubject,
} from "./PlayerService";
import { DEFAULT_DELAY } from "../constants";
import { appendToSubjectValue } from "../utils/utils";
import { RouteSubject, Route } from "./RouteService";

export interface IArtist {
  name: string;
  id: string;
  slug?: string;
}

export interface IMusicVideo {
  name: string;
  id: string;
}

export interface ICurrentVideo {
  id: string;
  song_title: string;
  name: string;
  source_data: string;
}

const MR_OIZO = { name: "Mr. Oizo", id: "6H1RjVyNruCmrBEWRbD0VZ" };

const MR_OIZO_SONGS = ["240921811081"];

const generate = () => MR_OIZO_SONGS.map((id) => ({ name: MR_OIZO.name, id }));

const DEFAULT_VIDEO: ICurrentVideo = {
  id: "",
  name: "Schmetterling",
  song_title: "Music Video Radio",
  source_data: "",
};

export const AddBandSubject = new Subject<IArtist>("AddBandSubject");
export const RemoveBandSubject = new Subject<IArtist>("RemoveBandSubject");
export const InputSubject = new BehaviorSubject<string>("");
export const ArtistSubject = new BehaviorSubject<IArtist[]>([]);
export const SelectedArtistSubject = new BehaviorSubject<string>("");
export const RelatedArtistsSubject = new BehaviorSubject<[string, IArtist[]]>([
  DEFAULT_VIDEO.name,
  [],
]);
export const PlayListSubject = new BehaviorSubject<IArtist[]>([MR_OIZO]);
export const MusicVideoSubject = new BehaviorSubject<IMusicVideo[]>(generate());
export const MusicVideoIndexSubject = new BehaviorSubject<number>(0);
export const IsFetchingSubject = new BehaviorSubject<boolean>(false);
export const ErrorSubject = new Subject<string>();
export const CurrentVideoSubject = new BehaviorSubject(DEFAULT_VIDEO);

export const searchArtist = (query: string) => {
  ArtistSubject.next([]);
  // RelatedArtistsSubject.next([DEFAULT_VIDEO.name, []]);
  if (!query) return;
  IsFetchingSubject.next(true);
  fetch(`/artist?q=${query}`)
    .then((res) => {
      return res.json();
    })
    .then(({ artist = {}, matchingArtists = [], relatedArtists = [] }) => {
      IsFetchingSubject.next(false);
      if (JSON.stringify(artist) === "{}") return;
      ArtistSubject.next([artist, ...matchingArtists]);
      const [curArtist] = RelatedArtistsSubject.getValue();
      RelatedArtistsSubject.next([curArtist, relatedArtists]);
    })
    .catch((e) => {
      ErrorSubject.next(e.toString());
      IsFetchingSubject.next(false);
    });
};

export const getIndex = (videos: IMusicVideo[], value: number) => {
  if (!videos || !videos.length) return;
  const currentIndex = MusicVideoIndexSubject.getValue();
  const index = (videos.length + (currentIndex + value)) % videos.length;
  MusicVideoIndexSubject.next(index);
};

export const getVideoDataForMusicVideoId = (musicVideoId: string) => {
  fetch(`/link?id=${musicVideoId}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      CurrentVideoSubject.next(data as ICurrentVideo);
    })
    .catch((e) => {
      ErrorSubject.next(e.toString());
    });
};

export const getMusicVideos = async (band: IArtist): Promise<IMusicVideo[]> =>
  fetch(`/artist/${band.name}`)
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      ErrorSubject.next(e.toString());
    });

export const addMusicVideos = (musicVideos: IMusicVideo[]) => {
  const currentVideos = MusicVideoSubject.getValue();
  MusicVideoSubject.next(shuffle([...currentVideos, ...musicVideos]));
};

export const removeMusicVideosByBand = (band: IArtist) => {
  const musicVideos = MusicVideoSubject.getValue();
  console.warn();
  MusicVideoSubject.next(
    musicVideos.filter(
      ({ name }) => band.name.toLowerCase() !== name.toLowerCase()
    )
  );
};

export const removeMusicVideosById = (musicVideoId: string) => {
  const musicVideos = MusicVideoSubject.getValue();
  MusicVideoSubject.next(musicVideos.filter(({ id }) => id !== musicVideoId));
};

export const removeBand = (band: IArtist) => {
  const artists = PlayListSubject.getValue();
  PlayListSubject.next(
    artists.filter(({ name }) => band.name.toLowerCase() !== name.toLowerCase())
  );
};

export const removeCurrentVideo = () => {
  const currentVideo = CurrentVideoSubject.getValue();
  if (!currentVideo) return;
  removeMusicVideosById(currentVideo.id);
};

InitSubject.subscribe(() => {
  InputSubject.pipe(skip(1), debounceTime(DEFAULT_DELAY)).subscribe((query) => {
    searchArtist(query);
  });

  AddBandSubject.subscribe(async (band) => {
    const bands = PlayListSubject.getValue();
    if (bands.map((b) => b.id).includes(band.id)) return;
    appendToSubjectValue(PlayListSubject, [band]);
    const musicVideos = await getMusicVideos(band);
    console.warn(musicVideos);
    addMusicVideos(musicVideos);
  });

  PlayerErrorSubject.pipe(skip(1)).subscribe(() => {
    removeCurrentVideo();
  });

  RemoveBandSubject.subscribe((band) => {
    removeMusicVideosByBand(band);
    removeBand(band);
  });

  NextSongSubject.subscribe(() => {
    const videos = MusicVideoSubject.getValue();
    getIndex(videos, 1);
  });

  PrevSongSubject.subscribe(() => {
    const videos = MusicVideoSubject.getValue();
    getIndex(videos, -1);
  });

  MusicVideoIndexSubject.pipe(skip(1)).subscribe((index) => {
    const videos = MusicVideoSubject.getValue();
    getVideoDataForMusicVideoId(videos[index].id);
  });

  ErrorSubject.subscribe((e) => {
    console.warn(e);
  });

  RouteSubject.pipe(filter((route) => route === Route.Similar)).subscribe(
    () => {
      const artist = SelectedArtistSubject.getValue();
      RelatedArtistsSubject.next([artist, []]);
      searchArtist(artist);
    }
  );

  // SelectedArtistSubject.pipe(
  //   skip(1),
  //   distinctUntilChanged(),
  //   debounceTime(DEFAULT_DELAY)
  // ).subscribe((artist) => {

  // });
});
