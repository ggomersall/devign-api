var express        = require('express');
var cors           = require('cors');
var path           = require('path');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var passport       = require('passport');
var cookieParser   = require("cookie-parser");
var methodOverride = require("method-override");
var jwt            = require('jsonwebtoken');
var expressJWT     = require('express-jwt');
var multer         = require('multer');
var s3             = require('multer-s3');
var uuid           = require('uuid');
var app            = express();


var User = require('./models/user');
var Idea = require('./models/idea');

var secret = process.env.DEVIGNER_APP_SECRET;

require('./config/passport')(passport);

// connecting the DB
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/devigner-app');
mongoose.set('debug', true)
// requiring passport

app.use(methodOverride(function(req, res){
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  };
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(cors());

app.use('/api', expressJWT({ secret: secret })
  .unless({
    path: [
      { url: '/api/login', methods: ['POST'] },
      { url: '/api/signup', methods: ['POST'] },
      { url: '/api/users/random', methods: ['POST'] }
    ]
  }));

var upload = multer({
  storage: s3({
    // the folder within the bucket
    dirname: 'profile_images',
    // set this to your bucket name
    bucket: 'devign-app',
    // your AWS keys
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    // the region of your bucket
    region: 'eu-west-1',
    // IMPORTANT: set the mime type to that of the file
    contentType: function(req, file, next) {
      next(null, file.mimetype);
    },
    // IMPORTANT: set the file's filename here
    // ALWAYS CHANGE THE FILENAME TO SOMETHING RANDOM AND UNIQUE
    // I'm using uuid (https://github.com/defunctzombie/node-uuid)
    filename: function(req, file, next) {
      // Get the file extension from the original filename
      var ext = '.' + file.originalname.split('.').splice(-1)[0];
      // create a random unique string and add the file extension
      var filename = uuid.v1() + ext;
      next(null, filename);
    }
  })
});

var uploader = upload.single('file');

// This will upload a single file.
app.post('/api/upload/single', function(req, res) {

  uploader(req, res, function(err) {
    if(err) return res.status(500).json({ message: err });

    res.status(201).json({ filename: "https://s3-eu-west-1.amazonaws.com/devign-app/" + req.file.key });
    
  });

});


app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({message: 'Unauthorized request.'});
  }
  next();
});

var routes = require('./config/routes');
app.use("/api", routes);

app.listen(process.env.PORT || 3000);
console.log("server running on port 3000")
