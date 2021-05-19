const express = require("express");
const router = express.Router({ mergeParams: true });   // all req.params from app.js can also be accessed from this file

// Error handling middleware
const catchAsync = require("../utils/catchAsync");

// MongoDB campground model
const Campground = require("../models/campground");
const Review = require("../models/review");

// log in checker
const { isLoggedIn } = require("../utils/middleware");

// JOI Validator middleware
const { validateReview } = require("../utils/middleware");

// checking authority middleware
const { isReviewAuthor } = require("../utils/middleware");

// Adding Reviews For a Campground
router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;       // giving reviews an author which current user
    campground.reviews.push(review);    // adding the review to the campground
    await review.save(); await campground.save();
    req.flash("success", "Created a review!");
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE ROUTE reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });   //
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted")
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;