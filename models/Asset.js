const mongoose = require('mongoose');
const ExifImage = require('exif').ExifImage;
const sizeOf = require('image-size');

const assetSchema = new mongoose.Schema({
    name: String,
    fullpath: String,
    path: String,
    suffix: String,
    type: String,
    tags: String,
    size: String,
    width: String,
    height: String,
    encoding: String,
    user: {
        name: String,
        _id: mongoose.Schema.Types.ObjectId
    },
    metadata: Object,

    _collectionId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

assetSchema.pre('save', function(next) {
    const data = this;
    // READ EXIF

    if(data.suffix == "image/jpeg" || data.suffix == "image/tiff" )  {
        console.log("Try to find EXIF")
        new ExifImage({ image : data.fullpath }, function (error, exifData) {
            if (error)
                console.log('Error: '+error.message);
            else
                data.metadata = exifData;
                next();

        });
    }
    else {
        next();
    }
});

assetSchema.pre('save', function(next) {
    const data = this;

    // GET WIDTH AND HEIGHT
    if(data.type == "image" || data.type == "psd")  {

        sizeOf(data.fullpath, function (err, dimensions) {
            data.width = dimensions.width;
            data.height = dimensions.height
            next();
        });
    }
    else {
        next();
    }
});



const Asset = mongoose.model('Asset', assetSchema);

Asset.find(function (err, assets) {

    console.log("Please upload assets before you start");
});



module.exports = Asset;
