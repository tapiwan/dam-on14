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

    var upload = multer({ dest: './public/uploads'}).array('assets', 5);

    upload(req, res, function(err) {

        if(err) {
            console.log('Error Occured' + err);
            return;
        }
        for(var i = 0; i < req.files.length; i++) {
            console.log(req.files[i]);

            new Asset({
                name: req.files[i].originalname,
                path: "uploads/"+req.files[i].filename,
                suffix: req.files[i].mimetype,
                type: req.files[i].mimetype,
                _collectionId: req.body.collection
            }).save(function (err, product, numAffected) {
                if(err) {
                    console.log(err);
                }
                if(product && i == req.files.length) {
                    res.end('Files Uploaded');
                }
            });

        }




    })




  //res.redirect('/collections');
}
