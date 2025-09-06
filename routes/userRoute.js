const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveOriginalUrl } = require("../middlewares");
const {
  renderSignup,
  signUp,
  renderLogin,
  login,
  logOut,
} = require("../controllers/user");

//! Signup routes
router.route("/signup")
.get( renderSignup)
.post( signUp)

//! Login routes
router.route("/login")
.get( renderLogin)
.post(saveOriginalUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);


//! Logout route
router.get("/logout", logOut);
module.exports = router;
