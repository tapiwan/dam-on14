const Settings = require('../models/Settings');

/**
 * GET /collections
 * Collection page.
 */


exports.getSettings = (req, res) => {

  Settings.find().sort({'_id': -1}).exec(function (err, results) {

      if (!err) {

          res.render('settings/index', {
              title: 'Settings',
              settings : results
          });
         
      }

  });

}

