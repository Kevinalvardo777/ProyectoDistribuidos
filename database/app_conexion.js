var mysql = require('mysql');


var connection = mysql.createConnection({
	host: 'localhost',
	user: 'distribuidos_db',
	password: 'creoenDios7777',
	database: 'proyect_distribuidos_db'
});

connection.connect(function(err){
 	if(!err){
               console.log("\n    Connecting Database....................\n");
        }
        else {
               console.log("\n    Error connecting database :( \n")
       }
});

// Query para actualizar numero de accesos
const updateQueryKevin = "SELECT num_accesses FROM( SELECT num_accesses FROM my_gifs ORDER BY rand() LIMIT 10) my_gifs ORDER BY num_accesses DESC;";const updateQuery = "UPDATE my_gifs set num_accesses=(select floor(rand(1)*(2UPDATE my_gifs set num_accesses=(select floor(rand(1)*(200$0000)));";
const updateQuery = "UPDATE my_gifs set num_accesses=(select floor(rand(1)*(20000)));";


// Actualiza el campo Numero de accesos de todos los registos en un rango 100 a 1000
connection.query(updateQueryKevin, function (err, result, fields) {
        if (err) throw err;  // console.log("Error al ingresar el  query"); // throw err;
        else console.log("    Numero de acceso actualizado para todos los gifs\n");
});
connection.end();
