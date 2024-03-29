/* istanbul ignore file */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/v1/user');
var productRouter = require('./routes/v1/product');
var uploadRouter = require('./routes/v1/upload');
var cartRouter = require('./routes/v1/cart');
var orderRouter = require('./routes/v1/order')

var app = express();

var mongoose = require('mongoose');

const env = process.env.NODE_ENV || "development";

if (env == "development" || env == 'test') {
  require('dotenv').config()
}

const configDB = {
  development: process.env.DB_DEV,
  test: process.env.DB_TEST || $DB_TEST,
  production: process.env.DB_PROD
}

const dbConnection = configDB[env];

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)
mongoose.connect(dbConnection)
  .then(() => {
    console.log('Database successfully connect!')
  })
mongoose.Promise = Promise;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/product', productRouter);
app.use('/upload', uploadRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
