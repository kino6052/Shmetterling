const fetch = require('node-fetch');
const btoa = require('btoa');
const express = require('express');
const { BehaviorSubject } = require('rxjs');

const app = express();

app.use('/', express.static('.'))

app.listen('8080', () => console.warn('App is listening'))

const SPOTIFY_AUTH = `Basic ${btoa("ca5e86225bcf4416b89dbf42fbc4e8a0:5894a1705f8046919e96c8130440ed80")}`

const MUSIC_VIDEO_AUTH = 'y261ObFJtcoav1XFteSZ1elCZfQeMwq1TBjH6enk'

console.warn(SPOTIFY_AUTH)

const AccessTokenSubject = new BehaviorSubject(undefined);

const getNewToken = async () => {
  console.warn('fetching access token')
  const { access_token, expires_in } = await fetch('https://accounts.spotify.com/api/token', {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded',
      Authorization: SPOTIFY_AUTH,
      Accept: 'application/json'
    }
  })
  .then(res => res.json())
  .catch(e => console.warn(e))
  if (!access_token) throw new Error('No Access Token Returned')
  setTimeout(() => {
    AccessTokenSubject.next(undefined);
  }, expires_in)
  return access_token;
}

const getToken = async () => AccessTokenSubject.getValue() || await getNewToken();

const searchArtist = async (artistQuery) => {
  const token = await getToken();
  console.warn('searching artist ', artistQuery)
  const result = await fetch(`https://api.spotify.com/v1/search?q=${artistQuery}&type=artist&limit=10`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json())
  const { artists: {
    items: [{ id, name }] = [{}]
   } = {}
  } = result;
  return { name, id };
}

const getRelatedArtists = async (artistId) => {
  // https://api.spotify.com/v1/artists/7bu3H8JO7d0UbMoVzbo70s/related-artists
  const token = await getToken();
  const { artists = [] } = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.json())
  return artists.map(({ id, name }) => ({ id, name }))
}

const getMusicVideos = async (artistName) => {
  const { results = [] } = await fetch(`http://imvdb.com/api/v1/search/videos?q=${artistName}`, {
    headers: {
      "IMVDB-APP-KEY": MUSIC_VIDEO_AUTH,
      Accept: 'application/json'
    }
  }).then(res => res.json())
  const songs = results.map(({ id, artists: [ { name, slug } ] }) => ({id, name, slug})).filter(({ name = "" }) => name.toLowerCase() === artistName.toLowerCase());
  return songs;
}

const getArtistsMusicVideoId = async (artistName) => {
  console.warn('Get Artists Music Videos', artistName)
  const songs = getMusicVideos();
  const r = [];
  for (let i = 0; i < 2; i++) {
    const musicVideo = await getYouTubeUrlForVideo(songs[i].id);
    if (musicVideo && musicVideo.length) r.push(musicVideo);
  }
  return r;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

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
  console.warn(videoId)
  const response = await fetch(`http://imvdb.com/api/v1/video/${videoId}?include=sources`, {
    headers: {
      "IMVDB-APP-KEY": MUSIC_VIDEO_AUTH,
      Accept: 'application/json'
    }
  }).then(res => res.json())
  const { sources } = response;
  const filtered = sources.filter(({ source }) => source === 'youtube').map(({ source_data }) => `https://youtube.com/v/${source_data}`)
  // const songs = results.map(({ id, artists: [ { name, slug } ] }) => ({id, name, slug})).filter(({ name = "" }) => name.toLowerCase() === artistName.toLowerCase());
  return filtered;
}

const getArtistQuery = (req) => {
  const { query: { artist = '' } = {} } = req;
  return artist;
}

const getMusicVideoId = (req) => {
  const { query: { id = '' } = {} } = req;
  return id;
}

app.get('/artist', async (req, res) => {
  const artist = getArtistQuery(req);
  const { name, id } = await searchArtist(artist);
  const artists = [{ name, id }, ...await getRelatedArtists(id)]
  let result = [];
  for (let i = 0; i < artists.length; i++) {
    const musicVideos = await getMusicVideos(artists[i].name);
    result = [...result, ...musicVideos];
  }
  res.send(shuffle(result))
})

app.get('/link', async (req, res) => {
  const musicVideoId = getMusicVideoId(req)
  const [url] = await getYouTubeUrlForVideo(musicVideoId)
  res.send(url)
})


// ca5e86225bcf4416b89dbf42fbc4e8a0
// 5894a1705f8046919e96c8130440ed80

// get related artists list
// for each artist, get music videos that are on youtube

/**
 * curl -X "GET" "https://api.spotify.com/v1/artists/7bu3H8JO7d0UbMoVzbo70s/related-artists" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQBRVvxhUpd3--sezqOJOXT9sJsJenUV14bKnOvE8YJ_3cITe898KHdjFdIb4tg2vX37fySoTY5V3ct0L5yKbNx4nRwe7tEVvg1hMjJnUwEIndR5RvWQvBqsOn_4o_pRHfiYmiz9DKo"


curl -X "GET" "https://api.spotify.com/v1/search?q=the%20cure&type=artist" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQBRVvxhUpd3--sezqOJOXT9sJsJenUV14bKnOvE8YJ_3cITe898KHdjFdIb4tg2vX37fySoTY5V3ct0L5yKbNx4nRwe7tEVvg1hMjJnUwEIndR5RvWQvBqsOn_4o_pRHfiYmiz9DKo"
 
 https://content.googleapis.com/youtube/v3/search?maxResults=25&part=snippet&q=surfing&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM

fetch('https://imvdb.com/api/v1/search/videos?q=the+cure').then(res => res.json()).then(console.warn)
 */