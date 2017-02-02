const mongoose = require('mongoose');
const ExifImage = require('exif').ExifImage;
const iptc = require('node-iptc');
const sizeOf = require('image-size');
const watson = require('watson-developer-cloud');
const fs = require('fs');
const visual_recognition = watson.visual_recognition({
    url: 'https://gateway-a.watsonplatform.net/visual-recognition/api',
    api_key: "53d3b7b1e8ee93d0be2709da5fc53dac416429f6",
    version: 'v3',
    version_date: '2016-05-19'
});


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
    watsonImage: Object,
    watsonFace: Object,

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
// IMAGE RECOGNITATION
assetSchema.pre('save', function (next) {
    const asset = this;

    if(asset.type == "image") {

        var params = {
            images_file: fs.createReadStream(asset.fullpath)
        };

        visual_recognition.classify(params, function (err, res) {
            if (err) {
                console.log(err);
                next();
            }
            else {
                asset.watsonImage = res;
                next();
            }
        });
    }
    else {
        next();
    }


});
// FACE DETECTION
assetSchema.pre('save', function (next) {
    const asset = this;

    if(asset.type == "image") {

        var params = {
            images_file: fs.createReadStream(asset.fullpath)
        };



        visual_recognition.detectFaces(params, function (err, res) {
            if (err) {
                console.log(err);
                next();
            }
            else {
                asset.watsonFace = res;
                next();
            }
        });
    }
    else {
        next();
    }


})
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
