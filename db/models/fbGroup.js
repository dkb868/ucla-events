var mongoose = require('mongoose')
var Schema = mongoose.Schema

const fbGroupSchema = new Schema({
  name: String,
  page_id: {type: String, unique: true}
}, {collection: 'fbGroups'})

module.exports = mongoose.model('fbGroup', fbGroupSchema)
