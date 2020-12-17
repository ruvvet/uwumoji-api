// DEPENDENCIES //////////////////////////////////////////////////////////
//const db = require('../models');
const router = require('express').Router();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const { oauth } = require('../constants');
const { parseToken } = require('../utils');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// ROUTES ////////////////////////////////////////////////////////////////
router.post('/exchange', exchange);
router.get('/authorize', authorize);
router.put('/refresh', refresh);
//router.get('/token', sendAccessToken)

// FUNCTIONS /////////////////////////////////////////////////////////////

function authorize(req, res) {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=1073744960&redirect_uri=${process.env.OAUTH_CALLBACK}&response_type=code&scope=identify%20email%20guilds%20bot`
  );
}

async function exchange(req, res) {
  // We exchange code for access token
  const userAuth = await oauth
    .tokenRequest({
      code: req.body.code,
      scope: 'identify email guilds bot',
      grantType: 'authorization_code',
    })
    .catch(console.error);

  //look up the discord id
  const userInfo = await oauth.getUser(userAuth.access_token);

  res.status(201).json(userAuth);

  //   // find or create user in the db
  //   const [user, created] = await db.user.findOrCreate({
  //     where: {
  //       // this should be discord id
  //       discord_id: userInfo.id,
  //     },
  //     defaults: {
  //       username: userInfo.username,
  //       uuid: uuidv4(),
  //       access_token: userAuth.access_token,
  //       expiry: expiryDate,
  //       refresh_token: userAuth.refresh_token,
  //       date_visited: Date.now(),
  //     },
  //   });

  //   if (!created) {
  //     await db.user
  //       .update(
  //         {
  //           access_token: userAuth.access_token,
  //           expiry: userAuth.expires_in,
  //           refresh_token: userAuth.refresh_token,
  //         },
  //         { where: { uuid: user.uuid } }
  //       )
  //       .catch(() => null);
  //   }
}


async function refresh(req, res) {
// make an api post call to discord with the client credentials
  // this returns a new access token + refresh token
  const data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: user.refresh_token,
  };

  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

  const newToken = await axios({
    method: 'post',
    url: 'https://discord.com/api/oauth2/token',
    data: qs.stringify(data),
    headers,
  }).catch((error) => console.log(error.response.request._response));

  // calculate the expiration
  let now = new Date().getTime();
  let expiryDate = now + 1000 * newToken.data.expires_in;


  await db.user
  .update(
    {
      access_token: newToken.data.access_token,
      expiry: expiryDate,
      refresh_token: newToken.data.refresh_token,
    },
    { where: { uuid: user.uuid } }
  )
  .catch(() => null);

    res.status(201).json(newToken);

    //   // find or create user in the db
    //   const [user, created] = await db.user.findOrCreate({
    //     where: {
    //       // this should be discord id
    //       discord_id: userInfo.id,
    //     },
    //     defaults: {
    //       username: userInfo.username,
    //       uuid: uuidv4(),
    //       access_token: userAuth.access_token,
    //       expiry: expiryDate,
    //       refresh_token: userAuth.refresh_token,
    //       date_visited: Date.now(),
    //     },
    //   });

    //   if (!created) {
    //     await db.user
    //       .update(
    //         {
    //           access_token: userAuth.access_token,
    //           expiry: userAuth.expires_in,
    //           refresh_token: userAuth.refresh_token,
    //         },
    //         { where: { uuid: user.uuid } }
    //       )
    //       .catch(() => null);
    //   }
  }

module.exports = router;
