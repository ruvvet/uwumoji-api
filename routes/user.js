//const db = require('../models');
const router = require('express').Router();
const bodyParser = require('body-parser');

const bot = require('../bot');
const { oauth } = require('../constants');
const { parseToken } = require('../utils');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/profile', getUserDetails);
router.get('/guilds', getUserGuilds);

// Gets the user's profile details
async function getUserDetails(req, res) {

  const accessToken = parseToken(req)
  const user = await oauth.getUser(accessToken);

  res.status(200).json(user);
}


// Gets all user's guilds - dupe of /guilds
async function getUserGuilds(req, res) {
  const accessToken = parseToken(req)

  const allGuilds = await oauth
    .getUserGuilds(accessToken)
    .catch(() => []);

  const guilds = allGuilds.filter((guild) => guild.owner);
  res.status(200).json(guilds);
}

module.exports = router;
