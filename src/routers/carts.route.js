const { Router } = require('express');
const {
  getCarts,
  findCart,
  completeCart,
  deleteCart,
  getCartProducts,
  addCartProduct,
  updateCartProduct,
  removeCartProduct,
} = require('../controllers/cart.controller');
const checkAuthenticated = require('../middleware/auth.middleware');

const cartRouter = new Router();

cartRouter.get('', checkAuthenticated, getCarts);
cartRouter.get('/:id', checkAuthenticated, findCart);
cartRouter.post('/:id', checkAuthenticated, completeCart);
cartRouter.delete('/:id', checkAuthenticated, deleteCart);

cartRouter.get('/:id/products', checkAuthenticated, getCartProducts);
cartRouter.post('/:id/products', checkAuthenticated, addCartProduct);

cartRouter.put('/:id/products/:idProd', checkAuthenticated, updateCartProduct);
cartRouter.delete('/:id/products/:idProd', checkAuthenticated, removeCartProduct);

module.exports = { cartRouter };
