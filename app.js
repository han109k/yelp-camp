const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// HTTP method overrides for HTML Forms
const methodOverride = require("method-override");

// Custom error handling class
const ExpressError = require("./utils/expressError");

// EJS enhancer
const ejsMate = require("ejs-mate");
const app = express();

// Express Routes
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

// Mongoose setup & connection
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

/* 
*       ROUTES
*/

// Home page YELPCamp
app.get("/", (req, res) => {
    res.render("home")
})

// Campgrounds  router path  +  router 
app.use("/campgrounds", campgrounds);

// Campgrounds  router path  +  router 
app.use("/campgrounds/:id/reviews", reviews);

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