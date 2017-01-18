const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: String,
  assets: [
      {
          name: String,
          date: { type: Date, default: Date.now }
      }

    ]

}, { timestamps: true });




const Collection = mongoose.model('Collection', collectionSchema);

Collection.find(function (err, collections) {
    if (collections.length) {
        console.log("Collections Demo bereits vorhanden");
        return;
    }
    new Collection({
        name: "Testcollection"

    }).save();

    console.log("Testcollection hinzugefügt");
});
module.exports = Collection;
