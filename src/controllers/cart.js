const { Router } = require('express');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const cartsRouter = new Router();
const carts = new Cart('carts.json');
const products = new Product('products.json');

cartsRouter.get('', (req, res) => {
  res.status(200).send(carts.getAll());
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
    const cart = await carts.deleteById(id);
    res.status(200).send({ cart });
  } catch {
    res.status(404).send(`There is no cart with the id ${id}`);
  }
});

cartsRouter.post('/:id/products/:idProd', async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await carts.get(id);
    res.status(200).send({ products: cart.products });
  } catch {
    res.status(404).send(`There is no cart with the id ${id}`);
  }
});

cartsRouter.post('/:id/products/:idProd', async (req, res) => {
  const { id, idProd } = req.params;
  try {
    const cart = await carts.get(id);
    cart.products.push(products.getById(idProd));
    carts.update(id, cart);
    res.status(200).send({ cart });
  } catch {
    res.status(404).send(`There is no cart with the id ${id}`);
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
