const mongoose = require('mongoose');
const ExifImage = require('exif').ExifImage;
const iptc = require('node-iptc');
const sizeOf = require('image-size');
const fs = require('fs');

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
    iptc: Object,

    _collectionId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

assetSchema.pre('save', function(next) {
    const data = this;
    // READ EXIF

    if(data.suffix == "image/jpeg" || data.suffix == "image/tiff" )  {

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
    const asset = this;

    if(asset.suffix == "image/jpeg" || asset.suffix == "image/tiff" )  {
        fs.readFile(asset.fullpath, function(err, data) {
            if (err) { throw err }
            asset.iptc = iptc(data);
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
