const { Router } = require('express');
const Product = require('../models/product-model');

const productsRouter = new Router();

productsRouter.get('', async (req, res) => {
  try {
    const todosProductos = await Product.find();
    res.status(200).send(todosProductos);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

productsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foundProduct = await Product.findOne({ _id: id });
    if (foundProduct) {
      res.status(200).send(foundProduct);
    } else {
      res.status(404).send({ code: 404, message: `Product with id ${id} does not exist` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

productsRouter.post('', async (req, res) => {
  const product = req.body;
  if (req.headers.authorization) {
    try {
      const newProduct = await Product.create(product);
      res.status(200).send({ newProduct });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(401).send({ code: 401, message: 'user not authorized' });
  }
});

productsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    if (req.headers.authorization) {
      const product = await Product.findOneAndUpdate({ _id: id }, data, { new: true });
      if (product) {
        res.status(200).send({ product });
      } else {
        res.status(404).send({ code: 404, message: `Product with id ${id} does not exist` });
      }
    } else {
      res.status(401).send({ code: 401, message: 'user not authorized' });
    }
  } catch (err) {
    res.status(500).send({ code: 500, message: err.message });
  }
});

productsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (req.headers.authorization) {
      const product = await Product.deleteOne({ _id: id });
      if (product.n) {
        res.status(200).send({ product });
      } else {
        res.status(404).send({ code: 404, message: `Product with id ${id} does not exist` });
      }
    } else {
      res.status(401).send({ code: 401, message: 'user not authorized' });
    }
  } catch (err) {
    res.status(404).send({ code: 500, message: err.message });
  }
});

module.exports = { productsRouter };
