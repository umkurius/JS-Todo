const Router = require('express'),
      router = new Router(),
      controller = require('./authController'),
      authMiddleware = require('./authMiddleware'),
      {check} = require('express-validator');

router.post('/registration', [
    check('username', "Username cannot be empty").notEmpty(),
    check('password', "Password length should be from 4 to 10").isLength({min: 4, max: 10})
], controller.registration);
router.post('/login', controller.login);
router.get('/users', authMiddleware, controller.getUsers)

module.exports = router;