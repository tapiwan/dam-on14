const Collection = require('../models/Collection');
/**
 * GET /collections
 * Collection page.
 */

var collections = "";

exports.getCollections = (req, res) => {

  Collection.find().sort('_id').exec(function (err, results) {
      if (!err) {
          collections = results
      }

  });

  res.render('collections/index', {
      title: 'Collections',
      collections : collections
  });
}

