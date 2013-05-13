var express = require('express');
var app = module.exports = express();

app.metadata = {};
app.metadata.name    = "index";
app.metadata.title   = "Home";
app.metadata.url     = "/index.html";
SCMS.menu.items[SCMS.menu.items.length] = {
  name: app.metadata.name,
  url: app.metadata.url,
  title: app.metadata.title,
  active: false
}

app.set('views', SCMS.config.views);
app.set('view engine', 'jade');
app.use(express.static(SCMS.config.public));
app.use(require('stylus').middleware(SCMS.config.public));
app.use(require('less-middleware')(SCMS.config.public));

function renderIndex (req, res){
  SCMS.menu.handleMenu(app.metadata.name);
  res.render('index',
    {
      title: 'Wesley Hearn\'s Site and Blog',
      subHeader: 'Where I throw shit at a wall and see what sticks...',
      index: SCMS.menu.items,
      loggedIn: req.isAuthenticated(),
    }
  );
};

app.get('/', renderIndex);
app.get('/index.html', renderIndex);
