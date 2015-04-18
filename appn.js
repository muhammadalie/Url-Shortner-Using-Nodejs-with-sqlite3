var express = require('express');
var async = require('async');
var http = require("http");
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('url'); 
var url = require('url');
var app = express();
var arra=[];
app.use(bodyParser());

app.get('/:format', function (req, res) {
   var format = req.params.format;
//       type = req.params.type;
   console.log(typeof(format));

 db.serialize(function() {
  db.each("SELECT URL, STURL FROM URL", function(err, row) {
	if('http://localhost:3000/'+format==String(row.STURL)){
          console.log(row.URL);
	res.writeHead(301,
{Location:String(row.URL)}
);
res.end();


      }
  });
  
});



});

app.get('/',function(req,res){

  var html = '<form action="/" method="post">' +
               'Enter your url:' +
               '<input type="text" name="url" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
               
  res.send(html);
});

console.log("Server has started.");
 
app.post('/', function(req, res){
  var url =req.body.url;
  var sturl;
  var nn=1,html;
  var mm;
  var sign="+-/="
  var code="1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l0z1x2c3v4b5n6m";
  var d=String(Date.now());
  var st=d[Math.ceil(Math.random()*(d.length-1))];
  for(var i=0;i<url.length;i++){
	if(sign.search(url[i])!=-1){		
	st+=code[Math.ceil(Math.random()*(code.length-1))];
	console.log(st);
	}
  }
  db.serialize(function() {


  db.all("SELECT URL, STURL FROM URL", function(err, rows){    
       rows.forEach(function (row) {
       if(row.URL==url){
        mm=String(row.STURL);
         var html = 'short: ' + mm + '.<br>' +
       '<a href="/">Try again.</a>';
 	  res.send(html);

          
        }
    })

});   
  var stmt = db.prepare("INSERT INTO URL(URL,STURL) VALUES(?,?)");     
      
     
      sturl = 'http://localhost:3000/'+st;   
      stmt.run(url,sturl)
    stmt.finalize(); 
   
   });	

   var html = 'short: ' + sturl + '.<br>' +
       '<a href="/">Try again.</a>';
   res.send(html);
});
app.listen(3000);

