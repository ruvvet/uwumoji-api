require('dotenv').config();
const bot = require('../bot');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const db = require('../models');
const multer = require('multer');
const router = require('express').Router();
const { parseToken } = require('../utils');

// MIDDLEWARE ////////////////////////////////////////////////////////////
const uploads = multer({ dest: './uploads/' });
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// ROUTES ////////////////////////////////////////////////////////////////


// router.get('/:id', getEmojiDetails);
router.get('/details', getEmojiDetails)
router.post('/new', uploads.single('img'), upload); // uploads the file from the multipart-form type
router.post('/add', addEmoji);


// and Uploads the emoji to cloudinary and the guild
function upload(req, res) {
  console.log('hello, youve reached the api');
  console.log(req.body.name);
  console.log(req.body.guild);
  console.log(req.file);

  const accessToken = parseToken(req);
  // takes the file from the multipart form in the uploads page
  const file = req.file.path;

  // uploads to cloudinary
  cloudinary.uploader.upload(file, async (result) => {
    // gets the selected guildid
    const guildID = req.body.guild;

    // call the bot to add the emoji
    // sends 3 arguments - guildid, url, name
    bot.addEmoji(guildID, result.url, req.body.name);

    // find the user id in the database based on their uuid
    const user = await db.user
      .findOne({ where: { access_token: accessToken } })
      .catch(() => null);

    // find or create emoji in the db with the user.id as the fk
    const [newemoji, created] = await db.emoji.findOrCreate({
      where: {
        name: req.body.name,
        url: result.url,
      },
      defaults: {
        userId: user.discord_user_id,
      },
    });
  });

  res.status(201).send();
}

// calls the bot to add an emoji to the guild its in
function addEmoji(req, res) {
  // takes the selected guildid

  // calls the bot to add an emoji
  // passes 3 arguments - guildid, the url of the image, and the name
  bot.addEmoji(req.body.guild, req.body.url, req.body.name);
  res.status(201).send();
}

// function getEmojiDetails(req, res) {

//   console.log('getting details')
// const emojiID = req.params.id
// console.log(emojiID)

//   const emojiInfo = bot.getEmoji(emojiID)
//   res.status(200).json(emojiInfo)
// }


function getEmojiDetails(req, res){

  console.log('getting details')
  console.log(req.body)
const emojiID = req.body.emojiID
console.log(emojiID)

  const emojiInfo = bot.getEmoji(emojiID)
  res.status(200).json(emojiInfo)
}


module.exports = router;
