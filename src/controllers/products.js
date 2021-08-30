const { Router } = require('express');
const Contenedor = require('../models/productModel');

const productsRouter = new Router();
const products = new Contenedor('products.json');

productsRouter.get('', (req, res) => {
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
  await products.save(product);
  res.status(200).send({ product });
});

productsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const product = await products.update(id, data);
    res.status(200).send({ product });
  } catch {
    res.status(404).send(`There is no product with the id ${id}`);
  }
});

productsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await products.deleteById(id);
    res.status(200).send({ product });
  } catch {
    res.status(404).send(`There is no product with the id ${id}`);
  }
});

module.exports = { products, productsRouter };
