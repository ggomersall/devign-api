var mongoose = require("mongoose");
var User = require('./user');

var ideaSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId, 
    ref: 'User'
  }
});

module.exports = mongoose.model("Idea", ideaSchema);
