const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");

//auth check

router.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    console.log(req.user);
    return res.status(StatusCodes.OK).json(req.user);
  }
);

// below you can find alternative to above code (you have access to err, user, and info from passport done function)

// router.get("/", (req, res) => {
//   passport.authenticate(
//     "jwt",
//     { session: false, failureMessage: true },
//     (err, user, info) => {
//       console.log(`error: ${err}`);
//       console.log(`user: ${user}`);
//       console.log(`info message: ${info.message}`);
//       // rest of code
//     }
//   )(req, res);
// });

router.post("/register", async (req, res) => {
  const { username, email, password, passwordRepeat } = req.body;
  let validForm = true;
  let errorMessages = {
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  };

  if (username.length < 3) {
    errorMessages.username = "this field must be at least 3 characters";
    validForm = false;
  }
  if (username.indexOf(" ") >= 0) {
    errorMessages.username = "username can't contain space";
    validForm = false;
  }
  if (email.indexOf(" ") >= 0) {
    errorMessages.email = "email can't contain space";
    validForm = false;
  }
  if (password.length < 6) {
    errorMessages.password = "this field must be at least 6 characters";
    validForm = false;
  }
  if (password !== passwordRepeat) {
    errorMessages.passwordRepeat = "passwords aren't equal";
    validForm = false;
  }

  if (validForm) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        errorMessages.email = "email is already registered";
        return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
      }
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          throw new Error("bcrypt error");
        }
        const user = await User.create({
          username,
          email,
          password: hash,
        });
        return res.status(StatusCodes.CREATED).json("account has been created");
      });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
  }
});

router.post("/login", async (req, res) => {
  const { email, password, remember } = req.body;
  let errorMessages = {
    email: "",
    password: "",
    server: "",
  };
  try {
    const user = await User.findOne({ email });

    if (!user) {
      errorMessages.email = "email or password incorrect";
      errorMessages.password = "email or password incorrect";
      return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
    }
    if (!user.verified) {
      errorMessages.server = "please verify your email";
      return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        throw new Error("bcrypt error");
      }
      if (result) {
        let cookieMaxAge = 1000 * 60 * 60 * 24 * 1; //cookie expires after 1 day
        if (remember) {
          cookieMaxAge = cookieMaxAge * 14; //cookie expires after 14 days
        }

        const access_token = jwt.sign(
          { _id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: cookieMaxAge }
        );
        return res
          .status(StatusCodes.OK)
          .cookie("access_token", access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: cookieMaxAge,
          })
          .json("successfull login");
      } else {
        errorMessages.email = "email or password incorrect";
        errorMessages.password = "email or password incorrect";
        return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
