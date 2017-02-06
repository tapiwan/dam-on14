const Asset = require('../models/Asset');
const Collection = require('../models/Collection');
const Settings = require('../models/Settings');
const Activity = require('../models/Activity');

const async = require('async');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const http = require('http');
const fs = require('fs');
const icc = require('icc');
const filepreview = require('filepreview');






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

    async.waterfall([
        function(callback) {
            //Find asset
            Asset.findOne({_id:req.body.assetID}).exec(function(err, asset) {
               if(!err) {
                   //Pass asset to next function
                   callback(null, asset);
               }
            });
        },
        function(asset, callback) {
            //Remove asset
            Asset.remove({ _id: asset._id }, (err) => {
                if (err) { return next(err); }
                req.flash('info', { msg: 'Asset has been deleted.' });

                //Pass asset to next function
                callback(null, asset);
            });
        },
        function(asset, callback) {
            //Remove asset from file system
            fs.unlink(asset.fullpath);

            //Pass asset to next function
            callback(null, asset);
        },
        function(asset, callback) {
            //Create Activity
            new Activity({
                user: req.user.profile.name,
                action: 'deleted '+asset.name
            }).save();

            //Pass asset to next function
            callback(null, asset);
        }
    ], function (err, result) {
        //Redirect
        res.redirect('/collections');
    });
};

exports.editAsset = (req, res) => {

        Asset.findOne({ _id: req.body.assetID }, (err, asset) => {
            if(err){
                console.log(err);
            }
            console.log("here")
            asset.name = req.body.assetName+"."+req.body.assetSuffix;
            asset._collectionId = req.body.collectionID;

            asset.save((err) => {
                req.flash('success', { msg: 'Asset has been updated.' });

                //Activity
                new Activity({
                    user: req.user.profile.name,
                    action: 'edited '+asset.name
                }).save();

                res.redirect(req.headers.referer);
            });
        });

};

exports.addComment = (req, res) => {

    Asset.findOne({ _id: req.body.assetID }, (err, asset) => {
        if(err){
            console.log(err);
        }

        asset.comments.push({name: req.user.profile.name, comment: req.body.comment, });
        asset.save(function () {
            req.flash('success', { msg: 'Comment has been added.' });

            //Activity
            new Activity({
                user: req.user.profile.name,
                action: 'commented '+asset.name
            }).save();

            res.redirect(req.headers.referer+"#chatbox");
        });


    });

};
exports.removeComment = (req, res) => {

    Asset.update( {_id: req.body.assetID}, {$pull: {"comments": {"_id": req.body.commentID }} } , function () {
        res.redirect(req.headers.referer+"#chatbox");

    })

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
                    res.send(product._id);

                    //Activity
                    new Activity({
                        user: req.user.profile.name,
                        action: 'uploaded '+product.name
                    }).save();

                    res.end("Success");
                }
            });

        }

    });

};

exports.requestDownloadImage = (req,res) => {

    Asset.find({_id: req.params.id}).exec(function (err, result) {
        if (!err) {
            if(req.params.width == "original"){
                sharp(result[0].fullpath)
                    .withMetadata()
                    .toFile('public/downloads/'+result[0].name, function (err, sucess) {
                        if(!err){
                            sucess.filename = result[0].name;
                            res.json(sucess)


                        }
                    });
            }
            else {
                const image = sharp(result[0].fullpath);


                image
                    .metadata()
                    .then(function(metadata) {
                        return image
                            .resize(parseInt(req.params.width))
                            .withMetadata()
                            .toFile('public/downloads/'+req.params.width+"_"+result[0].name, function (err, sucess) {
                                if(!err){
                                    sucess.filename = req.params.width+"_"+result[0].name;

                                    if(metadata.icc){
                                        sucess.icc = icc.parse(metadata.icc);

                                    }

                                    res.json(sucess)

                                }
                            });

                    })

            }

        }
    });
};

exports.downloadFile = (req,res) => {

    var filename = req.params.file;

    var path = 'public/downloads/'+filename;
    var altPath = 'public/uploads/'+filename;

    if(req.query.name){
        res.set("Content-Disposition", "attachment;filename="+req.query.name);
    }
    else {
        res.set("Content-Disposition", "attachment;filename="+filename);
    }


    var readStream = fs.createReadStream(path);

    readStream.on('data', function(data) {
        res.write(data);
    });

    readStream.on('error', function(err) {
        var newStream = fs.createReadStream(altPath);
        newStream.on('data', function(data) {
            res.write(data);
        });
        newStream.on('end', function() {
            res.end();
        });

    });

    readStream.on('end', function() {
        res.end();
    });

};
