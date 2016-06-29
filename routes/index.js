var express = require('express');
var router = express.Router();
var token = "7c1b97e8-1970-422d-8dba-95147deb4f86";
var db = require('orchestrate')(token)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/testpost', function (req,res,next) {
  db.post('eventcollection', {
      "title" : "Test Event",
      "host": "Jackie Chan",
      "date": new Date(),
      "location": "Top of Boelter Hall",
      "details": "im veniam, quis nostrud exerce irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "facebook_link": "http://www.facebook.com"
    })
    .then(function (res) {
      console.log(res);
    })
    .fail(function (err) {
      console.log(err);
    });

});

router.get('/testget', function (req,res,next) {
  db.newSearchBuilder()
    .collection('eventcollection')
    .limit('10')
    .query('*')
  .then(function (res) {
    console.log(res.body);
  })
  .fail(function (err) {
    console.log(err);
  })
})

module.exports = router;
