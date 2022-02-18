/* eslint-disable no-underscore-dangle */
const { v4: uuid } = require('uuid');
const ProductDao = require('./product-dao');
const returnProducts = require('./product-dto');

let instance;

class ProductDaoMemory extends ProductDao {
  constructor(logger) {
    super(logger);
    this.products = [];
  }

  async getAll() {
    return this.products;
  }

  async find(id) {
    const foundProduct = this.products.find((product) => {
      if (product.id === id) {
        return product;
      }
      return false;
    });
    if (foundProduct) {
      return returnProducts(foundProduct);
    }
    throw new Error('product not found');
  }

  async update(id, data) {
    const index = this.products.findIndex((product) => {
      if (product.id === id) {
        return product;
      }
      return false;
    });
    if (index >= 0) {
      this.products[index] = data;
      this.products[index].id = id;
      return returnProducts(this.products[index]);
    }
    throw new Error('Product not found');
  }

  async delete(id) {
    this.products = this.products.filter((product) => product.id !== id);
    return true;
  }

  async create(data) {
    const product = {
      id: uuid(),
      name: data.name,
      price: data.price,
      thumbnail: data.thumbnail,
      description: data.description,
      category: data.category,
      code: data.code,
      stock: data.stock,
    };
    this.products.push(product);
    return returnProducts(this.products);
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new ProductDaoMemory(logger);
    return instance;
  }
}

module.exports = ProductDaoMemory;
