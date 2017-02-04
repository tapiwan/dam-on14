const Asset = require('../models/Asset');
const Collection = require('../models/Collection');
const Settings = require('../models/Settings');

const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const http = require('http');
const fs = require('fs');






exports.getAssets = (req, res) => {
    var collectionId = req.params.id;

    Asset.find({_collectionId: collectionId}).sort({'_id': -1}).exec(function (err, results) {
        if (!err) {
            res.json(results);
        }
    });
};


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
};

exports.deleteAsset = (req,res) => {

    //TODO Löschen vom Filesystem

    Asset.remove({ _id: req.body.assetID }, (err) => {
        if (err) { return next(err); }
        req.flash('info', { msg: 'Asset has been deleted.' });
        res.redirect('/collections');
    });
};

exports.editAsset = (req, res) => {

        Asset.findOne({ _id: req.body.assetID }, (err, asset) => {
            if(err){
                console.log(err);
            }
            asset.name = req.body.assetName+"."+req.body.assetSuffix;
            asset._collectionId = req.body.collectionID;

            asset.save((err) => {
                req.flash('success', { msg: 'Asset has been updated.' });
                res.redirect(req.headers.referer);
            });
        });

};

exports.upload = (req, res) => {


    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
        }

    });

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
                    res.send(product._id)
                    res.end("Success");
                }
            });

        }

    });

};

exports.downloadImage = (req,res) => {

    Asset.find({_id: req.params.id}).exec(function (err, result) {
        if (!err) {
            if(req.params.width == "original"){
                sharp(result[0].fullpath)
                    .toFile('public/downloads/'+result[0].name, function (err, sucess) {
                        if(!err){
                            sucess.path = 'public/downloads/'+result[0].name;

                            res.set("Content-Disposition", "attachment;filename="+result[0].name);

                            var readStream = fs.createReadStream( sucess.path);
                            readStream.on('data', function(data) {
                                res.write(data);
                            });

                            readStream.on('end', function() {
                                res.end();
                            });
                        }
                    });
            }
            else {
                sharp(result[0].fullpath)
                    .resize(parseInt(req.params.width))
                    .toFile('public/downloads/'+req.params.width+"_"+result[0].name, function (err, sucess) {
                        if(!err){
                            sucess.path = 'public/downloads/'+req.params.width+"_"+result[0].name;

                            res.set("Content-Disposition", "attachment;filename="+req.params.width+"_"+result[0].name);

                            var readStream = fs.createReadStream( sucess.path);
                            readStream.on('data', function(data) {
                                res.write(data);
                            });

                            readStream.on('end', function() {
                                res.end();
                            });
                        }
                    });
            }

        }
    });



};
