//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
const port = 3000;

console.log(process.env.SECRET_KEY);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET_KEY, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});


app.get("/logout", (req, res) => {
  res.render("home");
});


app.post("/register", (req, res) => {
  const newUser = new User({
  email: req.body.username,
  password: req.body.password
  });

  newUser.save(function(err) {
    if(err) {
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if (err){
      console.log(err);
    }else{
      // if(foundUser) {
        if(foundUser.password === password) {
          res.render("secrets");
        }
      // }
    }
  });
});

app.listen(port, function() {
  console.log("Server started on port " + port);
});
