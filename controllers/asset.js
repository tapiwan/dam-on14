const Asset = require('../models/Asset');
const multer = require('multer');







exports.getAssets = (req, res) => {
    var collectionId = req.params.id;

    Asset.find({_collectionId: collectionId}).exec(function (err, results) {
        if (!err) {
            res.json(results);
        }
    });
}

exports.upload = (req, res) => {

    var upload = multer({ dest: './uploads/tmp'}).array('assets', 5);

    upload(req, res, function(err) {

        if(err) {
            console.log('Error Occured' + err);
            return;
        }
        console.log(req.files);
        res.end('Files Uploaded');
    })

    /*new Asset({
        name: req.body.name,
        suffix: req.body.suffix,
        type: req.body.type,
        _collectionId: req.body.collectionId
    }).save();
    */

    //TODO: Flash success/error, move this into save() as callback.
  //res.redirect('/collections');
}
