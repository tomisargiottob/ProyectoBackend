const express = require('express');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const log = require('simple-node-logger').createSimpleLogger({
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
});
const swaggerDocument = require('./docs/apidocs.json');
const { productsRouter } = require('./controllers/products');
const { cartsRouter } = require('./controllers/cart');

log.setLevel('debug');
const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, './files/index.html'));
});

app.listen(PORT, () => {
  log.info(`Server up and listening on: http://localhost:${PORT}`);
});

app.on('error', (err) => {
  log.fatal(err);
});
