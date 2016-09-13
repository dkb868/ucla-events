var mongoose = require('mongoose')
var Schema = mongoose.Schema

const fbPageSchema = new Schema({
  name: String,
  description: String,
  page_id: {type: String, unique: true}
}, {collection: 'fbPages'})

module.exports = mongoose.model('fbPage', fbPageSchema)
