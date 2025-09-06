const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();


// connect cloudinary to our project
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// create a storage object
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'wonderLust_DEV',
        allowedFormats: ['jpeg', 'png', 'jpg', 'pdf'],        
    }
})

module.exports = {
    cloudinary,
    storage
}