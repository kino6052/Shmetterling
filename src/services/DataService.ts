import { BehaviorSubject } from "rxjs";
import { debounceTime, filter, skip } from "rxjs/operators";

export interface IArtist {
  name: string;
  id: string;
}

export interface IMusicVideo {
  artistId: string;
  id: string;
}

export interface ICurrentVideo {
  id: string;
  song_title: string;
  name: string;
  source_data: string;
}

const DEF_LEPPARD = { name: "Def Leppard", id: "6H1RjVyNruCmrBEWRbD0VZ" };

const DEF_LEPPARD_SONGS = [
  "632891194030",
  "976156654927",
  "252397807297",
  "393369892894",
  "234580981640",
  "260438454125",
  "234277966150",
  "275815992778",
  "140919029967",
  "579600524369",
  "237820987589",
  "509116109981",
  "100745487121",
  "694298539264",
  "258342676821",
  "314886745488",
  "230924447564",
  "470352069504",
  "197810592754",
  "145432423657",
  "159935133256",
  "717512434768",
  "258511131842",
  "223243586389",
  "158983824218",
];

const generate = () =>
  DEF_LEPPARD_SONGS.map((id) => ({ artistId: DEF_LEPPARD.id, id }));

export const InputSubject = new BehaviorSubject<string>("");
export const ArtistSubject = new BehaviorSubject<IArtist[]>([]);
export const SimilarArtistsSubject = new BehaviorSubject<IArtist[]>([]);
export const PlayListSubject = new BehaviorSubject<IArtist[]>([DEF_LEPPARD]);
export const MusicVideoSubject = new BehaviorSubject<IMusicVideo[]>(generate());
export const CurrentVideoSubject = new BehaviorSubject<ICurrentVideo | null>(
  null
);

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
