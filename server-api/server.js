const express = require('express');
const app = express();

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



var indexRouter = require('./routes/index');
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})