const express = require("express");
const router = express.Router({ mergeParams: true });   // all req.params from app.js can also be accessed from this file

// Error handling middleware
const catchAsync = require("../utils/catchAsync");

// MongoDB campground model
const Campground = require("../models/campground");
const Review = require("../models/review");

// Custom error handling class
const ExpressError = require("../utils/expressError");

// JOI Schema for validation
const { reviewSchema } = require("../schemas");

// JOI Validator middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Adding Reviews For a Campground
router.post("/", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);    // adding the review to the campground
    await review.save(); await campground.save();
    req.flash("success", "Created a review!");
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE ROUTE reviews
router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });   //
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted")
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;