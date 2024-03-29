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
var apiRouter = require('./routes/api');
var dashboardRouter = require('./routes/dashboard');
const session = require('express-session');


dotenv.config();
var app = express();
app.use(
  session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
  })
);
app.use(cookieParser());

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
app.use('/api', apiRouter);
app.use('/dashboard', dashboardRouter);

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
  res.status(err.status || 500);
  res.render('login');
});

module.exports = app;