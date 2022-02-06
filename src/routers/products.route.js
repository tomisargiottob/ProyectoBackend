const { Router } = require('express');
const {
  getProducts,
  createProduct,
  findProduct,
  updateProduct,
  removeProduct,
} = require('../controllers/product.controller');
const checkAuthenticated = require('../middleware/auth.middleware');

const productRouter = new Router();

productRouter.get('', getProducts);
productRouter.post('', checkAuthenticated, createProduct);
productRouter.get('/:id', findProduct);
productRouter.put('/:id', checkAuthenticated, updateProduct);
productRouter.delete('/:id', checkAuthenticated, removeProduct);

module.exports = { productRouter };
