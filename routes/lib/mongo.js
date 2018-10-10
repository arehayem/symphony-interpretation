const MongoClient = require('mongodb').MongoClient;

var symphonyDB = null;
var mongoClient = null;

function addToDataBase(conductor) {
  return symphonyDB.collection('suggested').insertOne({
    name: {
      first: conductor.firstName,
      last: conductor.lastName
    }
  });
}

function addSuggestion(req, res, next) {
  var conductor = {
    firstName: req.query.firstName,
    lastName: req.query.lastName
  }
  MongoClient.connect('mongodb://localhost').then(function (client) {
    mongoClient = client;
    symphonyDB = mongoClient.db('symphony');
    return addToDataBase(conductor);
  }).then(function(data) {
    mongoClient.close();
    res.send('Success');
  }).catch(function(err) {
    mongoClient.close();
    next(err);
  });
}

exports.addSuggestion = addSuggestion;