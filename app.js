const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");
// review model
const Review = require("./models/review");
// HTTP method overrides for HTML Forms
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/expressError");
// Joi Validation
const { campgroundSchema, reviewSchema } = require("./schemas");
// EJS enhancer
const ejsMate = require("ejs-mate");
const app = express();


mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected");
});

//  View engines
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))


// JOI validator function
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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


/* 
*       ROUTES
*/

// Home page YELPCamp
app.get("/", (req, res) => {
    res.render("home")
})

// List all campgrounds
app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}))

// Page for adding a new campground
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

// POST Route for adding a new campground
app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Page for showing a campground
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    console.log(campground);
    res.render("campgrounds/show", { campground });
}))

// Page for editing a campground
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}))

// PUT/PATCH Route for editing/updating a campground
app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate({ _id: req.params.id }, { ...req.body.campground }, { new: true });
    console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE Route for deleting a campground
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    console.log(campground);
    res.redirect("/campgrounds");
}))

// Adding Reviews For a Campground
app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);    // adding the review to the campground
    await review.save(); await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

// DELETE ROUTE reviews
app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });   //
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));

// for every request
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

// next(e)
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Something went wrong.";
    res.status(status).render("error", { err })
})

app.listen(3000, () => {
    console.log("Listening on port 3000.");
})