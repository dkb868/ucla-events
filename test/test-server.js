var chai = require('chai')
var chaiHttp = require('chai-http')
var mongoose = require('mongoose')
const db = require('../db')
var Event = db.models.Event
var Tag = db.models.Tag
var server = require('../server')
var should = chai.should()

chai.use(chaiHttp)

describe('The api', function () {
  Event.collection.drop()
  Tag.collection.drop()

  beforeEach(function (done) {
    var event = new Event()
    event.title = 'Test Event'
    event.host = 'Jackie Chan'
    event.date = new Date()
    event.location = 'Top of Boelter Hall'
    event.details = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    event.url = 'http://www.facebook.com'
    event.tags = ['weed', 'sports', 'premed']
    event.save(function (err, newEvent) {
      Tag.findOrCreate({name: 'weed'}, function (err, tag, created) {
        if (!err) {
          tag.events.push(newEvent.id)
          tag.save(function (err, savedTag) {
            if (!err) {
              Tag.findOrCreate({name: 'sports'}, function (err, tag, created) {
                if (!err) {
                  tag.events.push(newEvent.id)
                  tag.save(function (err, savedTag) {
                    if (!err) {
                      Tag.findOrCreate({name: 'premed'}, function (err, tag, created) {
                        if (!err) {
                          tag.events.push(newEvent.id)
                          tag.save(function (err, savedTag) {
                            if (!err) {
                              done()
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    })
  })

  afterEach(function (done) {
    Event.collection.drop()
    Tag.collection.drop()
    done()
  })

  it('should return events with get api/events', function (done) {
    chai.request(server)
      .get('/api/events')
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('array')
        var event = res.body[0]
        event.should.have.property('title')
        event.should.have.property('host')
        event.should.have.property('date')
        event.should.have.property('location')
        event.should.have.property('url')
        event.should.have.property('tags')
        event.title.should.equal('Test Event')
        event.host.should.equal('Jackie Chan')
        console.log(typeof (event.date))
        event.date.should.exist; // HACK:
        event.location.should.equal('Top of Boelter Hall')
        event.url.should.equal('http://www.facebook.com')
        event.tags.should.eql(['weed', 'sports', 'premed'])
        done()
      })
  })

  it('should return all events of a particular tag with api/tag/tagName', function (done) {
    chai.request(server)
      .get('/api/tag/weed')
      .end(function (err, res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('array')
        var event = res.body[0]
        event.should.have.property('title')
        event.should.have.property('host')
        event.should.have.property('date')
        event.should.have.property('location')
        event.should.have.property('url')
        event.should.have.property('tags')
        event.title.should.equal('Test Event')
        event.host.should.equal('Jackie Chan')
        console.log(typeof (event.date))
        event.date.should.exist; // HACK:
        event.location.should.equal('Top of Boelter Hall')
        event.url.should.equal('http://www.facebook.com')
        event.tags.should.eql(['weed', 'sports', 'premed'])
        done()
      })
  })

  it('should fail silently ,i.e return an empty array if there are no events for that tag or the tag doesnt exist', function (done) {
    chai.request(server)
      .get('/api/tag/nonexistant')
      .end(function (err, res) {
        res.should.have.status(500)
        res.should.be.json
        res.body.should.be.a('array')
        res.body.length.should.equal(0)
        done()
      })
  })
})
