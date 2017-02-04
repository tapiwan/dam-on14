const Collection = require('../models/Collection');
const Activity = require('../models/Activity');

/**
 * GET /dashboard
 * Dashboard
 */
exports.showDashboard = (req, res) => {

  Collection.find().sort({'_id': -1}).exec(function (err, results) {

    if (!err) {

      res.render('dashboard', {
        title: 'Dashboard',
        collections : results
      });

    }

  });
};

/**
 * GET /dashboard/getActivites/:amount
 * Return the amount of specified activities
 */
exports.getActivities = (req, res) => {
  Activity.find().sort({'_id':-1}).limit(3).exec(function(err, results) {
    if(!err) {
      res.json(results);
    }
  });
}

/**
 * GET /dashboard/getCollections/:amount
 * Return the amount of specified collections
 */

exports.getCollections = (req, res) => {
  Collection.find().sort({'_id':-1}).limit(3).exec(function(err, results) {
    if(!err) {
      res.json(results);
    }
  });
}


