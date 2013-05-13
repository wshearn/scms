var express = require('express');
var app = module.exports = express();

app.metadata = {};
app.metadata.name    = "blog";
app.metadata.title   = "Blog";
app.metadata.url     = "/blog.html";
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

var md = require("node-markdown").Markdown;

var Mongo = require( '../connectors/mongo').Mongo;
var mongo = new Mongo("modules.blog.posts", true);

function renderPost (post, req, res) {
  var newPost;
  if (post == null)
  {
    newPost = {
      _id: "0",
      title: "404",
      summary: "We have hit the end of the road...",
      friendlyURL: "404",
      time: "2013-04-29T18:20:00.00-05:00",
      tags: ["404", "nope", "i'm lost", "SCMS"],
      author: "Wesley Hearn",
      content: "Whoops, not here\n=============\ntry somewhere else..."
    };
  } else {
    newPost = post;
  }
  var tags = newPost["tags"].toString().split(",");

  if (newPost["content"] == undefined) {
    res.redirect(500, '/blog.html');
  } else {
    SCMS.menu.handleMenu(app.metadata.name);
    res.render('blog/showpost',
      {
        title: newPost["title"],
        subHeader: newPost["summary"],
        index: SCMS.menu.items,
        tags: tags,
        md: md,
        content: newPost["content"],
        index: SCMS.menu.items,
        loggedIn: req.isAuthenticated(),
      }
    );
  }
}

function getLatestPost (callback) {
  mongo.count(function (count) {
    var keyPair = {_id: count.toString()};
    mongo.findOne(keyPair, function(item){
      callback(item);
    });
  });
}

function getPosts (callback) {
  mongo.findAll(function(item){
    callback(item);
  });
}

function renderPostFriendlyURL(req, res){
  var URL = req.params.URL.split(".html")[0];
  var keyValue = {friendlyURL: URL}
  mongo.findOne(
    keyValue,
    function (item) {
      renderPost(item, req, res);
    }  
  );
};

function renderPostID(req, res){
  var ID = req.params.id.split(".html")[0];
  var keyValue = {_id: ID}
  mongo.findOne(
    keyValue,
    function (item) {
      renderPost(item, req, res);
    }  
  );
};

function renderListByTag(req, res) {
  var tag = req.params.tag.split(".html")[0];

  var foundPosts = [];
  var tags = [];
  getPosts(function(posts){
    posts.forEach(function (i) {
      var matched = false;
      tags = SCMS.us.union(tags, i["tags"]);
      i["tags"].forEach(function (j) {
        if (j == tag)
        {
          matched = true;
        }
      });
      if (matched == true)
      {
        foundPosts[foundPosts.length] = i;
        SCMS.us.union(tags, i["tags"]);
      }
    });
    foundPosts = SCMS.us.uniq(foundPosts);
    tags  = SCMS.us.uniq(tags);
    SCMS.menu.handleMenu(app.metadata.name);
    res.render('blog/find',
    {
      title: 'Blog',
      subHeader: 'Find posts by tag',
      tags: tags,
      posts: foundPosts,
      index: SCMS.menu.items,
      loggedIn: req.isAuthenticated(),
    }
  )
  });
}

function renderNoPosts (req, res) {
  SCMS.menu.handleMenu(app.metadata.name);
  res.render('admin/modules/blog/newPost',
  {
    title: 'Blog',
    subHeader: 'This is where I keep my ideas.',
    index: SCMS.menu.items,
    md: md,
    loggedIn: req.isAuthenticated(),
  });
}

function renderIndex (req, res) {
  var tags = [];
  getLatestPost(function temp1 (latestPost) {
    if (typeof(latestPost == 'undefined'))
    {
      renderNoPosts(req, res);
    } else {
      getPosts(function temp2 (oldPost) {
        var place = 0;
        oldPost.forEach(function temp3 (i) {
          tags = SCMS.us.union(tags, i["tags"]);
          if (i["_id"] === latestPost["_id"]) oldPost.splice(place, 1);
          place++;
        });
        SCMS.menu.handleMenu(app.metadata.name);
        res.render('blog/blog',
        {
          title: 'Blog',
          subHeader: 'This is where I keep my ideas.',
          tags: tags,
          newest: latestPost,
          old: oldPost,
          index: SCMS.menu.items,
          loggedIn: req.isAuthenticated(),
        });
      })
    }
  })
}

app.get('/blog.html', renderIndex);
app.get('/blog/id/:id.html', renderPostID);
app.get('/blog/tag/:tag.html', renderListByTag);
app.get('/blog/:URL.html', renderPostFriendlyURL);
