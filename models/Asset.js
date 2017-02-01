const mongoose = require('mongoose');
const ExifImage = require('exif').ExifImage;

const assetSchema = new mongoose.Schema({
    name: String,
    fullpath: String,
    path: String,
    suffix: String,
    type: String,
    tags: String,
    size: String,
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


const Asset = mongoose.model('Asset', assetSchema);

Asset.find(function (err, assets) {

    console.log("Please upload assets before you start");
});



module.exports = Asset;
