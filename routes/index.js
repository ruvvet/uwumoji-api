// MAIN ROUTER

// DEPENDENCIES //////////////////////////////////////////////////////////
const router = require('express').Router();

// MIDDLEWARE ////////////////////////////////////////////////////////////
router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/guilds', require('./guilds'));
router.use('/emoji', require('./emoji'));
router.use('/browse', require('./browse'));

// ROUTES ////////////////////////////////////////////////////////////////


module.exports = router;


// "protected routes" - send the access token and check the access token before sending back data
