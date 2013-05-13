var express = require('express');
var app = module.exports = express();

app.metadata = {};
app.metadata.name    = "contact";
app.metadata.title   = "Contact";
app.metadata.url     = "/contact.html";
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

var message = {
  name: 'Your Name',
  email: 'your@email.address',
  message: 'Your Message'
};


function renderContactSubmitPage(req, res){
  var name;
  if ( req._body && req.body["message"]["name"] )
  {
    name = req.body["message"]["name"];
  } else {
    name = "LIAR";
  }
  // TODO something with this...
  console.log(req.body["message"]);
  SCMS.menu.handleMenu(app.metadata.name);
  res.render('contact/contact-submit',
    {
      title: 'Contact Me',
      subHeader: 'Submit me your ideas',
      name: name,
      index: SCMS.menu.items,
      loggedIn: req.isAuthenticated(),
    }
  );
};

function renderContactPage(req, res){
  SCMS.menu.handleMenu(app.metadata.name);
  res.render('contact/contact',
  {
    title: 'Contact Me',
    subHeader: 'Submit me your ideas',
    message: message,
    index: SCMS.menu.items,
    loggedIn: req.isAuthenticated(),
  });
};

app.get('/contact.html', renderContactPage);
app.post('/contact/submit.html', renderContactSubmitPage);
