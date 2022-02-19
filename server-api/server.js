require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var userRouter = require('./routes/user');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


