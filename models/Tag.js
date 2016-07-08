var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate')

var TagSchema = new Schema({
    name: {type: String, unique: true},
    events: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}], default: []},
});

TagSchema.plugin(findOrCreate);

module.exports = Tag = mongoose.model('Tag', TagSchema);
