var express = require('express');
var router = express.Router();
var spotify = require('./lib/spotify');
var cors = require('cors');

router.use(cors());

/* GET users listing. */
router.get('/', function(req, res, next) {
  spotify.getAlbums(req, res);
});

router.get('/tracks', function(req, res, next) {
  spotify.getTracks(req, res);
});

router.get('/single', function(req, res, next) {
  spotify.singleSearch(req, res);
});

module.exports = router;
