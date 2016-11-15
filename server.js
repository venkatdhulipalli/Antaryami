var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var MONGODB_URI="mongodb://heroku_59ngrfp5:3oiigtsjtobtc48d732if51fih@ds047166.mlab.com:47166/heroku_59ngrfp5";
var POSTS_COLLECTION = "posts";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;



// Connect to the database before starting the application server.
mongodb.MongoClient.connect(MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/posts", function(req, res) {
	console.log("IN PSOTS");
  db.collection(POSTS_COLLECTION).find({}).toArray(function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get posts");
    } else {
      res.status(200).json(doc);
    }
  });
});

/*
Specific Routing for Specific Parameters
URL -> localhost:8080/posts/meditation
*/
app.get("/posts/:category", function(req, res) {
	console.log("ID:",req.params.category);
  db.collection(POSTS_COLLECTION).find({ "category.name": req.params.category }).toArray(function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get posts");
    } else {
      res.status(200).json(doc);
    }
  });
});

module.exports= app;