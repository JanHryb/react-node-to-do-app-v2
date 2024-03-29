const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const TaskCategory = require("../models/TaskCategory");

//auth check

router.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res) => {
    const user = {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      verified: req.user.verified,
    };
    // await TaskCategory.create({
    //   name: "test",
    //   icon: "icon",
    //   color: "color",
    //   userId: req.user._id,
    // });
    // console.log(req.user);
    return res.status(StatusCodes.OK).json(user);
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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
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
        let tokenExpiryTime = "1d";
        if (remember) {
          tokenExpiryTime = "7d";
        }

        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: tokenExpiryTime }
        );
        return (
          res
            .status(StatusCodes.OK)
            // .cookie("accessToken", accessToken, {
            //   httpOnly: true,
            //   secure: true,
            //   sameSite: "none",
            // })
            .json({ accessToken })
        );
      } else {
        errorMessages.email = "email or password incorrect";
        errorMessages.password = "email or password incorrect";
        return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post("/logout", (req, res) => {
  return (
    res
      .status(StatusCodes.OK)
      // .clearCookie("accessToken")
      .json("you are logged out")
  );
});

router.post("/edit-username", async (req, res) => {
  const { username, userId } = req.body;
  let validForm = true;
  let errorMessages = {
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    newPasswordRepeat: "",
  };

  if (username.length < 3) {
    errorMessages.username = "this field must be at least 3 characters";
    validForm = false;
  }
  if (username.indexOf(" ") >= 0) {
    errorMessages.username = "username can't contain space";
    validForm = false;
  }

  if (validForm) {
    try {
      const update = await User.findByIdAndUpdate(
        { _id: userId },
        { username }
      );
      // console.log(update);
      return res.status(StatusCodes.OK).json("username updated successfully");
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
  }
});

router.post("/edit-password", async (req, res) => {
  const { currentPassword, newPassword, newPasswordRepeat, userId } = req.body;
  let validForm = true;
  let errorMessages = {
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    newPasswordRepeat: "",
  };

  if (currentPassword.length < 6) {
    validForm = false;
    errorMessages.currentPassword = "this field must be at least 6 characters";
  }
  if (newPassword === currentPassword) {
    validForm = false;
    errorMessages.newPasswordRepeat = "new password is the same as current one";
  }
  if (newPassword.length < 6) {
    validForm = false;
    errorMessages.newPassword = "this field must be at least 6 characters";
  }
  if (newPassword !== newPasswordRepeat) {
    validForm = false;
    errorMessages.newPasswordRepeat = "passwords aren't equal";
  }

  if (validForm) {
    try {
      const user = await User.findById({ _id: userId });
      bcrypt.compare(currentPassword, user.password, (err, result) => {
        if (err) throw new Error("bcrypt error");
        if (result) {
          bcrypt.hash(newPassword, 10, async (err, hash) => {
            if (err) throw new Error("bcrypt error");
            const update = await User.findByIdAndUpdate(
              { _id: userId },
              { password: hash }
            );
            // console.log(update);
            return res
              .status(StatusCodes.OK)
              .json("password updated successfully");
          });
        } else {
          errorMessages.currentPassword = "password is incorrect";
          return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
        }
      });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
  }
});

router.post("/edit-email", async (req, res) => {
  const { email, userId } = req.body;
  let validForm = true;
  let errorMessages = {
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    newPasswordRepeat: "",
  };

  if (email.indexOf(" ") >= 0) {
    validForm = false;
    errorMessages.email = "email can't contain space";
  }

  if (validForm) {
    try {
      const update = await User.findByIdAndUpdate({ _id: userId }, { email });
      return res.status(StatusCodes.OK).json("email updated successfully");
    } catch (err) {
      if (err.code === 11000) {
        errorMessages.email = "this email is already in use";
        return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessages);
  }
});

module.exports = router;
