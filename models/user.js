var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');


var userSchema = new mongoose.Schema({
    username: {
      type: String
    },
    fullname: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    availability: {
      type: String
    },
    user_image: {
      type: String
    }
});

userSchema.methods.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

Schema.plugin(random, { path: 'r' });

module.exports = mongoose.model("User", userSchema);