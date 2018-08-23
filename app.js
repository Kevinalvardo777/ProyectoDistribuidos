var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);


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
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  { timestamps: false }
);

GifsModel.sync()

// Funcion cambio de gifs



// Funcion que obtiene los gifs de la DB
function ObtenerGifs(limit, fn){
  GifsModel.findAll({
      limit: limit ,
      order: [['num_accesses', 'DESC']]
//,
//      attributes: Object.keys(GifsModel.attributes).concat([
//	   [sequelize.literal('select num_accesses from my_gifs by rand()')]
//	])
             
               // order : 'num_accesses DESC';
		 // order : [[sequelize.literal('num_accesses'), 'DESC']]
  }).then( gifs => {
      var data = gifs.map((gif) => {
        return gif.get({ plain: false })
      });
    fn(data);
  });
}

// Gargar pagina principal sin usar cache
app.get('/', function(req, res, next) {
  ObtenerGifs(10, (data) => {
    var start = new Date();
    return res.render('index', {title: 'Top 10 Gifs Animados', gifs: data});
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

module.exports = app;

