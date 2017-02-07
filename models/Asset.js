const mongoose = require('mongoose');
const ExifImage = require('exif').ExifImage;
const exif = require('exiftool');
const iptc = require('node-iptc');
const sizeOf = require('image-size');
const watson = require('watson-developer-cloud');
const fs = require('fs');
const piexif = require("piexifjs");

const visual_recognition = watson.visual_recognition({
    url: 'https://gateway-a.watsonplatform.net/visual-recognition/api',
    api_key: process.env.WatsonAPI,
    version: 'v3',
    version_date: '2016-05-19'
});




const assetSchema = new mongoose.Schema({
    name: String,
    description: String,
    fullpath: String,
    path: String,
    suffix: String,
    type: String,
    tags: String,
    size: String,
    width: String,
    height: String,
    encoding: String,
    rating: String,
    user: {
        name: String,
        _id: mongoose.Schema.Types.ObjectId
    },
    comments: [
        {
            name: String,
            comment: String,
            date: { type: Date, default: Date.now }

        }],
    metadata: Object,
    metadataFile: Object,
    customMetadata: Object,
    iptc: Object,
    watsonImage: Object,
    watsonFace: Object,

    _collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }
}, { timestamps: true });

assetSchema.pre('save', function(next) {
    if (this.isNew) {
        const data = this;

        var jpeg = fs.readFileSync(data.fullpath).toString("binary");

        // READ EXIF
        if(data.suffix == "image/jpeg")  {

            var exifObj = piexif.load(jpeg);
            data.metadata = exifObj;
            next();



            //
            /*new ExifImage({ image : data.fullpath }, function (error, exifData) {
                if (error)
                    console.log('Error: '+error.message);
                else
                    data.metadata = exifData;

                next();

            });
            */
        }
        else {
            next();
        }
    }
    else {
        next();
    }

});


// EXIFTOOL FILES
assetSchema.pre('save', function(next) {
    const asset = this;
    if (this.isNew) {


        if (asset.type != "image" || asset.suffix != "image/jpeg") {
            fs.readFile(asset.fullpath, function (err, data) {
                if (err) {
                    throw err
                }
                exif.metadata(data, function (err, file) {
                    const meta = {
                        exiftoolVersionNumber: file.exiftoolVersionNumber,
                        fileType: file.fileType,
                        fileTypeExtension: file.fileTypeExtension,
                        mimeType: file.mimeType,
                        pdfVersion: file.pdfVersion,
                        linearized: file.linearized,
                        createDate: file.createDate,
                        creator: file.creator,
                        modifyDate: file.modifyDate,
                        hasXFA: file.hasXFA,
                        xmpToolkit: file.xmpToolkit,
                        creatorTool: file.creatorTool,
                        metadataDate: file.metadataDate,
                        keywords: file.keywords,
                        producer: file.producer,
                        format: file.format,
                        title: file.title,
                        documentID: file.documentID,
                        instanceID: file.instanceID,
                        pageCount: file.pageCount,
                        historyAction: file.historyAction,
                        historyWhen: file.historyWhen,
                        historySoftwareAgent: file.historySoftwareAgent,
                        colorMode: file.colorMode,
                        iccProfileName: file.iccProfileName,
                        xResolution: file.xResolution,
                        displayedUnitsX: file.displayedUnitsX,
                        yResolution: file.yResolution,
                        displayedUnitsY: file.displayedUnitsY,
                        printStyle: file.printStyle,
                        printPosition: file.printPosition,
                        printScale: file.printScale,
                        globalAngle: file.globalAngle,
                        globalAltitude: file.globalAltitude,
                        urlList: file.urlList,
                        slicesGroupName: file.slicesGroupName,
                        colorSpaceData: file.colorSpaceData,
                        deviceModel: file.deviceModel,
                        profileCopyright: file.profileCopyright,
                        profileDescription: file.profileDescription,
                        writerName: file.writerName,
                        readerName: file.readerName,
                        orientation: file.orientation,
                        resolutionUnit: file.resolutionUnit,
                        software: file.software,
                        colorSpace: file.colorSpace,
                        exifImageWidth: file.exifImageWidth,
                        exifImageHeight: file.exifImageHeight,
                        imageSize: file.imageSize,
                        megapixels: file.megapixels
                    }

                    asset.metadataFile = meta;
                    next();

                });

            });
        }
        else {
            next();

        }
    }
    else {
        next();

    }




});
assetSchema.pre('save', function(next) {
    const asset = this;
    if (this.isNew) {

        if (asset.suffix == "image/jpeg" || asset.suffix == "image/tiff") {
            fs.readFile(asset.fullpath, function (err, data) {
                if (err) {
                    throw err
                }
                asset.iptc = iptc(data);
                next();
            });

        }
        else {
            next();
        }
    }
    else {
        next();
    }
});
// IMAGE RECOGNITATION
assetSchema.pre('save', function (next) {
    if (this.isNew) {
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
    }
    else {
        next();
    }



});
// FACE DETECTION
assetSchema.pre('save', function (next) {
    if (this.isNew) {
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
    }
    else {
        next();
    }




});

assetSchema.pre('save', function(next) {
    if (this.isNew) {
        const data = this;

        // GET WIDTH AND HEIGHT
        if(data.type == "image" || data.type == "psd")  {

            sizeOf(data.fullpath, function (err, dimensions) {
                data.width = dimensions.width;
                data.height = dimensions.height;
                next();
            });
        }
        else {
            next();
        }
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

