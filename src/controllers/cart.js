const { Router } = require('express');
const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
const User = require('../models/user-model');
const Order = require('../models/order-model');
const checkAuthenticated = require('../middleware/auth.middleware');
const logger = require('../utils/logger');

const log = logger.child({ module: 'Cart controller' });
const cartsRouter = new Router();

cartsRouter.get('', checkAuthenticated, async (req, res) => {
  try {
    log.info('Searching for all carts');
    const carts = await Cart.find();
    res.status(200).send(carts);
    log.info('All carts information sent');
  } catch (err) {
    log.info('Could not fetch all carts');
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.get('/:id', checkAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const foundCart = await Cart.findOne({ _id: id });
    if (foundCart) {
      res.status(200).send(foundCart);
      log.info({ id }, 'Cart information sent');
    } else {
      log.info({ id }, 'Cart not found');
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    log.info('Could not fetch cart');
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.post('/:id', checkAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const userCart = await Cart.findOne({ _id: id });
    const user = await User.findOne({ cart: id });
    const date = new Date();
    const createdOrder = await Order.create({
      // eslint-disable-next-line no-underscore-dangle
      user: user._id,
      products: userCart.products,
      status: 'pending',
      deliveryDate: date.setDate(date.getDate() + 1),
    });
    await Cart.findOneAndUpdate({ products: [] });
    res.status(200).send({ createdOrder });
    log.info('Order succesfully created');
  } catch (err) {
    log.warn('Could not create order');
    res.status(500).send({ message: err.message });
  }
});

cartsRouter.delete('/:id', checkAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.deleteOne({ _id: id });
    if (cart.n) {
      res.status(200).send({ cart });
      log.warn('Could succesfully created');
    } else {
      res.status(404).send({ code: 404, message: `Cart with id ${id} does not exist` });
      log.warn('Cart does not exist');
    }
  } catch (err) {
    log.warn('Cart could not be deleted');
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.get('/:id/products', checkAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const foundCart = await Cart.findOne({ _id: id });
    if (foundCart) {
      res.status(200).send({ products: foundCart.products });
      log.warn('Cart products fetched');
    } else {
      log.warn('Cart does not exist');
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    log.warn('Cart products could not be fetched');
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.post('/:id/products/:idProd', checkAuthenticated, async (req, res) => {
  const { id, idProd } = req.params;
  const { ammount } = req.body;
  try {
    if (ammount <= 0) {
      res.status(400).send({ code: 400, message: 'Can not set a negative ammount to a product' });
    }
    const foundCart = await Cart.findOne({ _id: id });
    if (foundCart) {
      log.info({ id }, 'Cart fetched , adding products');
      // eslint-disable-next-line
      let product = foundCart.products.find((element) => element._id == idProd);
      if (!product) {
        product = await Product.findOne({ _id: idProd });
        if (!product) {
          log.warn({ id }, 'Product does not exist');
          res.status(404).send({ code: 404, message: `There is no product with the id ${idProd}` });
        }
        // eslint-disable-next-line no-underscore-dangle
        foundCart.products.push({ _id: idProd, ammount });
      } else {
        product.ammount += ammount;
      }
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: id },
        { products: foundCart.products },
        { new: true },
      );
      res.status(200).send({ cart: updatedCart });
    } else {
      log.warn({ id }, 'Cart does not exist');
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    log.warn({ cart: id, product: idProd }, 'Product could not be added to cart');
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.put('/:id/products/:idProd', checkAuthenticated, async (req, res) => {
  const { id, idProd } = req.params;
  const { ammount } = req.body;
  try {
    const foundCart = await Cart.findOne({ _id: id });
    if (foundCart) {
      // eslint-disable-next-line
      const product = foundCart.products.find((element) => element._id == idProd);
      if (product) {
        product.ammount = ammount;
        await Cart.findOneAndUpdate({ _id: id }, { products: foundCart.products }, { new: true });
        res.status(200).send({ foundCart });
        log.info({ id, product: idProd }, 'Cart product succesfully updated');
      } else {
        log.info({ id, product: idProd }, 'Cart does not have product selected');
        res.status(404).send({ code: 404, message: `There is no product with the id ${idProd} in the cart` });
      }
    } else {
      log.info({ id }, 'Cart does not exist');
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    log.warn({ cart: id, product: idProd }, 'Product could not be edited in cart');
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.delete('/:id/products/:idProd', checkAuthenticated, async (req, res) => {
  const { id, idProd } = req.params;
  try {
    const cart = await Cart.findOne({ _id: id });
    if (cart) {
      // eslint-disable-next-line
      cart.products = cart.products.filter((product) => product._id != idProd);
      const updatedCart = await Cart.findOneAndUpdate({ _id: id }, cart, { new: true });
      res.status(200).send({ cart: updatedCart });
      log.info({ id, product: idProd }, 'Cart product succesfully removed');
    } else {
      log.info({ id }, 'Cart does not exist');
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    log.warn({ cart: id, product: idProd }, 'Product could not be removed from cart');
    res.status(500).send({ code: 500, message: err.message });
  }
});

module.exports = { cartsRouter };
