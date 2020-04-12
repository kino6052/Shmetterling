const fetch = require("node-fetch");
const btoa = require("btoa");
const express = require("express");
const { BehaviorSubject } = require("rxjs");

const app = express();

app.use("/", express.static("./build"));

app.listen(process.env.PORT || "8080", () => console.warn("App is listening"));

const SPOTIFY_AUTH = `Basic ${btoa(
  "ca5e86225bcf4416b89dbf42fbc4e8a0:5894a1705f8046919e96c8130440ed80"
)}`;

const MUSIC_VIDEO_AUTH = "y261ObFJtcoav1XFteSZ1elCZfQeMwq1TBjH6enk";

const AccessTokenSubject = new BehaviorSubject(undefined);

const getNewToken = async () => {
  console.warn("fetching access token");
  const { access_token, expires_in } = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: SPOTIFY_AUTH,
        Accept: "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((e) => console.warn(e));
  if (!access_token) throw new Error("No Access Token Returned");
  setTimeout(() => {
    AccessTokenSubject.next(undefined);
  }, expires_in);
  return access_token;
};

const getToken = async () =>
  AccessTokenSubject.getValue() || (await getNewToken());

const searchArtist = async (artistQuery) => {
  const token = await getToken();
  console.warn("searching artist ", artistQuery);
  const relatedArtistsResult = await fetch(
    `https://api.spotify.com/v1/search?q=${artistQuery}&type=artist&limit=10`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json());
  const { artists: { items } = {} } = relatedArtistsResult;
  return items.map(({ id, name }) => ({ id, name }));
};

const getRelatedArtists = async (artistId) => {
  // https://api.spotify.com/v1/artists/7bu3H8JO7d0UbMoVzbo70s/related-artists
  const token = await getToken();
  const { artists = [] } = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/related-artists`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((res) => res.json());
  return artists.map(({ id, name }) => ({ id, name }));
};

const getMusicVideos = async (artistName) => {
  const name = encodeURIComponent(artistName);
  console.warn(name);
  const { results = [] } = await fetch(
    `http://imvdb.com/api/v1/search/videos?q=${name}`,
    {
      headers: {
        "IMVDB-APP-KEY": MUSIC_VIDEO_AUTH,
        Accept: "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((res) => []);
  const songs = results
    .map(({ id, artists: [{ name, slug }] }) => ({ id, name, slug }))
    .filter(({ name = "" }) => name.toLowerCase() === artistName.toLowerCase());
  return songs;
};

const getArtistsMusicVideoId = async (artistName) => {
  console.warn("Get Artists Music Videos", artistName);
  const songs = getMusicVideos();
  const r = [];
  for (let i = 0; i < 2; i++) {
    const musicVideo = await getYouTubeUrlForVideo(songs[i].id);
    if (musicVideo && musicVideo.length) r.push(musicVideo);
  }
  return r;
};

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const getYouTubeUrlForVideo = async (videoId) => {
  console.warn(videoId);
  const response = await fetch(
    `http://imvdb.com/api/v1/video/${videoId}?include=sources`,
    {
      headers: {
        "IMVDB-APP-KEY": MUSIC_VIDEO_AUTH,
        Accept: "application/json",
      },
    }
  ).then((res) => res.json());
  const {
    id,
    song_title,
    artists: [{ name }],
    sources: [{ source_data }],
  } = response;
  return { id, song_title, name, source_data };
};

const getArtistQuery = (req) => {
  const { query: { q = "" } = {} } = req || {};
  return q;
};

const getMusicVideoId = (req) => {
  const { query: { id = "" } = {} } = req || {};
  return id;
};

const getArtistName = (req) => {
  const { params: { name = "" } = {} } = req || {};
  return name;
};

app.get("/artist/:name", async (req, res) => {
  const name = getArtistName(req);
  let musicVideosOriginal = await getMusicVideos(name);
  musicVideos = shuffle(musicVideosOriginal);
  res.send(musicVideos);
});

app.get("/artist", async (req, res) => {
  const artistQuery = getArtistQuery(req);
  const [{ name, id }, ...matchingArtists] = await searchArtist(artistQuery);
  const artist = { name, id };
  const relatedArtists = await getRelatedArtists(id);
  res.send({ artist, matchingArtists, relatedArtists });
});

app.get("/link", async (req, res) => {
  const musicVideoId = getMusicVideoId(req);
  const link = await getYouTubeUrlForVideo(musicVideoId);
  res.send(link);
});
