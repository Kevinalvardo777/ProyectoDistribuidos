// var express = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'distribuidos_db',
	password: 'creoenDios7777',
	database: 'proyect_distribuidos_db'
});

// var app = express();

connection.connect(function(err){
 	if(!err){
	       connection.query("SELECT * FROM( SELECT num_accesses FROM my_gifs ORDER BY rand() LIMIT 10) T1 ORDER BY num_accesses DESC; ", function (err, result, fields) {	 
	      
               console.log("Database is connected ... \n\n");
	  })}; 
//else {
 	//	console.log("Error connecting database ... \n\n");
	//};
});
connection.end();
// app.listen(3000, function () {
//    console.log('Sistema armado en el puerto 3000!');
//    });
