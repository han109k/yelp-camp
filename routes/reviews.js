const express = require("express");
const router = express.Router({ mergeParams: true });   // all req.params from app.js can also be accessed from this file

// Error handling middleware
const catchAsync = require("../utils/catchAsync");

// log in checker
const { isLoggedIn } = require("../utils/middleware");

// JOI Validator middleware
const { validateReview } = require("../utils/middleware");

// checking authority middleware
const { isReviewAuthor } = require("../utils/middleware");

// Controller : reviews
const reviews = require("../controllers/reviews");

/*
*   ROUTES
*/

// Adding Reviews For a Campground
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// DELETE ROUTE reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;