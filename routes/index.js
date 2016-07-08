var express = require('express');
var router = express.Router();
var Event = require('../models/Event')
var Tag = require('../models/Tag')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CONTONIUEOSUBITCH' });
});

router.get('/test', function (req,res) {
  var event = new Event();
  event.title = "Test Event";
  event.host = "Jackie Chan";
  event.date = new Date();
  event.location = "Top of Boelter Hall";
  event.details ="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  event.url = "http://www.facebook.com";
  event.tags = ["weed", "sports", "premed"]
  event.save(function (err, newEvent) {
    Tag.findOrCreate({name: "weed"}, function (err, tag, created) {
      if (!err) {
        tag.events.push(newEvent.id);
        tag.save(function (err, savedTag) {
          if (!err) {
              Tag.findOrCreate({name: "sports"}, function (err, tag, created) {
                if (!err) {
                  tag.events.push(newEvent.id);
                  tag.save(function (err, savedTag) {
                    if (!err) {
                        Tag.findOrCreate({name: "premed"}, function (err, tag, created) {
                          if (!err) {
                            tag.events.push(newEvent.id);
                            tag.save(function (err, savedTag) {
                              if (!err) {
                                  res.status(200).json({message: "Successfully created event and tag"});
                              } else {
                                res.status(500).json({message: "Failure"});
                              }
                            })

                          } else {
                            res.status(500).json({message: "Failure"});
                          }
                        });
                    } else {
                      res.status(500).json({message: "Failure"});
                    }
                  })

                } else {
                  res.status(500).json({message: "Failure"});
                }
              });
          } else {
            res.status(500).json({message: "Failure"});
          }
        })

      } else {
        res.status(500).json({message: "Failure"});
      }
    });
  });
});

module.exports = router;

/* Event.find({}, null, function (err, events) {
  res.json(events);
})
*/
