const moment = require('moment')
const db = require('../db')
const Event = db.models.Event
const fbGroup = db.models.fbGroup
const fbPage = db.models.fbPage
const Tag = db.models.Tag
const FB = require('fb')
const TOKEN = 'EAACEdEose0cBAHPWYw2hgsZAg7XiadRw69nbZCUJlEfOLDSoHT6FVdnUki0n5YJj2cBfrOCVxB4fhyD9yXy4xi3W4l96DdhHtnaxqs33ZAPEjiNvbYc99lUlh3aYvZADHxDftGGwPVW6ZBw4TtptuExB8q8NwkAYbcG9YdZCp7swZDZD'
FB.options({version: 'v2.7'})
FB.setAccessToken(TOKEN)

function wordInString (s, word) {
  return new RegExp('\\b' + word + '\\b', 'i').test(s)
}

function updateEvents (type) {
  // code to populate events collection from Page events
  type.find({}, (err, docs) => {
    if (err) {
      console.log('Error: ', err)
    } else {
      docs.forEach((fbpage, i) => {
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
                console.log('fb api: ', event)
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
                // trivial algorithm to determine free food
                // removed isFreeFood = false
                isFree = wordInString(description, 'free')
                isFood = wordInString(description, 'food') || wordInString(title, 'food')
                if (isFree) tags.push('free')
                if (isFood) tags.push('food')

                Event.findOrCreate({url: facebook_link}, (err, newEvent) => {
                  if (err) console.log('error creating event: ', err)
                  else {
                    newEvent.title = title
                    newEvent.host = host
                    newEvent.date = date
                    newEvent.prettyDate = moment(date).format('dddd, MMMM D [at] h:mm A')
                    newEvent.location = location
                    newEvent.details = description
                    newEvent.url = facebook_link
                    // newEvent.tags = tags
                    newEvent.save((err, e) => {
                      if (err) console.log('Error in saving event: ', newEvent, err)
                      else console.log('NEW EVENT: ', e)
                    })
                  }
                })
              })
            }
            console.log(i * 1.0 / docs.length * 100 + '% complete')
            if (i === docs.length - 1) {
              return
            }
          })
        }, i * 1050)
      })
    }
  })
}

module.exports = function () {
  updateEvents(fbPage)
  updateEvents(fbGroup)
}
