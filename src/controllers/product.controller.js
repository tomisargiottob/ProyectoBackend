const ProductDaoFactory = require('../services/product/product-factory');
const ProductDao = ProductDaoFactory.getDao();

const logger = require('../utils/logger');

const log = logger.child({ module: 'product controller' });

async function getProducts(req, res) {
  try {
    log.info('Searching all products');
    const allProducts = await ProductDao.getAll();
    res.status(200).send(allProducts);
    log.info('All products sent');
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

async function findProduct(req, res) {
  const { id } = req.params;
  try {
    log.info('Searching product');
    const foundProduct = await ProductDao.find({ id });
    if (foundProduct) {
      res.status(200).send(foundProduct);
      log.info('Product sent');
    } else {
      log.info({ id }, 'Product does not exist');
      res.status(404).send({ code: 404, message: `Product with id ${id} does not exist` });
    }
  } catch (err) {
    log.error('Could not get product');
    res.status(500).send({ message: err.message });
  }
}

async function createProduct(req, res) {
  const product = req.body;
  try {
    const newProduct = await ProductDao.create(product);
    log.info('New product added to database');
    res.status(200).send({ newProduct });
  } catch (err) {
    log.error('Could not create product');
    res.status(500).send({ message: err.message });
  }
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const data = req.body;
  try {
    const product = await ProductDao.update(id, data);
    if (product) {
      log.info({ id }, 'Product succesfully edited');
      res.status(200).send({ product });
    } else {
      log.info({ id }, 'Product does not exist');
      res.status(404).send({ code: 404, message: `Product with id ${id} does not exist` });
    }
  } catch (err) {
    log.error('Could not edit product');
    res.status(500).send({ code: 500, message: err.message });
  }
}

async function removeProduct(req, res) {
  const { id } = req.params;
  try {
    const product = await ProductDao.deleteOne(id);
    if (product.n) {
      log.info({ id }, 'Product succesfully deleted');
      res.status(204).send();
    } else {
      log.info({ id }, 'Product does not exist ');
      res.status(404).send({ code: 404, message: `Product with id ${id} does not exist` });
    }
  } catch (err) {
    log.info({ id }, 'Product could not be deleted');
    res.status(500).send({ code: 500, message: err.message });
  }
}

module.exports = {
  getProducts,
  findProduct,
  createProduct,
  updateProduct,
  removeProduct,
};
