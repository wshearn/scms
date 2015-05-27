SCMS                = {};
SCMS.config         = require("./config");
SCMS.us             = require('./helpers/underscore');
SCMS.menu           = require("./helpers/menu").menu;

/**
 * Module dependencies.
 */
var express          = require('express')
    , bodyParser     = require('body-parser')
    , methodOverride = require('method-override')
    , cookieParser   = require('cookie-parser')
    , expressSession = require('express-session')
    , morgan         = require('morgan')
    , errorHandler   = require('errorhandler')
    , http           = require('http')
    , path           = require('path')
;

var app = express();
var server = http.createServer(app);

// all environments
app.set('ip', SCMS.config.web.host);
app.set('port', SCMS.config.web.port);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('view options', { pretty: true });
app.use(expressSession({
  secret: "W#!1ao1iCAH0$H3oj!m4WiFuCe&Jlc8yo@#V&LwlF$ab%Ov79Lc!H&Io8&AMm78W",
  //name: cookie_name,
  //store: sessionStore, // connect-mongo session store
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
//app.use(app.router);



 // development only
if (SCMS.config.site.env == 'development') {
  app.use(morgan('dev'));
  app.use(errorHandler());
} else if (SCMS.config.site.env == 'production') {
  app.use(morgan());
}

// Always load the index module.
var modules;
if (SCMS.config.modules.indexOf("index") == -1){
  modules = SCMS.us.union(["index"], SCMS.config.modules);
} else {
  modules = SCMS.config.modules;
}

SCMS.modules = modules;

// Load modules
for (var i = 0; i < modules.length; i++) {
  modules[i] = require("./modules/" + modules[i]);
  app.use(modules[i]);
}

server.listen(app.get('port'), app.get('ip'));
server.on('listening', function() {
    console.log('Shitty CMS<%s mode> started on port %s at %s',
      SCMS.config.site.env, server.address().port, server.address().address);
});
