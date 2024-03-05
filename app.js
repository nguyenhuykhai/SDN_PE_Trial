var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

var courseRouter = require('./routes/course');
var authRouter = require('./routes/auth');
var sectionRouter = require('./routes/section');

const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');


dotenv.config();
var app = express();
require('./config/passport')(passport);
app.use(
  session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cookieParser());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/course', courseRouter);
app.use('/section', sectionRouter);
app.use('/auth', authRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONG_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    console.log("Express server listening on port 5000");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('login');
});

module.exports = app;