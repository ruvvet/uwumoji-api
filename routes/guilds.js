//const db = require('../models');
const router = require('express').Router();
const bodyParser = require('body-parser');
const { oauth } = require('../constants');
const { parseToken } = require('../utils');
const bot = require('../bot');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', getUserGuilds);
router.get('/emojis', getEmojisByGuild);

// Gets all user's guilds - dupe of user/guilds
async function getUserGuilds(req, res) {
  const accessToken = parseToken(req);

  const allGuilds = await oauth.getUserGuilds(accessToken).catch(() => []);

  const guilds = allGuilds.filter((guild) => guild.owner);
  res.status(200).json(guilds);
}

// Gets all emojis by Guilds
async function getEmojisByGuild(req, res) {
  const accessToken = parseToken(req);

  const allGuilds = await oauth.getUserGuilds(accessToken).catch(() => []);

  const guilds = allGuilds.filter((guild) => guild.owner);

  let emojisByGuild = {};

  guilds.forEach((guild) => {
    // call the bot
    const guildEmojis = bot.getGuildEmoji(guild.id);
    emojisByGuild[guild.name] = guildEmojis;
  });

  console.log(emojisByGuild);
  res.status(200).json(emojisByGuild);
}

module.exports = router;
