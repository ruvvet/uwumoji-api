// MAIN ROUTER
// HANDLES THE 404 + 500 ERRORS

// DEPENDENCIES //////////////////////////////////////////////////////////
const router = require('express').Router();

// MIDDLEWARE ////////////////////////////////////////////////////////////
router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/guilds', require('./guilds'));
router.use('/create', require('./create'));

// ROUTES ////////////////////////////////////////////////////////////////
router.use(function (req, res, next) {
  res.status(404);
});

router.use(function (err, req, res, next) {
  res.status(500);
});

module.exports = router;


// "protected routes" - send the access token and check the access token before sending back data
