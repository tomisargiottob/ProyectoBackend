const { Router } = require('express');
const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
const checkAuthenticated = require('../middleware/auth.middleware');

const cartsRouter = new Router();

cartsRouter.get('', checkAuthenticated, async (req, res) => {
  try {
    if (req.headers.authorization) {
      const carts = await Cart.find();
      res.status(200).send(carts);
    } else {
      res.status(401).send({ code: 401, message: 'user not authorized' });
    }
  } catch (err) {
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.get('/:id', checkAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const foundCart = await Cart.findOne({ _id: id });
    if (foundCart) {
      res.status(200).send(foundCart);
    } else {
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.post('', checkAuthenticated, async (req, res) => {
  const cart = req.body;
  try {
    const createdCart = await Cart.create(cart);
    res.status(200).send({ createdCart });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

cartsRouter.delete('/:id', checkAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    if (req.headers.authorization) {
      const cart = await Cart.deleteOne({ _id: id });
      if (cart.n) {
        res.status(200).send({ cart });
      } else {
        res.status(404).send({ code: 404, message: `Cart with id ${id} does not exist` });
      }
    } else {
      res.status(401).send({ code: 401, message: 'user not authorized' });
    }
  } catch (err) {
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.get('/:id/products', checkAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const foundCart = await Cart.findOne({ _id: id });
    if (foundCart) {
      res.status(200).send({ products: foundCart.products });
    } else {
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.post('/:id/products/:idProd', checkAuthenticated, async (req, res) => {
  const { id, idProd } = req.params;
  const { amount } = req.body;
  try {
    const foundCart = await Cart.findOne({ _id: id });
    if (foundCart) {
      // eslint-disable-next-line
      let product = foundCart.products.find((element) => element._id == idProd);
      if (!product) {
        product = JSON.parse(JSON.stringify(await Product.findOne({ _id: idProd })));
        product.amount = amount;
        foundCart.products.push(product);
      } else {
        product.amount += amount;
      }
      const updatedCart = await Cart.findOneAndUpdate({ _id: id }, foundCart, { new: true });
      res.status(200).send({ cart: updatedCart });
    } else {
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.put('/:id/products/:idProd', checkAuthenticated, async (req, res) => {
  const { id, idProd } = req.params;
  const { amount } = req.body;
  try {
    const foundCart = await Cart.findOne({ _id: id });
    if (foundCart) {
      // eslint-disable-next-line
      const product = foundCart.products.find((element) => element._id == idProd);
      if (product) {
        product.amount = amount;
        await Cart.findOneAndUpdate({ _id: id }, foundCart, { new: true });
        res.status(200).send({ foundCart });
      } else {
        res.status(404).send({ code: 404, message: `There is no product with the id ${idProd} in the cart` });
      }
    } else {
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    res.status(500).send({ code: 500, message: err.message });
  }
});

cartsRouter.delete('/:id/products/:idProd', checkAuthenticated,  async (req, res) => {
  const { id, idProd } = req.params;
  try {
    const cart = await Cart.findOne({ _id: id });
    if (cart) {
      // eslint-disable-next-line
      cart.products = cart.products.filter((product) => product._id != idProd);
      const updatedCart = await Cart.findOneAndUpdate({ _id: id }, cart, { new: true });
      res.status(200).send({ cart: updatedCart });
    } else {
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    res.status(500).send({ code: 500, message: err.message });
  }
});

module.exports = { cartsRouter };
