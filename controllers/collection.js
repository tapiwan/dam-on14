const Collection = require('../models/Collection');
/**
 * GET /collections
 * Collection page.
 */
exports.getCollections = (req, res) => {

  Collection.find().sort('_id').exec(function (err, collections) {
      if (!err) {
          console.log(collections)
      }

  });
  res.render('collections/index', {
    title: 'Collections'
  });
};

