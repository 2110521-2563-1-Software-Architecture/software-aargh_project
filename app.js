var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var groupRouter = require('./routes/group');
var chatRouter = require('./routes/chat');
var friendRouter = require('./routes/friend');
var messageRouter = require('./routes/message');

const mongoConnectionString = "mongodb://admin:1234@cluster0-shard-00-00-6qnn1.mongodb.net:27017/fine?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect(mongoConnectionString, {useNewUrlParser: true, useUnifiedTopology: true});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/group', groupRouter);
app.use('/chat', chatRouter);
app.use('/message', messageRouter);
app.use('/friend', friendRouter);

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
