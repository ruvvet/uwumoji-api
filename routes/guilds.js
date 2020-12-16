//const db = require('../models');
const router = require('express').Router();
const bodyParser = require('body-parser');
const { oauth } = require('../constants');
const bot = require('../bot');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', getUserGuilds);
router.get('/guildemojis', getEmojisByGuild);

async function getUserGuilds(req, res) {
  const allGuilds = await oauth
    .getUserGuilds(req.user.access_token)
    .catch(() => []);

  // guild icon = https://cdn.discordapp.com/icons/[guild_id]/[guild_icon].png **
  const guilds = allGuilds.filter((guild) => guild.owner);

  res.status(200).json(guilds);
}

async function getEmojisByGuild(req, res) {
  const allGuilds = await oauth
    .getUserGuilds(req.user.access_token)
    .catch(() => []);

  // guild icon = https://cdn.discordapp.com/icons/[guild_id]/[guild_icon].png **
  const guilds = allGuilds.filter((guild) => guild.owner);

  let emojisByGuild = {};

  guilds.forEach((guild) => {
    // call the bot
    const guildEmojis = bot.getGuildEmoji(guild.id);
    emojisByGuild[guild.name] = guildEmojis;
  });

  res.status(200).json(emojisByGuild);
}






module.exports = router;

