var config = {
    web: {}
  , db: {}
  , site: {}
};

config.modules = [
    "index"
  , "admin"
  , "about"
  , "blog"
  , "contact"
];

// IP:Port to listen on
config.web.host   = "localhost";
config.web.port   = 3000;

// Database config options
config.db.type    = "mongo"; // this does nothing yet :)
config.db.user    = "mysite";
config.db.pass    = "password";
config.db.host    = "localhost";
config.db.port    = "27017";
config.db.dbname  = "scms";

config.site.env   = "development";
config.site.theme = "default";

// OpenShift settings.
if (typeof(process.env.OPENSHIFT_INTERNAL_IP) === 'string')
{
  config.web.ip   = process.env.OPENSHIFT_INTERNAL_IP;
  config.web.port = process.env.OPENSHIFT_INTERNAL_PORT;
}

if (config.db.type == "mongo" && typeof(process.env.OPENSHIFT_MONGODB_PORT)  === 'string')
{
  config.db.user    = process.env.OPENSHIFT_MONGO_DB_USERNAME;
  config.db.pass    = process.env.OPENSHIFT_MONGO_DB_PASSWORD;
  config.db.host    = process.env.OPENSHIFT_MONGO_DB_HOST;
  config.db.port    = process.env.OPENSHIFT_MONGO_DB_PORT;
  config.db.dbname  = process.env.OPENSHIFT_GEAR_NAME;
}

config.views  = __dirname + '/themes/' + config.site.theme + "/views";
config.public = __dirname + '/themes/' + config.site.theme + "/public";

module.exports = config;
