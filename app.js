var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var responseTime = require('response-time');

var app = express();
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(responseTime());


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexion MySQL
const sequelize = new Sequelize({
  database: 'proyect_distribuidos_db',
  username: 'distribuidos_db',
  password: 'creoenDios7777',
  dialect: 'mysql',
  logging: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL conectado con DB');
  })
  .catch( err => {
    throw new Error('MySQL No se pudo conectar con la DB: ', err);
  });

// Model
var GifsModel = sequelize.define( 'my_gifs',
  {
    id: {
      type: Sequelize.INTEGER(7).UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    url: Sequelize.STRING,
    description: Sequelize.STRING,
    num_accesses: {
      type: Sequelize.INTEGER(11),
      defaultValue: 0
    }
  },
  { timestamps: false }
);

GifsModel.sync();


//redis
var redis= require('redis');
const REDIS_PORT= process.env.REDIS_PORT;
var client= redis.createClient(REDIS_PORT);

client.on("error", function(err){
  console.log("Error" + err);
});

// Funcion que obtiene los gifs de la DB
function ObtenerGifs(limit, fn){
  GifsModel.findAll({
      limit: limit ,
      order: [['num_accesses', 'DESC']]
  }).then( gifs => {
      var data = gifs.map((gif) => {
        return gif.get({ plain: false })
      });
    fn(data);
  });
}



// Verifica si una busqueda esta en la cache
const VerificarCache = (req, res, next) => {
  const start = new Date();
  const fecha = new Date().toISOString().replace(/T.+/, '');
  client.get(fecha, function (error, result) {
    if(result) {
      var data = JSON.parse(result);
      console.log('verificado que SÍ ESTÁ EN CACHÉ');
      return res.render('index', {
        title: 'Top 10 Gifs Animados',
	from: 'Redis cache',
	responseTime: new Date() - start,
        gifs: data
      });
    }
    else {
      next();
     console.log('No está en caché... Procede a guardarla en caché');
    }
  });
}


// Guarda en cache par clave valor
function GuardarEnCache(clave, valor, tiempo) {
  var duracion = ((tiempo)&&(tiempo>0)) ? tiempo: 60;
  client.setex(clave, duracion, valor);
}


// Gargar pagina principal sin usar cache
app.get('/', function(req, res, next) {
  ObtenerGifs(10, (data) => {
    var start= new Date();
    console.log('Renderizando página sin cachear');
    return res.render('index', {title: 'Top 10 Gifs Animados', gifs: data});
  });
});


// Cargar pagina usando cache
app.get('/microservicio', function(err, res){
 var start= new Date();
  var client = thrift.createClient(Gifs, connection);
  client.obtenerTopGifs(function(err, response){
    console.log('Renderizando página cacheada');
    return res.render('microservicio', {
      title: 'Top 10 Gifs Animados',
      gifs: response
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err); // continua a Error handler
});


// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') == 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Microservicio
var thrift = require('thrift');
const assert = require('assert');
var Gifs = require('./microservicio/gen-nodejs/ObtenerGifs')

var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection("localhost", 9090, {
  transport: transport,
  protocol: protocol
});

connection.on('error', function(err) {
  assert(false, err);
});

function ObtenerGifsMicroservicio(){
  var client = thrift.createClient(Gifs, connection);
  client.obtenerTopGifs(function(err, response) {
    return response;
  });
}

module.exports = app;

