var express = require('express');
var router = express.Router();

function array2namelist(arr) {
  var res = {};
  for(var i = 0; i< arr.length; i++)
    res[i] = arr[i].name;
  return res;
}

router.get('/', function(req, res, next) {
  console.log("Query: " + req.query.product);
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://" + process.env.MONGODB_SERVICE_HOST + ":" + process.env.MONGODB_SERVICE_PORT + "/autocomplete";
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database connected.");
    var query = {}; //"{name: /" + req.query.product + "/ }";
    query["name"] = {$regex : ".*" + req.query.product + ".*"};
    console.log("query = " + query["name"]);
    db.collection('products').find(query, { _id: 0, sku: 1, name: 1 }).limit(30).toArray(function (err, docs) {
      if (err) throw err;
      console.log("Found in db: ");
      //console.log(array2namelist(docs));
      //res.send(array2namelist(docs));
      console.log(docs);
      res.jsonp(docs);
      console.log("Database closed.");
      db.close();
    });
  });
});

module.exports = router;
