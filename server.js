// MAIN SERVER FILE

// DEPENDENCIES //////////////////////////////////////////////////////////
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const routes = require('./routes');

// APP ///////////////////////////////////////////////////////////////////
const app = express();

// MIDDLEWARE ////////////////////////////////////////////////////////////
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

app.use(function (req, res, next) {
  res.status(404);
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500);
});

// LISTEN ////////////////////////////////////////////////////////////////
app.listen(process.env.PORT || 5000);
