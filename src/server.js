require('dotenv').config();
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const session = require('express-session');
const openapiParser = require('swagger-parser');
const cors = require('cors');

const logger = require('./utils/logger');
// eslint-disable-next-line no-unused-vars
const Database = require('./models/db');
// const swaggerDocument = require('./docs/apidocs.json');
const { productsRouter } = require('./controllers/products');
const { cartsRouter } = require('./controllers/cart');
const { userRouter } = require('./controllers/user');
const { router } = require('./routers/auth.route');
const { passport } = require('./utils/passport.util');

const PORT = 8080;
async function main() {
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
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(deps[0]));
  app.use('/api/products', productsRouter);
  app.use('/api/carts', cartsRouter);
  app.use('/api/user', userRouter);
  app.use('/', router);

  app.listen(PORT, () => {
    logger.info(`Server up and listening on: http://localhost:${PORT}`);
  });

  app.on('error', (err) => {
    logger.fatal(err);
  });
}

main();
