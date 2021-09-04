const { Router } = require('express');
const Contenedor = require('../models/productModel');

const productsRouter = new Router();
const products = new Contenedor('products.json');

productsRouter.get('', (req, res) => {
  console.log(req.headers);
  res.status(200).send(products.getAll());
});

productsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const foundProduct = products.getById(id);
    res.status(200).send(foundProduct);
  } catch {
    res.status(404).send(`There is no product with the id ${id}`);
  }
});

productsRouter.post('', async (req, res) => {
  const product = req.body;
  if (req.headers.authorization) {
    await products.save(product);
    res.status(200).send({ product });
  }
  res.status(401).send({ code: 401, message: 'user not authorized' });
});

productsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    if (req.headers.authorization) {
      const product = await products.update(id, data);
      res.status(200).send({ product });
    }
    res.status(401).send({ code: 401, message: 'user not authorized' });
  } catch {
    res.status(404).send(`There is no product with the id ${id}`);
  }
});

productsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (req.headers.authorization) {
      const product = await products.deleteById(id);
      res.status(200).send({ product });
    }
    res.status(401).send({ code: 401, message: 'user not authorized' });
  } catch {
    res.status(404).send(`There is no product with the id ${id}`);
  }
});

module.exports = { products, productsRouter };
