const passport = require("passport");
const { Strategy } = require("passport-jwt");
const User = require("../models/User");

// custom jwt extractor
const cookieExtractor = (req) => {
  const token = req.body.accessToken;
  // const token = req.cookies["accessToken"];
  if (token) {
    return token;
  } else {
    return null;
  }
};

passport.use(
  new Strategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    },
    (req, payload, done) => {
      User.findById(payload._id, (err, user) => {
        if (err) {
          return done(err, false, { message: "database error" });
        }
        if (user) {
          req.user = user;
          return done(null, user, { message: "successfully authenticated" });
        } else {
          return done(null, false, { message: "user not found" });
        }
      });
    }
  )
);
