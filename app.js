/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');

const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');
const collectionController = require('./controllers/collection');
const assetController = require('./controllers/asset');
const dashboardController = require('./controllers/dashboard');
const searchController = require('./controllers/search');
const settingsController = require('./controllers/settings');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
console.log(process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

app.locals.moment = require('moment');

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/imprint', homeController.imprint);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

// COLLECTIONS
app.get('/collections', passportConfig.isAuthenticated, collectionController.getCollections);
app.get('/get/collections', passportConfig.isAuthenticated, collectionController.getCollectionsJson);

app.get('/collections/getName/:id', passportConfig.isAuthenticated, collectionController.getCollectionName);
app.post('/collections/add', passportConfig.isAuthenticated, collectionController.addCollection);
app.post('/collections/delete', passportConfig.isAuthenticated, collectionController.deleteCollection);
app.post('/collections/edit', passportConfig.isAuthenticated, collectionController.editCollection);

// DASHBOARD
app.get('/dashboard', passportConfig.isAuthenticated, dashboardController.showDashboard);
app.get('/getActivities', passportConfig.isAuthenticated, dashboardController.getActivities);
app.get('/getCollections', passportConfig.isAuthenticated, dashboardController.getCollections);

/**
 * Assets
 */
app.get('/assets/:id', passportConfig.isAuthenticated, assetController.getAssets);
app.get('/details/asset/:id', passportConfig.isAuthenticated, assetController.getAsset);
app.get('/asset/prepare/image/:id/:width', passportConfig.isAuthenticated, assetController.requestDownloadImage);
app.get('/asset/download/:file', passportConfig.isAuthenticated, assetController.downloadFile);

app.post('/upload/assets', passportConfig.isAuthenticated, assetController.upload);
app.post('/asset/edit', passportConfig.isAuthenticated, assetController.editAsset);
app.post('/asset/delete', passportConfig.isAuthenticated, assetController.deleteAsset);
app.post('/asset/add/comment', passportConfig.isAuthenticated, assetController.addComment);
app.post('/asset/remove/comment', passportConfig.isAuthenticated, assetController.removeComment);
app.post('/asset/set/rating', passportConfig.isAuthenticated, assetController.setRating);



/**
 * Settings
 */
app.get('/settings', passportConfig.isAuthenticated, settingsController.getSettings);
app.get('/json/settings', passportConfig.isAuthenticated, settingsController.getSettingsJson);
app.post('/settings/add', passportConfig.isAuthenticated, settingsController.editDimension);


/**
 * Search
 */
app.get('/search', passportConfig.isAuthenticated, searchController.showSearch);
app.get('/searchCollections/:query', passportConfig.isAuthenticated, searchController.searchCollections);
app.get('/searchAssets/:query', passportConfig.isAuthenticated, searchController.searchAssets);

/**
 * API examples routes.
 */
app.get('/api/upload', apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
