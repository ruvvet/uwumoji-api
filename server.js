// MAIN SERVER FILE

// DEPENDENCIES //////////////////////////////////////////////////////////
require('dotenv').config();
const express = require('express');
const routes = require('./routes');

// APP ///////////////////////////////////////////////////////////////////
const app = express();

// MIDDLEWARE ////////////////////////////////////////////////////////////
app.use(express.urlencoded({ extended: false }));
//app.use('/', routes);



app.get('/', authorize)


function authorize(req, res){

    //but when do i send the data???
res.redirect('http://localhost:3000');

}

// LISTEN ////////////////////////////////////////////////////////////////
app.listen(process.env.PORT || 5000);
