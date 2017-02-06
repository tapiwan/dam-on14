const Collection = require('../models/Collection');
const Asset = require('../models/Asset');

/**
 * GET /searchCollections/:query
 * Search Collections
 */
exports.searchCollections = (req, res) => {
    var query = req.params.query;

    //Find collections
    Collection.find({name: {$regex: query, $options: 'i'}}).exec(function (err, results) {
        if (!err) {
            res.json(results);
        }
    });
};

/**
 * GET /searchAssets/:query
 * Search Assets
 */
exports.searchAssets = (req, res) => {
    var query = req.params.query;

    //Find collections
    Asset.find({$or:[{name: {$regex: query, $options: 'i'}}, {tags: {$regex: query, $options: 'i'}}]}).exec(function (err, results) {
        if (!err) {
            res.json(results);
        }
    });
};



