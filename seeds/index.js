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
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        await new Campground({
            author: "60a42968c1615a41aa417a36", // han109k user_id
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi placeat voluptatum eius corrupti explicabo inventore aperiam labore.",
            price: random / 10,
            images: [
                {
                    url: 'https://res.cloudinary.com/han109k/image/upload/v1621616640/YelpCamp/csitvwvvkxfvdy8hmmuw.jpg',
                    filename: 'YelpCamp/csitvwvvkxfvdy8hmmuw'
                },
                {
                    url: 'https://res.cloudinary.com/han109k/image/upload/v1621616640/YelpCamp/qsbfa2rk480eybtrzors.jpg',
                    filename: 'YelpCamp/qsbfa2rk480eybtrzors'
                },
                {
                    url: 'https://res.cloudinary.com/han109k/image/upload/v1621616641/YelpCamp/la3k5705pzlani1rc6zx.jpg',
                    filename: 'YelpCamp/la3k5705pzlani1rc6zx'
                }
            ]
        }).save();
    }
}

// after we've done using mongoDB close it!
seedDB().then(() => mongoose.connection.close());