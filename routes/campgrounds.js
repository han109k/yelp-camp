const express = require("express");
const router = express.Router();

// Error handling middleware
const catchAsync = require("../utils/catchAsync");

// log in checker
const { isLoggedIn } = require("../utils/middleware");

// JOI Validator middleware
const { validateCampground } = require("../utils/middleware");

// checking authority middleware
const { isAuthor } = require("../utils/middleware");

// Controller : campgrounds
const campgrounds = require("../controllers/campgrounds");

/*
*   ROUTES
*/

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// List all campgrounds
//router.get("/", catchAsync(campgrounds.index));

// Page for adding a new campground
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// POST Route for adding a new campground
//router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Page for showing a campground
//router.get("/:id", catchAsync(campgrounds.showCampground));

// Page for editing a campground
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

// PUT/PATCH Route for editing/updating a campground
//router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// DELETE Route for deleting a campground
//router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;