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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var userRouter = require('./routes/user');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

app.use('/api/login', userRouter);
app.use('/api', indexRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 3000;

// (async () => {
//     const redisClient = redis.createClient({url: 'redis://:laboratorypassword@127.0.0.1:6380'});
//     await redisClient.connect();
//     //await redisClient.AUTH('doctorpassword');
//     // redisClient.on('error', (err) => {
//     //     console.log('error');
//     // });
    
//     const res = await redisClient.get('framework');
//     console.log(res);
// })();




app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


