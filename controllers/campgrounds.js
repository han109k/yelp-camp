// MongoDB campground model
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");

// Mapbox geocoding service
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const MY_ACCESS_TOKEN = process.env.MAPBOX_TOKEN;
const geocodingService = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    // calling mapbox api
    const geoData = await geocodingService.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    console.log(geoData.body.features[0].geometry)
    const campground = new Campground(req.body.campground);
    // parsing geodata call result
    campground.geometry = geoData.body.features[0].geometry;
    // map over the array of images that sent with form using multer (req.files)
    // then set campground model images to that
    campground.images = req.files.map(o => ({ url: o.path, filename: o.filename }));
    // adding campground's author
    campground.author = req.user._id;
    await campground.save();
    console.log("Campground : ", campground);
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
    if (!campground) {
        req.flash("error", "Cannot find the campground")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find the campground")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate( id, { ...req.body.campground }, { new: true });
    const imgs = req.files.map( o => ({ url: o.path, filename: o.filename }));  // save them into an array
    campground.images.push(...imgs);    // push campground.images
    await campground.save();
    if(req.body.deleteImages) {
        // deleting images on cloudinary storage
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // deleting form yelp-camp mongoDB
        await campground.updateOne({$pull : { images : { filename : { $in: req.body.deleteImages } } } });
        console.log(campground);
    }
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