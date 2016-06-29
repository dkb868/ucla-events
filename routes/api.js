var express = require('express');
var router = express.Router();
var token = "7c1b97e8-1970-422d-8dba-95147deb4f86";
var db = require('orchestrate')(token)

/* GET events. */
router.get('/events', function(req, res, next) {
  db.newSearchBuilder()
    .collection('eventcollection')
    .limit('10')
    .query('*')
  .then(function (events) {
    console.log("EVENTS: ", events.body);
    res.status(200).json(events.body);
  })
  .fail(function (err) {
    console.log(err);
    res.status(500).json({error: true});
  });

});

module.exports = router;
