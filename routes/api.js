var express = require('express');
var router = express.Router();
var Event = require('../models/Event')

/* GET events. */
router.get('/events', function(req, res, next) {
  Event.find({}, null, function (err, events) {
    if(!err){
      res.status(200).json(events);
    }
    else {
      console.log(err);
      res.status(500).json(err);
    }
 });
});

/* POST events. */
router.post('/events', function (req, res, next) {
  // var title = req.body.title;
  // var host = req.body.host;
  // var location = req.body.location;
  // var details = req.body.details;
  // var facebook_link = req.body.facebook_link;

  var event = new Event();
  event.title = "Test Event";
  event.host = "Jackie Chan";
  event.date = new Date();
  event.location = "Top of Boelter Hall";
  event.details ="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  event.url = "http://www.facebook.com";
  event.save(function (err, newEvent) {
    res.status(200).json({message: "Successfully created event"});
  })
});


module.exports = router;
