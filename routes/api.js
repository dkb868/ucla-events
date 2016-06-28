var express = require('express');
var router = express.Router();

/* GET events. */
router.get('/events', function(req, res, next) {
  res.status(200).json({events: [{title: 'test'}, {title:'test2'}]});
});

module.exports = router;
