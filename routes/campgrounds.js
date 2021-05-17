const express = require("express");
const router = express.Router();

// Error handling middleware
const catchAsync = require("../utils/catchAsync");

// MongoDB campground model
const Campground = require("../models/campground");

// Custom error handling class
const ExpressError = require("../utils/expressError");

// JOI Schema for validation
const { campgroundSchema } = require("../schemas");

// JOI Validator middleware
const validateCampground = (req, res, next) => {
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

/*
*   ROUTES
*/

// List all campgrounds
router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}))

// Page for adding a new campground
router.get("/new", (req, res) => {
    res.render("campgrounds/new");
})

// POST Route for adding a new campground
router.post("/", validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Page for showing a campground
router.get("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    //console.log(campground);
    if(!campground) {
        req.flash("error", "Cannot find the campground")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}))

// Page for editing a campground
router.get("/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash("error", "Cannot find the campground")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}))

// PUT/PATCH Route for editing/updating a campground
router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate({ _id: req.params.id }, { ...req.body.campground }, { new: true });
    //console.log(campground);
    req.flash("success", "Successfully updated the campground!")
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE Route for deleting a campground
router.delete("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    console.log(campground);
    req.flash("success", "Successfully deleted the campground")
    res.redirect("/campgrounds");
}))

module.exports = router;