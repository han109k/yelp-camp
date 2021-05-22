const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");


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


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});   // empty database
    for (let i = 0; i < 300; i++) {
        const random = Math.floor(Math.random() * 1000);
        await new Campground({
            author: "60a42968c1615a41aa417a36", // han109k user_id
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi placeat voluptatum eius corrupti explicabo inventore aperiam labore.",
            price: random / 10,
            geometry: {
                type : "Point",
                coordinates : [
                    cities[random].longitude,
                    cities[random].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/han109k/image/upload/v1621626812/YelpCamp/upzfbbups2ys2w0m2sp8.jpg',
                    filename: 'YelpCamp/upzfbbups2ys2w0m2sp8'
                },
                {
                    url: 'https://res.cloudinary.com/han109k/image/upload/v1621620406/YelpCamp/pigqobdnqra1rfb7o0ca.jpg',
                    filename: 'YelpCamp/pigqobdnqra1rfb7o0ca'
                },
                {
                    url: 'https://res.cloudinary.com/han109k/image/upload/v1621604896/YelpCamp/uma18mne9batvzwnlkgz.jpg',
                    filename: 'YelpCamp/uma18mne9batvzwnlkgz'
                }
            ]
        }).save();
    }
}

// after we've done using mongoDB close it!
seedDB().then(() => mongoose.connection.close());