import { BehaviorSubject } from "rxjs";
import { filter, skip, debounce, debounceTime } from "rxjs/operators";

interface IArtist {
  name: string;
}

export const InputSubject = new BehaviorSubject<string>("");

export const ArtistSubject = new BehaviorSubject<IArtist[]>([]);
export const SimilarArtistsSubject = new BehaviorSubject<IArtist[]>([]);
export const PlayListSubject = new BehaviorSubject<IArtist[]>([]);

export const addItem = (item: IArtist) => {
  PlayListSubject.next([...PlayListSubject.getValue(), item]);
  ArtistSubject.next(
    ArtistSubject.getValue().filter(v => v.name !== item.name)
  );
  SimilarArtistsSubject.next(
    SimilarArtistsSubject.getValue().filter(v => v.name !== item.name)
  );
};

export const removeItem = (item: IArtist) => {
  PlayListSubject.next(
    PlayListSubject.getValue().filter(v => v.name !== item.name)
  );
};

export const searchArtist = (query: string): IArtist[] => {
  ArtistSubject.next([
    { name: "The Cure" },
    { name: "The Cult" },
    { name: "The Crab" }
  ]);
};

InputSubject.pipe(
  debounceTime(500),
  filter(v => v.length > 3)
).subscribe(query => {
  searchArtist(query);
});

ArtistSubject.pipe(
  skip(1),
  filter(a => !!a || a.length)
).subscribe(artists => {
  SimilarArtistsSubject.next([
    { name: "The One" },
    { name: "The Two" },
    { name: "The Three" }
  ]);
});
