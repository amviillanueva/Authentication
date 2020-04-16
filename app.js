require("dotenv").config;
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.route("/")
  .get(function(req, res) {
      res.render("home");
  });

app.route("/login")
  .get(function(req, res) {
    res.render("login");
  })
  .post(function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(e, foundUser) {
      if (e) {
        console.log(e);
      } else {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          console.log("account not found")
        }
      }
    });
  });

app.route("/register")
  .get(function(req, res) {
      res.render("register");
  })
  .post(function(req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save(function(e) {
      if (e) {
        console.log(e);
      } else {
        res.render("secrets");
      }
    });
  });


app.listen(3000, function() {
  console.log("Server started at port 3000");
});
