// MongoDB campground model
const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;   // adding campground's author
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    // to show reviews & and author -> we use populate()
    //const campground = await Campground.findById(req.params.id).populate("reviews").populate("author");
    const campground = await Campground.findById(req.params.id).populate({ // populate reviews and its author then populate campground's author
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    console.log(campground);
    if(!campground) {
        req.flash("error", "Cannot find the campground")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash("error", "Cannot find the campground")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate({ _id: req.params.id }, { ...req.body.campground }, { new: true });
    //console.log(campground);
    req.flash("success", "Successfully updated the campground!")
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    console.log(campground);
    req.flash("success", "Successfully deleted the campground")
    res.redirect("/campgrounds");
};