const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// Session
const session = require("express-session");

// Flash
const flash = require("connect-flash");

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

// Serving static files; defining the path
app.use(express.static(__dirname + "/public"));

// Mongoose setup & connection
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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

const sessionConfig = {
    secret : "shouldbebettersecret",
    resave : false,
    saveUninitialized: true,
    cookie : {
        httpOnly: true, // by default it is true
        expries: Date.now() + 1000 * 60 * 60 * 24 * 7,  // after 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// Express session package use
app.use(session(sessionConfig));

// Flash package use
app.use(flash());

// Every single request we define a flash message that can be used during req/res cycle.
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

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

// for every other request
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