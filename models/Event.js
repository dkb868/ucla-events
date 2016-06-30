var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
    title: String,
    host: String,
    date: Date,
    location: String,
    details: String,
    url: String,
});

module.exports = Event = mongoose.model('Event', EventSchema);
