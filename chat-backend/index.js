const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const http = require('http');
const appConfig = require('./config/appConfig');
const logger = require('./app/libs/loggerLib');
const routeLoggerMiddleware = require('./app/middlewares/routeLogger');
const globalErrorMiddleware = require('./app/middlewares/appErrorHandler');
const mongoose = require('mongoose');
const morgan = require('morgan');

/**Middlewares. */
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);
app.use(express.static(path.join(__dirname, 'client')));

app.all('*',(req,res,next)=>{
   res.header("Access-Control-Allow-Origin","*");
   res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
   res.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE");
   next();
});

/**Bootstrap models. */
const modelsPath = './app/models';
fs.readdirSync(modelsPath).forEach((file)=>{
  if(~file.indexOf('.js')) require(modelsPath + '/' + file);
});

/**Bootstrap routes. */
const routesPath = './app/routes';
fs.readdirSync(routesPath).forEach((file)=>{
  if(~file.indexOf('.js')){
      let route = require(routesPath + '/' + file);
      route.setRouter(app);
  }
});

/**Calling global 404 handler after route. */
app.use(globalErrorMiddleware.globalNotFoundHandler);

/**Creating http server. */
const server = http.createServer(app);

/**Start listening to server. */
console.log(appConfig);
server.listen(appConfig.port);
server.on('error',onError);
server.on('listening',onListening);

/**Event listener for HTTP server "error" event. */
let onError = (error)=>{
   if(error.syscall !== 'listen'){
     logger.error(error.code + ' not equal listen', 'serverOnErrorHandler',10);
     throw error;
   }
   //handle specific listen errors with friendly message.
   switch(error.code){
    case 'EACCES':
        logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler',10);
        process.exit(1);
        break;
    case 'EADDRINUSE':
        logger.error(error.code + ':port is already in use.','serverOnErrorHandler',10);
        process.exit(1);
        break;
    default:
        logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler',10);
        throw error;
   }
}

/**Event listener for HTTP server "listening" event. */
let onListening = ()=>{
    let addr = server.address();
    let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
    logger.info('server listening on port ' + addr.port, 'serverOnListeningHandler', 10);
    let db = mongoose.connect(appConfig.db.uri,{ useMongoClient:true });
}

/**Application specific logging, throwing an error, or other logic here. */
process.on('unhandledRejection',(reason, p)=>{
    console.log('Unhandled Rejection at: Promise', p, 'reason: ', reason);
});

/**Database connection setting. */
mongoose.connection.on('error',(err)=>{
   console.log("Database connection error.");
   console.log(err);
   logger.error(err,'mongoose connection on error handler.', 10);
});

/**Mongoose open connection handler. */
mongoose.connection.on('open',(err)=>{
   if(err){
     console.log('Database error.');
     console.log(err);
     logger.error(err,'mongoose connection open handler.',10);
   }else{
     console.log('Database connection open success.');
     logger.info('Database connection open','Database connection open handler', 10);

   }
});


module.exports = app;