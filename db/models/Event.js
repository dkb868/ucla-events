var mongoose = require('mongoose')
var Schema = mongoose.Schema
var findOrCreate = require('mongoose-findorcreate')

var EventSchema = new Schema({
  title: String,
  host: String,
  date: Date,
  prettyDate: String,
  location: String,
  details: String,
  url: String,
  tags: [String]
})

EventSchema.plugin(findOrCreate)

module.exports = mongoose.model('Event', EventSchema)
