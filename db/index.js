const mongoose = require('mongoose');
const config = require('../config')
const Mongoose = mongoose.connect(config.dbURI)
const models = require('./models')

Mongoose.connection.on('error', error => {
  console.log('Mongoose connection error: ' + error)
})

module.exports = {
  Mongoose,
  models
}
