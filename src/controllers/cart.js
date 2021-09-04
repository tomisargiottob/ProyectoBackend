const { Router } = require('express');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const cartsRouter = new Router();
const carts = new Cart('carts.json');
const products = new Product('products.json');

cartsRouter.get('', (req, res) => {
  if (req.headers.authorization) {
    res.status(200).send(carts.getAll());
  }
  res.status(401).send({ code: 401, message: 'user not authorized' });
});

cartsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const foundCart = carts.getById(id);
    res.status(200).send(foundCart);
  } catch {
    res.status(404).send(`There is no cart with the id ${id}`);
  }
});

cartsRouter.post('', async (req, res) => {
  const cart = req.body;
  await carts.save(cart);
  res.status(200).send({ cart });
});

cartsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (req.headers.authorization) {
      const cart = await carts.deleteById(id);
      res.status(200).send({ cart });
    }
    res.status(401).send({ code: 401, message: 'user not authorized' });
  } catch {
    res.status(404).send(`There is no cart with the id ${id}`);
  }
});

cartsRouter.get('/:id/products', async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await carts.getById(id);
    res.status(200).send({ products: cart.products });
  } catch {
    res.status(404).send(`There is no cart with the id ${id}`);
  }
});

cartsRouter.post('/:id/products/:idProd', async (req, res) => {
  const { id, idProd } = req.params;
  const { amount } = req.body;
  try {
    const cart = await carts.getById(id);
    let product = cart.products.filter((element) => element.id === idProd);
    if (!product.length) {
      product = await products.getById(idProd);
      product[0].amount = amount;
      cart.products.push(product[0]);
    } else {
      product[0].amount += amount;
    }
    carts.update(id, cart);
    res.status(200).send({ cart });
  } catch (err) {
    res.status(404).send(err);
  }
});

cartsRouter.put('/:id/products/:idProd', async (req, res) => {
  const { id, idProd } = req.params;
  const { amount } = req.body;
  try {
    const cart = await carts.getById(id);
    const product = cart.products.find((element) => element.id === idProd);
    product.amount = amount;
    carts.update(id, cart);
    res.status(200).send({ cart });
  } catch (err) {
    res.status(404).send(err);
  }
});

cartsRouter.delete('/:id/products/:idProd', async (req, res) => {
  const { id, idProd } = req.params;
  try {
    const cart = carts.getById(id);
    cart.products = cart.products.filter((product) => product.id !== idProd);
    carts.update(id, cart);
    res.status(200).send({ cart });
  } catch {
    res.status(404).send(`There is no cart with the id ${id}`);
  }
});

module.exports = { carts, cartsRouter };
