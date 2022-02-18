require('dotenv').config();
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const openapiParser = require('swagger-parser');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const minimist = require('minimist');
const { createServer } = require('http');
const { Server } = require('socket.io');

const logger = require('./utils/logger');
const Database = require('./models');
// const socket = require('./utils/websocketManager');
const { productRouter } = require('./routers/products.route');
const { cartRouter } = require('./routers/carts.route');
const { userRouter } = require('./routers/users.route');
const { messageRouter } = require('./routers/messages.route');
const { router } = require('./routers/auth.route');

const nCpus = os.cpus().length;
const args = minimist(process.argv.slice(2), {
  default: {
    m: process.env.m || 'fork',
  },
});

async function initializeApp() {
  let db;
  if (args.d === 'mongo') {
    db = new Database({ logger, uri: process.env.MONGODBURI });
  }
  const deps = await Promise.all([
    openapiParser.dereference('src/docs/openapi.yaml'),
    db ? db.connect() : true,
  ]);

  const app = express();
  const server = createServer(app);
  const io = new Server(server);
  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use('/api/products', productRouter);
  app.use('/api/messages', messageRouter);
  app.use('/api/carts', cartRouter);
  app.use('/api/user', userRouter);
  app.use('/', router);
  app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '/files/websocket.html'));
  });
  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/files/login.html'));
  });
  app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(deps[0]));

  server.listen(process.env.PORT, () => {
    logger.info(`Server up and listening on: http://localhost:${process.env.PORT}`);
  });

  server.on('error', (err) => {
    logger.fatal(err);
  });
}

async function main() {
  if (args.m === 'cluster') {
    if (cluster.isMaster) {
      logger.info(`Master PID ${process.pid} is running`);
      for (let i = 0; i < nCpus; i += 1) {
        cluster.fork();
      }
      cluster.on('exit', (worker) => {
        logger.info(`Worker PID ${worker.process.pid} has exited`);
      });
    } else {
      logger.info(`Worker PID ${process.pid} is running`);
      initializeApp();
    }
  } else {
    logger.info(`Mode fork process ${process.pid} is running`);
    initializeApp();
  }
}

main();
