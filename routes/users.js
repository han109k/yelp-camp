const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register));


//router.get("/register", users.renderRegister);

//router.post("/register", catchAsync(users.register));

router.route("/login")
    .get(users.renderLogin)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), users.login);

//router.get("/login", users.renderLogin);

// !!! using authenticate() to login without using session manually
//router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), users.login);

// using logout() 
router.get("/logout", users.logout);

module.exports = router;