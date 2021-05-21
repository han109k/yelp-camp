const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// // https://res.cloudinary.com/han109k/image/upload/c_thumb,w_200,g_face/v1621626812/YelpCamp/upzfbbups2ys2w0m2sp8.jpg

const ImageSchema = new Schema({
    url:String,
    filename: String
})

// we dont need store thumbnail so that's why we're using virtuals with cloudinary transformation
// calling this transformed image thumbnail
ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_200");
});

// As we can nest schemas
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
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
});

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
