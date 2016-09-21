const moment = require('moment')
const utils = require('../utils')
const db = require('../db')
const Event = db.models.Event
const fbGroup = db.models.fbGroup
const fbPage = db.models.fbPage
const Tag = db.models.Tag
const extractor = require('keyword-extractor')
const FB = require('fb')
const TOKEN = 'EAACEdEose0cBABJZAbgSCjTkC12DzqpHOXrTClCGooD4pM0bObZAFSCoZC6SKec1sMxCjp5ZCFGgTjZAoAsxq6eWrt5XJaHBHcrH7ZCUV8mXzeZANZAeaYwf1il7VlGA9Vl9DATWKQpFVyma5YFH6ypnsAmdbPCtfYge68EwgEOfSAZDZD'
FB.options({version: 'v2.7'})
FB.setAccessToken(TOKEN)

const sports = ['football', 'soccer', 'tennis', 'basketball', 'volleyball', 'water polo', 'polo', 'running', 'track', 'field', 'sport', 'athlete', 'athletic']
const arts = ['paint', 'draw', 'manga', 'sculpture', 'gallery', 'museum', 'masterpiece', 'artist', 'aesthetic']
const music = ['piano', 'violin', 'guitar', 'jam', 'cello', 'flute', 'choir', 'acapella', 'a capella', 'karaoke', 'concert', 'recital', 'classical', 'band', 'harmony', 'harmonic', 'melody', 'instrumental', 'singing', 'sing']
const religion = ['hindu', 'hinduism', 'buddhism', 'judaism', 'buddhist', 'spiritual', 'christian', 'christ', 'jesus', 'fellowship', 'fellow', 'church', 'temple', 'god']
const culture = ['cultural', 'african', 'indian', 'asian', 'korean', 'japanese', 'chinese']
const entrepreneurship = ['business', 'entrepreneur', 'startup', 'company', 'venture', 'invest']
const bruinspirit = ['bruin', 'spirit', 'school spirit', 'tradition']
const academics = ['class', 'gpa', 'tutoring', 'tutor', 'academic']
const greeklife = ['frat', 'fraternity', 'sorority', 'fratlife', 'greek', 'greeks']
const career = ['career', 'career fair', 'job', 'resume', 'hired', 'headshot']
const game = ['game', 'league', 'smash', 'legends', 'overwatch']
const technology = ['computer', 'code', 'coding', 'startup', 'tech', 'technology']
const reslife = ['reslife', 'resedential', 'sproul', 'covel', 'hill']
const medicine = ['med', 'premed', 'health']
const environment = ['environment', 'green', 'conserve', 'sustainable']
const theatre = ['theatre', 'perform', 'improv', 'comedy', 'stage']

function batchFacebook (type, callback) {
  // code to populate events collection from Page events
  type.find({}, (err, docs) => {
    if (err) {
      console.log('Error: ', err)
    } else {
      docs.forEach(callback)
    }
  })
}

function getEvents (fbpage, i) {
  var title, host, date, location, facebook_link, description, isFree, isFood

  setTimeout(function () {
    FB.api('/' + fbpage.page_id + '/events?&since=yesterday', function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error)
        return
      }
      host = fbpage.name
      if (res.data.length) {
        res.data.forEach(event => {
          let tags = []
          // console.log('fb api: ', event)
          title = event.name
          date = new Date(event.start_time)
          if (event.place) {
            location = event.place.name
          } else if (event.location) {
            location = event.location
          } else {
            location = 'N/A'
          }
          facebook_link = 'https://www.facebook.com/events/' + event.id
          description = event.description

          Event.findOrCreate({url: facebook_link}, (err, newEvent, created) => {
            if (err) console.log('error creating event: ', err)
            else {
              newEvent.title = title
              newEvent.host = host
              newEvent.date = date
              newEvent.prettyDate = moment(date).format('dddd, MMMM D [at] h:mm A')
              newEvent.location = location
              newEvent.details = description
              newEvent.url = facebook_link
              if (created) tagify(fbpage, newEvent)
              // newEvent.tags = tags
              newEvent.save((err, e) => {
                if (err) console.log('Error in saving event: ', newEvent, err)
                else console.log('NEW EVENT: ', e)
              })
            }
          })
        })
      }
      console.log('something happened')
    // console.log(i * 1.0 / docs.length * 100 + '% complete')
    // if (i === docs.length - 1) {
    //   return
    // }
    })
  }, i * 1050)
}

// HACK currently only works for groups, change field to 'about' for pages
function addDescriptions (fbpage, i) {
  setTimeout(function () {
    FB.api('/' + fbpage.page_id + '?fields=description', function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error)
        return
      }
      console.log(res)
      fbpage.description = res.description || ''
      fbpage.save((err, doc) => {
        if (!err) console.log('saved: ', doc)
      })

    // console.log(i * 1.0 / docs.length * 100 + '% complete')
    // if (i === docs.length - 1) {
    //   return
    // }
    })
  }, i * 1050)
}

function fixEvents (event, i) {
  setTimeout(function () {
    if (!event.title) {
      let split = event.url.split('/')
      let eventId = split[split.length - 1]
      FB.api('/' + eventId + '?fields=owner,description,name,start_time,place', function (res) {
        if (!res || res.error) {
          console.log(!res ? 'error occurred' : res.error)
          return
        }
        console.log(res)
        event.title = res.name
        event.date = new Date(res.start_time)
        if (res.place) {
          event.location = res.place.name
        } else if (res.location) {
          event.location = res.location
        } else {
          event.location = 'N/A'
        }
        event.description = res.description || ''
        event.host = res.owner.name

        let hack = {description: ''}

        tagify(hack, event)

      // console.log(i * 1.0 / docs.length * 100 + '% complete')
      // if (i === docs.length - 1) {
      //   return
      // }
      })
    }
  }, i * 1050)
}

function findOne (haystack, arr) {
  return arr.some(v => {
    return haystack.indexOf(v) >= 0
  })
}

function tagify (fbpage, event) {
  let combinedString = event.details + ' ' + event.title + ' ' + event.host
  if (fbpage.description) combinedString += ' ' + fbpage.description
  let result = extractor.extract(combinedString, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    return_chained_words: false,
    remove_duplicates: true
  })

  result.filter((tagName) => {
    return tagName !== 'undefined' && tagName !== undefined
  })

  console.log('RESULT: ' , result)

  event.tags = result
  event.save((err) => {
    if (!err) console.log('Succesfully saved event')
  })

  if (findOne(result, sports)) {
    result.push('sport')
    result.push('sports')
  }

  if (findOne(result, arts)) {
    result.push('art')
    result.push('arts')
  }

  if (findOne(result, music)) {
    result.push('music')
    result.push('musics')
  }

  if (findOne(result, religion)) {
    result.push('religion')
    result.push('religions')
  }

  if (findOne(result, culture)) {
    result.push('culture')
    result.push('cultures')
  }

  if (findOne(result, entrepreneurship)) {
    result.push('entrepreneurship')
    result.push('entrepreneurships')
  }
  if (findOne(result, bruinspirit)) {
    result.push('Bruin Spirit')
    result.push('Bruins Spirit')
  }

  if (findOne(result, academics)) {
    result.push('academic')
    result.push('academics')
  }

  if (findOne(result, greeklife)) {
    result.push('Greek Life')
    result.push('greek')
  }

  if (findOne(result, career)) {
    result.push('career')
    result.push('careers')
  }

  if (findOne(result, game)) {
    result.push('game')
    result.push('games')
  }

  if (findOne(result, technology)) {
    result.push('technology')
    result.push('technologies')
    result.push('tech')
  }

  if (findOne(result, reslife)) {
    result.push('Resedential Life')
    result.push('reslife')
  }

  if (findOne(result, medicine)) {
    result.push('medicine')
    result.push('medicines')
    result.push('premed')
  }

  if (findOne(result, environment)) {
    result.push('environment')
    result.push('environments')
  }

  if (findOne(result, theatre)) {
    result.push('theatre')
    result.push('theatres')
  }

  result.forEach((tagName) => {
    Tag.findOrCreate({name: tagName}, (err, tag) => {
      if (err) console.log(err)
      else {
        tag.events.push(event.id)
        tag.save((err) => {
          if (!err) console.log('Successfully saved tag')
        })
      }
    })
  })
}

module.exports = function () {
  // batchFacebook(Event, fixEvents)
  batchFacebook(fbGroup, getEvents)
  //  batchFacebook(fbGroup, addDescriptions)
  batchFacebook(fbPage, getEvents)
// batchFacebook(fbGroup, addDescriptions)
}
