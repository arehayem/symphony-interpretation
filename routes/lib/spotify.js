// spotify helper functions

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId: '1557e35501674b2fb734fd1b243b9743',
  clientSecret: '86e81ccc8f694dea9025ed504c6b5be6'
});

var conductorsList = require('./conductors_list.json');

const RESULTS_LIMIT = 10;

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

function searchSpotifyAlbums(album, conductor) {
	return spotifyApi.search('artist:' + album + ' ' + conductor + ' ' + 'symphon*', ['album'], {limit: RESULTS_LIMIT}).then(
	  function(data) {
      console.log(data.body.albums.href);
      return augmentAlbums(filterAlbums(data.body.albums.items));
	  }
	).then(function(data) {
    return mapAlbums(data, conductor);
  }).catch(function(error) {
    console.log('searchSpotifyAlbums error', err);
  });
}

function augmentAlbums(albums) {
  var promiseArray = albums.map(function(album) {
    return spotifyApi.getAlbum(album.id);
  });
  return Promise.all(promiseArray);
}

function getAlbumsByConductor(album) {
  var promisesArray = conductorsList.conductors.map(function(conductor) {
    return searchSpotifyAlbums(album, conductor.last_name);
  });
  return Promise.all(promisesArray);
}

function filterAlbums(albums) {
  // case insensitive
  return albums.filter(album => album.name.toUpperCase().includes('SYMPHON'));
}

function mapAlbums(albums, conductor) {
  return albums.map(album => ({
    id: album.body.id,
    href: album.body.href,
    name: album.body.name,
    artists: album.body.artists,
    conductor: conductor,
    images: album.body.images,
    external_urls: album.body.external_urls
  }));
}

function getTracks(req, res) {
  spotifyApi.getAlbumTracks(req.query.albumId).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    console.log('getTracks error:');
    console.log(err);
  });
}

function getAlbums(req, res) {
  getAlbumsByConductor(req.query.search).then(function(data) {
    data = data.filter(datum => datum.length > 0);
    res.json(data);
  }).catch(function(err) {
    console.log('getAlbums error:');
    console.log(err);
  });
}

function singleSearch(req, res) {
  spotifyApi.searchAlbums(req.query.search + ' artist:Karajan', {limit: RESULTS_LIMIT}).then(function(data) {
    res.json(data);
  }).catch(function(err) {
    console.log(err);
  })
}

exports.getAlbums = getAlbums;
exports.getTracks = getTracks;
exports.singleSearch = singleSearch;