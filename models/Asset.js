const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: String,
    path: String,
    suffix: String,
    type: String,
    tags: String,
    _collectionId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });



const Asset = mongoose.model('Asset', assetSchema);

Asset.find(function (err, assets) {

    console.log("Please upload assets before you start");
});

module.exports = Asset;
