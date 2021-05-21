const cloudinary = require('cloudinary').v2;
// https://www.npmjs.com/package/multer-storage-cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Congiguring the cloudinary such as credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Setting up a instance of cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "YelpCamp",
        allowedFormats: ["jpeg", "png", "jpg"],
    }
});

module.exports = {
    cloudinary,
    storage
};