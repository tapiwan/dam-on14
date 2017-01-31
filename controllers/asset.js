const Asset = require('../models/Asset');
const multer = require('multer');







exports.getAssets = (req, res) => {
    var collectionId = req.params.id;

    Asset.find({_collectionId: collectionId}).sort({'_id': -1}).exec(function (err, results) {
        if (!err) {
            res.json(results);
        }
    });
}

exports.deleteAsset = (req,res) => {
    console.log(req);

    Asset.remove({ _id: req.body.assetID }, (err) => {
        if (err) { return next(err); }
        req.flash('info', { msg: 'Asset has been deleted.' });
        res.redirect('/collections');
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

            var filename = req.files[i].originalname;

            if(req.body.newName){
                console.log(req.body.newName);
                filename = req.body.newName
            }


            new Asset({
                name: filename,
                path: "uploads/"+req.files[i].filename,
                suffix: req.files[i].mimetype,
                type: req.body.filetype,
                tags: req.body.tags,
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
