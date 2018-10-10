var express = require('express');
var router = express.Router();
var mongo = require('./lib/mongo');
var cors = require('cors');

router.use(cors());

/* GET users listing. */
router.get('/add', function(req, res, next) {
  mongo.addSuggestion(req, res, next);
});

router.get('/accept', function(req, res, next) {
  mongo.acceptSuggestion(req, res, next);
});

module.exports = router;
