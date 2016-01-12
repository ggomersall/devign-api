var express     = require('express');
var router      = express.Router();
var passport    = require('passport');

var usersController = require('../controllers/usersController');
var authController = require('../controllers/authController');
var ideasController = require('../controllers/ideasController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);

router.route('/users')
  .get(usersController.usersIndex);

router.route('/ideas')
  .get(ideasController.ideasIndex)
  .post(ideasController.ideaCreate);

router.route('/users/:id')
  .get(usersController.userShow)
  .put(usersController.userUpdate)
  .patch(usersController.userUpdate)
  .delete(usersController.userDelete);

router.route('/ideas/:id')
  .get(ideasController.ideaShow)
  .put(ideasController.ideaUpdate)
  .patch(ideasController.ideaUpdate)
  .delete(ideasController.ideaDelete);

router.route('/users/random')
  .get(usersController.userRandom);

module.exports = router;