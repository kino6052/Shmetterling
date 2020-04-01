import { BehaviorSubject } from "rxjs";
import { filter, skip, debounce, debounceTime } from "rxjs/operators";
import { IsPlayingSubject } from "./Player";

interface IArtist {
  name: string;
  id: string;
}

interface IMusicVideo {
  artistId: string;
  id: string;
}

export const InputSubject = new BehaviorSubject<string>("");
export const ArtistSubject = new BehaviorSubject<IArtist[]>([]);
export const SimilarArtistsSubject = new BehaviorSubject<IArtist[]>([]);
export const PlayListSubject = new BehaviorSubject<IArtist[]>([]);
export const MusicVideoSubject = new BehaviorSubject<IMusicVideo[]>([]);

export const addItem = (item: IArtist) => {
  const newValue = [...PlayListSubject.getValue(), item].filter(
    (v, i, a) => a.indexOf(v) === i
  );
  PlayListSubject.next(newValue);
};

export const removeItem = (item: IArtist) => {
  PlayListSubject.next(
    PlayListSubject.getValue().filter((v) => v.name !== item.name)
  );
};

export const searchArtist = (query: string) => {
  ArtistSubject.next([
    { name: "The Cure", id: "1" },
    { name: "The Cult", id: "2" },
    { name: "The Crab", id: "3" },
  ]);
};

InputSubject.pipe(
  debounceTime(500),
  filter((v) => v.length > 3)
).subscribe((query) => {
  searchArtist(query);
});

ArtistSubject.pipe(
  skip(1),
  filter((a) => !!a)
).subscribe((artists) => {
  SimilarArtistsSubject.next([
    { name: "The One", id: "4" },
    { name: "The Two", id: "5" },
    { name: "The Three", id: "6" },
  ]);
});

PlayListSubject.pipe(skip(1)).subscribe((playlist) => {
  MusicVideoSubject.next(playlist.map((p) => ({ artistId: p.id, id: "1" })));
});
