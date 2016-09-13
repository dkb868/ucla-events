var express = require('express')
const moment = require('moment')
var router = express.Router()
const db = require('../db')
var Event = db.models.Event
var Tag = db.models.Tag

/* GET home page. */
router.get('/', function (req, res, next) {
  Event.find({'date': {'$gte': moment().startOf('day').toDate(), '$lt': moment().add(7, 'd').startOf('day').toDate()}}, null, {sort: {date: 1}}, (err, docs) => {
    if (err) {
      console.log(err)
      res.end(500)
    } else {
      res.render('index', { events: docs })
    }
  })
})

router.post('/search', (req, res, next) => {
  let keyWords = req.body.query.split(' ')
  Event.find({'date': {'$gte': moment().startOf('day').toDate()}, tags: { $in: keyWords}}, null, {sort: {date: 1}}, (err, docs) => {
    if (err) {
      console.log(err)
      res.end(500)
    } else {
      res.render('search', {events: docs, query: req.body.query})
    }
  })
})

router.get('/tag/:tagName', (req, res, next) => {
  tagName = req.params.tagName
  Event.find({'date': {'$gte': moment().startOf('day').toDate()},'tags': tagName}, null, {sort: {date: 1}}, (err, docs) => {
    if (err) {
      console.log(err)
      res.end(500)
    } else {
      res.render('search', {events: docs, query: tagName})
    }
  })
})















// router.get('/test', function (req, res) {
//   var event = new Event()
//   event.title = 'Test Event'
//   event.host = 'Jackie Chan'
//   event.date = new Date()
//   event.location = 'Top of Boelter Hall'
//   event.details = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
//   event.url = 'http://www.facebook.com'
//   event.tags = ['weed', 'sports', 'premed']
//   event.save(function (err, newEvent) {
//     Tag.findOrCreate({name: 'weed'}, function (err, tag, created) {
//       if (!err) {
//         tag.events.push(newEvent.id)
//         tag.save(function (err, savedTag) {
//           if (!err) {
//             Tag.findOrCreate({name: 'sports'}, function (err, tag, created) {
//               if (!err) {
//                 tag.events.push(newEvent.id)
//                 tag.save(function (err, savedTag) {
//                   if (!err) {
//                     Tag.findOrCreate({name: 'premed'}, function (err, tag, created) {
//                       if (!err) {
//                         tag.events.push(newEvent.id)
//                         tag.save(function (err, savedTag) {
//                           if (!err) {
//                             res.status(200).json({message: 'Successfully created event and tag'})
//                           } else {
//                             res.status(500).json({message: 'Failure'})
//                           }
//                         })
//                       } else {
//                         res.status(500).json({message: 'Failure'})
//                       }
//                     })
//                   } else {
//                     res.status(500).json({message: 'Failure'})
//                   }
//                 })
//               } else {
//                 res.status(500).json({message: 'Failure'})
//               }
//             })
//           } else {
//             res.status(500).json({message: 'Failure'})
//           }
//         })
//       } else {
//         res.status(500).json({message: 'Failure'})
//       }
//     })
//   })
// })

module.exports = router

/* Event.find({}, null, function (err, events) {
  res.json(events)
})
*/
