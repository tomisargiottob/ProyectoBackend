require('dotenv').config();
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const session = require('express-session');
const openapiParser = require('swagger-parser');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const minimist = require('minimist');

const logger = require('./utils/logger');
const Database = require('./models/db');
const { productsRouter } = require('./controllers/products');
const { cartsRouter } = require('./controllers/cart');
const { userRouter } = require('./controllers/user');
const { router } = require('./routers/auth.route');
const { passport } = require('./utils/passport.util');

const nCpus = os.cpus().length;
const args = minimist(process.argv.slice(2), {
  default: {
    m: process.env.m || 'fork',
  },
});

async function initializeApp() {
  const db = new Database({ logger, uri: process.env.MONGODBURI });
  const deps = await Promise.all([
    openapiParser.dereference('src/docs/openapi.yaml'),
    db.connect(),
  ]);

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 300000,
      httpOnly: false,
      secure: false,
    },
  }));
  app.use(express.static('public'));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/api/products', productsRouter);
  app.use('/api/carts', cartsRouter);
  app.use('/api/user', userRouter);
  app.use('/', router);
  app.get('/', swaggerUI.serve, swaggerUI.setup(deps[0]));

  app.listen(process.env.PORT, () => {
    logger.info(`Server up and listening on: http://localhost:${process.env.PORT}`);
  });

  app.on('error', (err) => {
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
