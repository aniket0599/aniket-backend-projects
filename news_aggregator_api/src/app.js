const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('express').Router();
const newsInfo = require('./routes/newsInfo');
// const User = require("./models/user");
// var jwt = require("jsonwebtoken");
// var bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {signin, signup} = require("./controllers/authcontroller");
require("dotenv")
  .config();

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

//Connect to database

try {
  mongoose.connect("mongodb+srv://aniketpec22:qazmlp098@newsapi.odzybrq.mongodb.net/", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log("connected to db");
} catch (error) {
  handleError(error);
}

const app = express();
app.use(cors());
app.use(routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const PORT = 3000;

routes.get('/', (req, res)=>{
  res.status(200).send("Welcome to the airtribe news app");
});

routes.use('/', newsInfo);

routes.post('/register', signup);

routes.post('/signin', signin);

app.listen(process.env.PORT || PORT, (error) =>{
  if(!error)
      console.log("Server is Successfully Running and App is listening on port " + PORT);
  else
      console.log("Error occurred, server can't start", error);
  }
);