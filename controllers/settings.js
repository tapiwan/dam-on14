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

};

exports.getSettingsJson = (req, res) => {

    Settings.find().sort({'_id': -1}).exec(function (err, results) {

        if (!err) {
            res.json(results);

        }

    });

};

exports.editDimension = (req, res) => {

    Settings.findOne({ _id: req.body.settingsID }, (err, setting) => {
        if(err){
            console.log(err);
        }



        setting.dimensions.push({
            name: req.body.name,
            width: req.body.width,
        });


        setting.save((err) => {
            req.flash('success', { msg: 'New Dimension' });
            res.redirect('/settings');
        });
    })


};

