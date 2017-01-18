const Collection = require('../models/Collection');
/**
 * GET /collections
 * Collection page.
 */


exports.getCollections = (req, res) => {


  Collection.find().sort('_id').exec(function (err, results) {

      if (!err) {

          res.render('collections/index', {
              title: 'Collections',
              collections : results
          });
         
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
                res.redirect('/collections');


            }

        });
    });

}
