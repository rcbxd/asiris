const express = require("express");
const router = express.Router();
const UserSession = require("../models/UserSession");
const User = require("../models/User");
const { genHash, validatePass } = require("../util/encrypt");
const generateToken = require("../util/authtoken");
const cors = require("cors");

router.get("/logout/", cors(), (req, res, next) => {
  const token = req.query.token;

  UserSession.findOne({
    where: {
      token: token,
      isDeleted: false
    }
  })
    .then(session => {
      session.update({
        isDeleted: true
      });
      res.send({
        success: true,
        message: "Success: Logged Out"
      });
    })
    .catch(err => {
      res.send({
        success: false,
        message: "Error: Server Error"
      });
    });
});

router.post("/signup/", cors(), (req, res, next) => {
  const { body } = req;
  let { firstName, lastName, email, password } = body;
  if (!firstName)
    return res.send({
      success: false,
      message: "Error: First name field cannot be blank"
    });
  if (!lastName)
    return res.send({
      success: false,
      message: "Error: Last name field cannot be blank"
    });
  if (!email)
    return res.send({
      success: false,
      message: "Error: Email field cannot be blank"
    });
  if (!password)
    return res.send({
      success: false,
      message: "Error: Password field cannot be blank"
    });
  email = email.toLowerCase();
  User.findAll({
    where: {
      email: email
    }
  })
    .then(users => {
      if (users.length != 0)
        return res.send({
          success: false,
          message: "Error: User with this email already exists"
        });
      else {
        User.create({
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: genHash(password)
        });
        return res.send({
          success: true,
          message: "Signed Up"
        });
      }
    })
    .catch(err => {
      return res.send({
        success: false,
        message: "Server Error."
      });
    });
});

router.post("/signin/", cors(), (req, res, next) => {
  const { body } = req;
  let { email, password } = body;
  email = email.toLowerCase();
  if (!email) {
    res.send({
      success: false,
      message: "Error: Email field cannot be blank."
    });
  }
  if (!password) {
    res.send({
      success: false,
      message: "Error: Password field cannot be blank."
    });
  }

  User.findOne({
    where: {
      email: email
    }
  })
    .then(user => {
      if (!validatePass(password, user.password)) {
        res.send({
          success: false,
          message: "Error: Invalid Credentials."
        });
      } else {
        let token = generateToken();
        UserSession.create({
          userId: user.id,
          token: token
        })
          .then(doc => {
            res.send({
              success: true,
              message: "Success: Signed In",
              token: token
            });
          })
          .catch(err => {
            res.send({
              success: false,
              message: err
            });
          });
      }
    })
    .catch(err => {
      res.send({
        success: false,
        message: "Error: Invalid Credentials"
      });
    });
});

router.get("/verify/", cors(), (req, res, next) => {
  const token = req.query.token;
  UserSession.findAll({
    where: {
      isDeleted: false,
      token: token
    }
  })
    .then(sessions => {
      if (sessions.length != 1) {
        res.send({
          success: false,
          message: "Error: Invalid."
        });
      } else {
        res.send({
          success: true,
          message: "Success: Token Is Valid."
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.send({
        success: false,
        message: "Error: Server Error."
      });
    });
});

router.get("/getuserbytoken/", cors(), (req, res) => {
  const token = req.query.token;
  UserSession.findOne({
    where: {
      token: token
    }
  })
    .then(user => {
      User.findByPk(user.userId)
        .then(user => {
          res.send({
            success: true,
            message: "Success: User found.",
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id
          });
        })
        .catch(err => {
          res.send({
            success: false,
            message: "Error: Server Error."
          });
        });
    })
    .catch(err => {
      res.send({
        success: false,
        message: "Error: Server Error."
      });
    });
});

module.exports = router;
