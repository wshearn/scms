var express = require('express');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

var app = module.exports = express();

app.metadata = {};
app.metadata.name    = "admin";
app.metadata.title   = "Admin";
app.metadata.url     = "/admin.html";

app.set('views', SCMS.config.views);
app.use(express.static(SCMS.config.public));
app.use(require('stylus').middleware(SCMS.config.public));
app.use(require('less-middleware')(SCMS.config.public));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

var users = [
  { id: 1, username: 'admin', password: 'admin', email: 'admin@example.com', name: "Admin" }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function () {
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

function RenderAdminSystemSitePage (req, res) {
  SCMS.menu.handleMenu(app.metadata.name);
  res.render('admin/system/site',
  {
      title: 'Admin Portal - System',
      subHeader: 'General site settings',
      index: SCMS.menu.items,
      modules: SCMS.modules,
      user: req.user,
      loggedIn: req.isAuthenticated(),
  });
}

function RenderAdminSystemUsersPage (req, res) {
  SCMS.menu.handleMenu(app.metadata.name);
  res.render('admin/system/users',
  {
      title: 'Admin Portal - System',
      subHeader: 'User settings',
      index: SCMS.menu.items,
      modules: SCMS.modules,
      user: req.user,
      loggedIn: req.isAuthenticated(),
  });
}

function RenderAdminPage (req, res) {
  SCMS.menu.handleMenu(app.metadata.name);
  res.render('admin/admin',
  {
      title: 'Admin Portal',
      subHeader: 'Welcome ' + req.user.name,
      index: SCMS.menu.items,
      modules: SCMS.modules,
      user: req.user,
      loggedIn: req.isAuthenticated(),
  });
}

function RenderAdminLoginPage (req, res) {
  if (req.isAuthenticated())
  {
    res.redirect('/admin.html');
  } else {
    SCMS.menu.handleMenu(app.metadata.name);
    res.render('admin/login',
    {
        title: 'Admin Portal',
        subHeader: 'Welcome Person',
        index: SCMS.menu.items,
        loggedIn: req.isAuthenticated(),
    });
  }
}

function AdminLogoutPage (req, res) {
  req.logout();
  res.redirect('/');
}

app.get('/admin.html', ensureAuthenticated, RenderAdminPage);
app.get('/admin/system/site.html', ensureAuthenticated, RenderAdminSystemSitePage);
app.get('/admin/system/users.html', ensureAuthenticated, RenderAdminSystemUsersPage);
app.get('/admin/login.html', RenderAdminLoginPage);
app.get('/admin/logout.html', AdminLogoutPage);
app.post('/admin/login.html', passport.authenticate(
  'local',
  {
    failureRedirect: '/admin/login.html',
    failureFlash: true
  }),
  function(req, res) {
    res.redirect('/admin.html')
  }
);

function authenticate (req, res, next) {
  passport.authenticate('local', { failureRedirect: '/admin/login.html', failureFlash: true })
  return next();
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/admin/login.html')
}
