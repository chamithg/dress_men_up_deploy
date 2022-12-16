const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserController {
  getAllUsers = (req, res) => {
    User.find()
      .then((allUsers) => {
        res.json({ results: allUsers });
      })
      .catch((err) => {
        res.json({ error: err });
      });
  };

  register = (req, res) => {
    User.find({ email: req.body.email })
      .then((usersWithEmail) => {
        console.log("responce found user", usersWithEmail);
        if (usersWithEmail.length == 0) {
          User.create(req.body)
            .then((user) => {
              const userToken = jwt.sign(
                {
                  id: user._id,
                },
                process.env.SECRET_KEY
              );
              res.cookie("usertoken", userToken, process.env.SECRET_KEY, {
                httpOnly: true,
              });
              res.json({ msg: "success!", user: user });
              console.log(user);
            })
            .catch((err) => res.json(err));
        } else {
          res.json({ errors: { email: { message: "email is taken!" } } });
        }
      })

      .catch((err) => {
        console.log("error", err);
      });
  };

  login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user === null) {
      // email not found in users collection'
      return res.json({
        error: "User not found. check your input and try again",
      });
    }

    // if we made it this far, we found a user with this email address
    // let's compare the supplied password to the hashed password in the database
    const correctPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!correctPassword) {
      // password wasn't a match
      return res.json({ error: "Password is incorect" });
    }

    // if we made it this far, the password was correct
    const userToken = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
      },
      process.env.SECRET_KEY
    );

    // note that the response object allows chained calls to cookie and json
    res
      .cookie("usertoken", userToken, process.env.SECRET_KEY, {
        httpOnly: true,
      })
      .json({ results: user });
  };

  logout = (req, res) => {
    console.log("logout");
    res.clearCookie("usertoken");
    res.sendStatus(200);
  };

  deleteOneItem = (req, res) => {
    User.findOneAndRemove({ _id: req.params.id })
      .then((deletedItem) => {
        res.json({ results: deletedItem });
      })
      .catch((err) => {
        res.json(err);
      });
  };

  getLoggedUser = (req, res) => {
    const decodedJwt = jwt.decode(req.cookies.usertoken, { complete: true });
    if (decodedJwt === null) {
      console.log("no logged user");
    } else {
      User.findOne({ _id: decodedJwt.payload.id })
        .then((foundUser) => {
          res.json({ results: foundUser });
        })
        .catch((err) => {
          res.json(err);
        });
    }
  };
}

module.exports = new UserController();
