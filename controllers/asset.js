const Asset = require('../models/Asset');

/**
 * POST /upload/assets
 * Upload assets to collection.
 */

exports.getAssets = (req, res) => {
    var collectionId = req.params.id;

    Asset.find({_collectionId: collectionId}).exec(function (err, results) {
        if (!err) {
            res.json(results);
        }
    });
}

exports.upload = (req, res) => {
    new Asset({
        name: req.body.name,
        suffix: req.body.suffix,
        type: req.body.type,
        _collectionId: req.body.collectionId
    }).save();

    //TODO: Flash success/error, move this into save() as callback.
  res.redirect('/collections');
}
