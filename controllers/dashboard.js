const Collection = require('../models/Collection');

/**
 * GET /
 * Dashboard
 */
exports.showDashboard = (req, res) => {

  Collection.find().sort({'_id': -1}).limit(3).exec(function (err, results) {

    if (!err) {

      res.render('dashboard', {
        title: 'Dashboard',
        collections : results
      });

    }

  });
};

