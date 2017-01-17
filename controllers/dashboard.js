/**
 * GET /
 * Dashboard
 */
exports.showDashboard = (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard'
  });
};
