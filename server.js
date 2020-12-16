// MAIN SERVER FILE

// DEPENDENCIES //////////////////////////////////////////////////////////
require('dotenv').config();
const cors = require('cors')
const express = require('express');
const routes = require('./routes');

// APP ///////////////////////////////////////////////////////////////////
const app = express();

// MIDDLEWARE ////////////////////////////////////////////////////////////
app.use(cors({origin: '*'}));
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);



// organize routes by responsibility -
//


// LISTEN ////////////////////////////////////////////////////////////////
app.listen(process.env.PORT || 5000);
