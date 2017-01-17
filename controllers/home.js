/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.redirect('/login');

};

exports.imprint = (req, res) => {
    res.render('imprint', {
        title: 'Imprint'
    });
};
