var User = require('../models/user');
var Idea = require('../models/idea');

function usersIndex(req, res) {
  User.find(function(err, users) {
    if(err) return res.status(404),json({ message: "Ooops,  something went wrong 3." });
    res.status(200).json({ users: users });
  });
};

function userShow(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return res.status(404).json({ message: "Ooops,  something went wrong 4." });

    // get the user's ideas
    Idea.find({ user: user._id }, function(err, ideas) {
      res.status(200).json({ user: user, ideas: ideas });
    });
  });
};

function userUpdate(req, res) {
  User.findById(req.params.id, function(err, user) {
    if(err) return res.status(500).json({ message: "Ooops,  something went wrong 5." });
    if(!user) return res.status(404).json({ message: "That user could not be found!" });

    if(req.body.email) user.email = req.body.email;
    if(req.body.password) user.password = req.body.password;
    if(req.body.username) user.username = req.body.username;
    if(req.body.fullname) user.fullname = req.body.fullname;
    if(req.body.availability) user.availability = req.body.availability;
    if(req.body.user_image) user.user_image = req.body.user_image;

    user.save(function(err) {
      if (err) return res.status(500).json({ message: "Ooops,  something went wrong 6." });
      res.status(201).json({ message: "Your profile has been updated" });
    });
  });
};

function userDelete(req, res) {
  User.findByIdAndRemove({_id: req.params.id}, function(err) {
    if(err) return res.status(404).json({ message: "Ooops,  something went wrong 7." });
    res.status(200).json({ message: "User has been deleted!"});
  });
};

function userRandom(req, res) {
  User.findRandom().limit(4).exec(function (err, users) {
    if(err) return res.status(404).json({ message: "Sorry random users could not be found." });
    res.status(200).json({ users: users});
    console.log(users);
  });
}





module.exports = {
  usersIndex: usersIndex,
  userShow: userShow,
  userUpdate: userUpdate,
  userDelete: userDelete,
  userRandom: userRandom
}