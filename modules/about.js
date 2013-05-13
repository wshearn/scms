var express = require('express');
var app = module.exports = express();

app.metadata = {};
app.metadata.name    = "about";
app.metadata.title   = "About";
app.metadata.url     = "/about.html";
app.metadata.showInTopMenu = true;
SCMS.menu.items[SCMS.menu.items.length] = {
  name: app.metadata.name,
  url: app.metadata.url,
  title: app.metadata.title,
  active: false,
}

app.set('views', SCMS.config.views);
app.use(express.static(SCMS.config.public));
app.use(require('stylus').middleware(SCMS.config.public));
app.use(require('less-middleware')(SCMS.config.public));

var AboutMe = require('../connectors/aboutme.js').AboutMe
var aboutMe = new AboutMe();

function renderAboutPage(req, res){
  aboutMe.findAll(function(error, workHistory)
  {
    SCMS.menu.handleMenu(app.metadata.name);
    res.render('about/about',
      {
        title: 'About',
        subHeader: 'A little about me and this site.',
        jobs: workHistory,
        index: SCMS.menu.items,
        loggedIn: req.isAuthenticated(),
      }
    );
  });
};

app.get('/about', renderAboutPage);
app.get('/about.html', renderAboutPage);
