/**
 * GET /collections
 * Collection page.
 */
exports.getCollections = (req, res) => {
  res.render('collections/index', {
    title: 'Collections'
  });
};
