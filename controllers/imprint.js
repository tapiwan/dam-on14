/**
 * GET /
 * Dashboard
 */
exports.showDashboard = (req, res) => {
  res.render('imprint', {
    title: 'Imprint'
  });
};
