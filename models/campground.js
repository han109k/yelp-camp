const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// // https://res.cloudinary.com/han109k/image/upload/c_thumb,w_200,g_face/v1621626812/YelpCamp/upzfbbups2ys2w0m2sp8.jpg

const ImageSchema = new Schema({
    url:String,
    filename: String
})

// we dont need store thumbnail so we're using virtuals with cloudinary's transformation api
// calling this transformed image thumbnail
ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200");
});

// adding virtuals to JSON stringfy 
const opts = { toJSON: { virtuals: true } };

// Nesting schemas
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String,
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {   // authorization
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

/**
 *  // Since mapbox cluster needs field called "properties" to show pop up text on the map
 *  // we need to define a virtual since we don't want to add these data to our MongoDB
 *  properties : {
 *      popUpMarkup: {
 *          link: String,
 *          title: String
 *      } 
 *  }
 */
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
    
})

// used for campgrounds/delete
CampgroundSchema.post("findOneAndDelete", async (doc) => {
    console.log(doc);
    if(doc) {   // if we found the document that deleted
        await Review.deleteMany({   // delete reviews which are in the deleted campground
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
