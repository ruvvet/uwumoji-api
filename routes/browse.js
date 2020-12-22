// DEPENDENCIES //////////////////////////////////////////////////////////
const axios = require('axios');
const bodyParser = require('body-parser');
const bot = require('../bot');
const db = require('../models');
const router = require('express').Router();

// MIDDLEWARE ////////////////////////////////////////////////////////////
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// ROUTES ////////////////////////////////////////////////////////////////
router.get('/uwumoji', browseUwuMoji); // shows all the "uploaded emoji" that are stored in the database
router.get('/discord', browseDiscord); // calls the bot and displays all the emoji the bot has access to
router.get('/discord/:page', browseDiscordPage); // calls the emoji.gg api and displays all emoji w/ pagination
router.get('/emojigg', browseEmojiGG); //  - NOT IN USE - calls the emoji.gg api and displays all their emoji
router.get('/emojiggcategory', getEmojiGGcat); // gets + sends a list of categories from the emoji.gg api
router.get('/emojigg/:page', browseEmojiggPage); // calls the emoji.gg api and displays all emoji w/ pagination
router.get('/emojigg/category/:cat', browseEmojiggCategory); // calls the emoji.gg api and sorts all emoji by category

// FUNCTIONS /////////////////////////////////////////////////////////////

// Gallery for the uwumoji db - displays the emojis in the database
// calls the database, finds all the emoji in the emoji table
async function browseUwuMoji(req, res) {

  const allemoji = await db.emoji.findAll().catch(() => null);
  res.status(200).json(allemoji);
}

// Gallery for all the discord emoji - displays all the emojis the bot has access to
// calls the bot to get all the emoji it has access to based on which guilds it is in
function browseDiscord(req, res) {

  const allemoji = bot.getAllEmoji();
  res.status(200).json(allemoji);
}

// Gallery for all the emoji.gg api emoji
// calls the emoji.gg api to get all the emoji
async function browseEmojiGG(req, res) {

  const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);
  res.status(200).json(allemoji.data);
}

// Gallery for all the emoji.gg api emoji - but paginated
function browseDiscordPage(req, res) {
  // takes a page parameter + parses it to an integer
  // page count starts at 0
  const page = parseInt(req.params.page) || 0;
  const emojisPerPage = 100;

  // use the page value to splice the emoji list - these are the defaults
  let start = page * emojisPerPage;
  let end = start + emojisPerPage;

  // calls the emoji.gg api to get all the emoji
  const allemoji = bot.getAllEmoji();

  // if the page value is less than 0
  // the start is always set at 0
  if (page < 0) {
    start = 0;
    end = start + 100;
  }
  // of the page value is greater than the # of emojis/100 (100 emojis/page)
  // then the end is always -100 the length of the list.
  let lastPage = Math.ceil(allemoji.array().length / emojisPerPage) - 1;

  if (page > lastPage) {
    end = Math.ceil(allemoji.array().length / emojisPerPage) * emojisPerPage;
    start = end - emojisPerPage;
  }

  // sends emojis to be displayed
  res.json({ emojis: allemoji.array().slice(start, end), page, end: lastPage });
}

// Gallery for all the emoji.gg api emoji - but paginated
async function browseEmojiggPage(req, res) {
  // takes a page parameter + parses it to an integer
  // page count starts at 0
  const page = parseInt(req.params.page) || 0;
  const emojisPerPage = 100;

  // use the page value to splice the emoji list - these are the defaults
  let start = page * emojisPerPage;
  let end = start + emojisPerPage;

  // calls the emoji.gg api to get all the emoji
  const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);

  // if the page value is less than 0
  // the start is always set at 0
  if (page < 0) {
    start = 0;
    end = start + 100;
  }
  // of the page value is greater than the # of emojis/100 (100 emojis/page)
  // then the end is always -100 the length of the list.
  let lastPage = Math.ceil(allemoji.data.length / emojisPerPage) - 1;

  if (page > lastPage) {
    end = Math.ceil(allemoji.data.length / emojisPerPage) * emojisPerPage;
    start = end - emojisPerPage;
  }

  if (!allemoji) {
    //res.render(404)
    console.log('error with getting emoji');
  } else {
    // sends emojis to be displayed
    res
      .status(200)
      .json({ emojis: allemoji.data.slice(start, end), page, end: lastPage });
  }
}

// Gets emoji by category (#) for emoji.gg api
async function browseEmojiggCategory(req, res) {
  // calls the emoji.gg api to get all the emoji
  const allemoji = await axios.get('https://emoji.gg/api').catch(() => null);

  if (!allemoji) {
    //res.render(404)
    console.log('error with getting emoji');
  } else {
    // filter the emoji by their category value so it matches the parameter value
    const emojiByCategory = allemoji.data.filter(
      (emoji) => emoji.category == req.params.cat
    );
    // sends the filtered emoji to be displayed
    res.render('browse/showemojigg', {
      allemoji: emojiByCategory,
      libname: 'Emoji.gg',
      page: null,
      end: null,
    });
  }
}

// calls the emojigg api to get all their categories
async function getEmojiGGcat(req, res) {
  const emojiGGcat = await axios
    .get('https://emoji.gg/api?request=categories')
    .catch(() => null);
  // sends it to be displayed in the partial
  res.send(emojiGGcat.data);
}

module.exports = router;
