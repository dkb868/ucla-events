var mongoose = require('mongoose')
var Schema = mongoose.Schema
var findOrCreate = require('mongoose-findorcreate')

var UserSchema = new Schema({
  fbId: {type: String, unique: true},
  events: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}], default: []}
})

UserSchema.plugin(findOrCreate)

module.exports = mongoose.model('User', UserSchema)
