// Custom error handling class
const ExpressError = require("./expressError");

// MongoDB campground and Review model
const Campground = require("../models/campground");
const Review = require("../models/review");

// JOI Schema for validation of campgrounds
const { campgroundSchema } = require("../schemas");

// JOI Schema for validation of reviews
const { reviewSchema } = require("../schemas");

module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user);
    // Checking if user authenticated
    if(!req.isAuthenticated()) {
        // return behavior 
        //console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in!");
        return res.redirect("/login");
    }
    next();
}

// JOI Validator middleware
module.exports.validateCampground = (req, res, next) => {
    // validate() return a object => result {value, error}
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // result.error.details is an array
        // parse messages which are seperated by comma
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
    //console.log(result);
}

// checking authority of a campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// JOI Validator middleware
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// checking authority of review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;    // id => campground id | reviewId => review id
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}