const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const http = require('http').Server(app);
const cors = require("cors");
// const socketIO = require('socket.io')(http, {
//   cors: {
//       origin: "http://localhost:3000"
//   }
// });

//ROUTERS
const matchesRouter = require('./routes/matches');
const podsRouter = require('./routes/pods');
const usersRouter = require('./routes/users');
const simRouter = require('./routes/sim');

//MIDDLEWARE
app.use(express.static(path.join(__dirname, '../client/site-unseen/build')));
app.use(cors());
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//ROUTES
app.use('/users', usersRouter);
app.use('/pods', podsRouter);
app.use('/matches', matchesRouter);
app.use('/sim', simRouter);

if( process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production'){
  //SOCKET CONNECTION
  // socketIO.on('connection', (socket) => {
  //   console.log("New Client Connected!");
  //   console.log(`⚡: ${socket.id} user just connected!`);
  //   socket.on("message", data => {
  //     console.log(data);

  //     // let interval = setInterval(()=> getSelPos(socket), 2000);
  // });
  // // const getSelPos = async(socket) =>{
  // //   console.log(" IAM WORKING")
  // // }
  //   socket.on('disconnect', () => {
  //     console.log('🔥: A user disconnected');
  //   });
  // });
  app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../client/site-unseen/build/index.html'))
  })
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
    res.json({'error': err});
  });
}

module.exports = app;
