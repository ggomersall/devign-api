var Idea = require('../models/idea') ;

function ideasIndex(req, res){
  Idea.find(function(err, ideas){
    if(err) return res.status(404).json({ message: "Oooops, couldn't find the ideas" });
    res.status(200).json({ ideas: ideas });
  });
};

function ideaShow(req, res){
  // the .populate function adds the user model to each idea record, so you can
  // display more user data rather than just an id
  Idea.findById(req.params.id).populate('user').exec(function(err, idea){
    if(err) return res.status(404).json({ message: "Oooops, something went wrong. We couldn't find that idea" });
    res.status(200).json({ idea: idea});
  });
};

function ideaCreate(req, res) {
  var idea = new Idea({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description, 
    user: req.user.id
  });
  idea.save(function(err){
    if(err) return res.render('error', { message: "Could not create idea " + (err) });
    res.status(201).json({ idea: idea});
  });
};

function ideaUpdate(req, res) {
  Idea.findById(req.params.id, function(err, idea){
    if(err) return res.status(500).json({ message: "Oooops, Something went wrong" });
    if(!idea) return res.status(404).json({ message: "No idea found, sorry" });

    if(req.body.name) idea.name = req.body.name;
    if(req.body.image) idea.image = req.body.image;
    if(req.body.description) idea.description = req.body.description;
    if(req.body.user) idea.user = req.body.user;

    idea.save(function(err, idea){
      if(err) return res.status(500).json({ message: "Oooops, something went wrong" });

      res.status(201).json({ message: "Idea updated successfully", idea: idea });
    });
  });
};

function ideaDelete(req, res) {
  Idea.findByIdAndRemove({_id: req.params.id}, function(err){
    if(err) return res.status(404).json({ message: "Oooops, something went wrong" });
    res.status(200).json({ message: "Idea has been successfully deleted" });
  });
};

module.exports = {
  ideasIndex: ideasIndex,
  ideaShow: ideaShow,
  ideaCreate: ideaCreate,
  ideaDelete: ideaDelete,
  ideaUpdate: ideaUpdate
}

