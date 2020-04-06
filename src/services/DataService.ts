import { BehaviorSubject, Subject, shuffle } from "../utils/utils";
import { debounceTime, filter, skip } from "rxjs/operators";
import { InitSubject, PlayerErrorSubject } from "./YouTubeService";
import {
  NextSongSubject,
  IsPlayingSubject,
  PrevSongSubject,
} from "./PlayerService";
import { DEFAULT_DELAY } from "../constants";
import { appendToSubjectValue } from "../utils/utils";

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

export const AddBandSubject = new Subject<IArtist>("AddBandSubject");
export const RemoveBandSubject = new Subject<IArtist>("RemoveBandSubject");
export const InputSubject = new BehaviorSubject<string>("", "InputSubject");
export const ArtistSubject = new BehaviorSubject<IArtist[]>(
  [],
  "ArtistSubject"
);
export const RelatedArtistsSubject = new BehaviorSubject<IArtist[]>(
  [],
  "RelatedArtistsSubject"
);
export const PlayListSubject = new BehaviorSubject<IArtist[]>(
  [MR_OIZO],
  "PlayListSubject"
);
export const MusicVideoSubject = new BehaviorSubject<IMusicVideo[]>(
  generate(),
  "MusicVideoSubject"
);
export const MusicVideoIndexSubject = new BehaviorSubject<number>(
  0,
  "MusicVideoIndexSubject"
);
export const CurrentVideoSubject = new BehaviorSubject<ICurrentVideo | null>(
  {
    id: "",
    name: "Schmetterling",
    song_title: "Music Video Radio",
    source_data: "",
  },
  "CurrentVideoSubject"
);
export const IsFetchingSubject = new BehaviorSubject<boolean>(
  false,
  "IsFetchingSubject"
);
export const ErrorSubject = new Subject<string>();

export const searchArtist = (query: string) => {
  ArtistSubject.next([]);
  RelatedArtistsSubject.next([]);
  if (!query) return;
  IsFetchingSubject.next(true);
  fetch(`/artist?q=${query}`)
    .then((res) => {
      return res.json();
    })
    .then(({ artist = {}, relatedArtists = [] }) => {
      IsFetchingSubject.next(false);
      if (JSON.stringify(artist) === "{}") return;
      ArtistSubject.next([artist]);
      RelatedArtistsSubject.next(relatedArtists);
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
  console.warn();
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
});
