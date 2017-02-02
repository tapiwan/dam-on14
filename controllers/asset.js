const Asset = require('../models/Asset');
const multer = require('multer');
const path = require('path')





exports.getAssets = (req, res) => {
    var collectionId = req.params.id;

    Asset.find({_collectionId: collectionId}).sort({'_id': -1}).exec(function (err, results) {
        if (!err) {
            res.json(results);
        }
    });
}


exports.getAsset = (req, res) => {
    var assetId = req.params.id;

    Asset.find({_id: assetId}).exec(function (err, result) {
        if (!err) {
            res.render('asset/index', {
                title: result[0].name,
                asset : result[0]
            });
        }
    });
}

exports.deleteAsset = (req,res) => {

    //TODO Löschen vom Filesystem

    Asset.remove({ _id: req.body.assetID }, (err) => {
        if (err) { return next(err); }
        req.flash('info', { msg: 'Asset has been deleted.' });
        res.redirect('/collections');
    });
}

exports.upload = (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
        }

    })

    var upload = multer({ storage: storage }).array('assets', 5);

    upload(req, res, function(err) {

        if(err) {
            console.log('Error Occured' + err);
            return;
        }
        for(var i = 0; i < req.files.length; i++) {

            var filename = req.files[i].originalname;
            var metadata;

            if(req.body.newName){
                console.log(req.body.newName);
                filename = req.body.newName
            }


            new Asset({
                name: filename,
                fullpath: req.files[i].path,
                path: "uploads/"+req.files[i].filename,
                suffix: req.files[i].mimetype,
                type: req.body.filetype,
                tags: req.body.tags,
                size: req.files[i].size,
                encoding: req.files[i].encoding,
                user: {
                    name: req.user.profile.name,
                    _id: req.user._id
                },
                metadata: metadata,
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
