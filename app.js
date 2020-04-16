const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

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
        if (foundUser) {
          bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
            if(result == true) {
              res.render("secrets");
            }
          });
        }
      }
    });
  });

app.route("/register")
  .get(function(req, res) {
    res.render("register");
  })

  .post(function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser.save(function(e) {
        if (e) {
          console.log(e);
        } else {
          res.render("secrets");
        }
      });
    });

  });


app.listen(3000, function() {
  console.log("Server started at port 3000");
});
