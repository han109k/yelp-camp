const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
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
