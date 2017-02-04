const Collection = require('../models/Collection');
const Activity = require('../models/Activity');

/**
 * GET /collections
 * Collection page.
 */


exports.getCollections = (req, res) => {

  Collection.find().sort({'_id': -1}).exec(function (err, results) {

      if (!err) {

          res.render('collections/index', {
              title: 'Collections',
              collections : results
          });
         
      }

  });

};
exports.getCollectionsJson = (req, res) => {

    Collection.find().sort({'_id': -1}).exec(function (err, results) {

        if (!err) {

            res.json(results);


        }

    });

};

exports.getCollectionName = (req, res) => {
    var collectionId = req.params.id;

    Collection.find({_id: collectionId}).exec(function (err, result) {
        if (!err) {
            res.json(result[0]);
        }
    });
}

exports.addCollection = (req, res) => {

    const collection = new Collection({
        name: req.body.name,
    });

    Collection.findOne({ name: req.body.name }, (err, existingCollection) => {
        if (err) { return next(err); }
        if (existingCollection) {
            req.flash('errors', { msg: 'Collection Name already exists.' });
            return res.redirect('/collections');
        }
        collection.save((err) => {
            if (err) {

            }
            else {
                req.flash('success', { msg: 'Collection added' });

                //Activity
                new Activity({
                    user: req.user.profile.name,
                    action: 'created '+collection.name
                }).save();

                res.redirect('/collections');


            }

        });
    });

}

exports.deleteCollection = (req,res) => {

    Collection.remove({ _id: req.body.collectionID }, (err) => {
        if (err) { return next(err); }
        req.flash('info', { msg: 'The collection has been deleted.' });

        //Activity
        //TODO: use Collection Name, not ID
        new Activity({
            user: req.user.profile.name,
            action: 'deleted '+req.body.collectionID
        }).save();

        res.redirect('/collections');
    });
}

exports.editCollection = (req, res) => {
    Collection.findOne({ name: req.body.collectionName }, (err, existingCollection) => {
        if (err) { return next(err); }
        if (existingCollection) {
            req.flash('errors', { msg: 'Collection name already exists.' });
            return res.redirect('/collections');
        }
        Collection.findOne({ _id: req.body.collectionIDName }, (err, collection) => {
            if(err){
                console.log(err);
            }
            collection.name = req.body.collectionName;

            collection.save((err) => {
                req.flash('success', { msg: 'Collection title has been updated.' });

                //Activity
                new Activity({
                    user: req.user.profile.name,
                    action: 'edited '+collection.name
                }).save();

                res.redirect('/collections');
            });
        })

    });
}

