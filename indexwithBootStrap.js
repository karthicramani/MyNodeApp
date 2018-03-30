var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var mongodb = require('mongodb');
var fs = require('fs');
var bodyParser = require('body-parser');  

var MongoClient = require('mongodb').MongoClient;
var db;
var dbresstr;
var filerestxt="";
var stat="";
var dbresarr= [];

/*** Setting the View Engine and Views - PUG Templating ***/
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views','./views');

/*** For Scraping the Body Contents from the DOM ***/
app.use(bodyParser());

/*** DB Connection ***/
MongoClient.connect("mongodb://localhost:27017/mydb", function(err, database) {
  if(err) return console.error(err);
  db = database;
});

/*** Inserting into Database ***/ 
app.post("/", function(req, res, next) {   
	var myobj = { name: req.body.mname};
  db.collection("movie").insertOne(myobj, function(err, res) {
    //console.log("1 document inserted");	
	stat="1 document inserted";	
  });  
  res.render('bootstrap',{dbres:dbresarr,fileres:filerestxt,statustxt:'1 doc inserted'});
});

/*** Default Landing Page ***/
app.get("/", function(req, res, next) {   
//console.log("Get :: "+dbresarr);
  /*** Reading from a Database ***/	
db.collection("movie").find({}, function(err, docs) {
    if(err) return next(err);
    docs.each(function(err, doc) {	
      if(doc) {	 
			dbresarr.push(doc.name);
		//console.log("Success Reading DB : " + doc.name);		 		
		}      
      else {
        //console.log(err);
      }
    });
});

/*** Reading from a Local File ***/
 fs.readFile("localtext.txt", function (err, data) {  
      if (err) {  
         //console.log(err);           
      }else{
		 filerestxt = data.toString();
         //console.log("Success Reading File : " + filerestxt);		 
      }     
});

/*** Setting the values in a Pug View ***/
    res.setHeader('Content-Type', 'text/html');	 
	res.render('bootstrap',{dbres:dbresarr,fileres:filerestxt});
});
var server = http.createServer(app).listen(app.get('port'), function(){
  //console.log('Express server listening on port ' + app.get('port'));
});