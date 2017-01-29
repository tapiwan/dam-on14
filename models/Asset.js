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
    if (assets.length) {
        console.log("Assets Demo bereits vorhanden");
        return;
    }
    new Asset({
        name: "Testasset",
        suffix: ".jpg",
        type: "Image",
        _collectionId: "587f3c1b5db1c41e4dd6d849"
    }).save();

    console.log("Testasset hinzugefügt");
});

module.exports = Asset;
