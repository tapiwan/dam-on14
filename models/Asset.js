const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: String,
  suffix: String,
  type: String,
  _collectionId: mongoose.Schema.Types.ObjectId
}, { timestamps: true });



const Asset = mongoose.model('Asset', assetSchema);



module.exports = Asset;
