const fetch = require('node-fetch');
const btoa = require('btoa');
const express = require('express');

const { BehaviorSubject } = require('rxjs');

const app = express();


app.use('/', express.static('.'));

app.listen('8080', () => console.warn('App is listening'));

const base64 = `Basic ${btoa("ca5e86225bcf4416b89dbf42fbc4e8a0:5894a1705f8046919e96c8130440ed80")}`;
console.warn(base64)
const updateToken = () => {

}

const AccessTokenSubject = new BehaviorSubject(undefined);

const getNewToken = async () => {
  console.warn('fetching access token')
  const { access_token, expires_in } = await fetch('https://accounts.spotify.com/api/token', {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded',
      Authorization: base64,
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

app.get('/artist', async (req, res) => {
  const { name, id } = await searchArtist('the cure');
  const result = [{ name, id }, ...await getRelatedArtists(id)]
  res.send(result)
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