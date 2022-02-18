/* eslint-disable class-methods-use-this */
const ProductDao = require('./product-dao');
const ProductModel = require('../../models/product-model');
const returnProducts = require('./product-dto');

let instance;

class ProductDaoMongo extends ProductDao {
  async getAll(where) {
    const productsMongo = await ProductModel.find(where);
    const products = returnProducts(productsMongo);
    return products;
  }

  // eslint-disable-next-line consistent-return
  async find(where) {
    let product;
    try {
      product = await ProductModel.findOne(where);
      if (product) {
        return returnProducts(product);
      }
    } catch (err) {
      throw new Error('Error looking for Product');
    }
  }

  async update(id, data) {
    // eslint-disable-next-line no-param-reassign
    data.id = id;
    const product = await ProductModel.findOneAndUpdate({ id }, data, { new: true });
    if (product) {
      return returnProducts(product);
    }
    throw new Error('Product not found');
  }

  async delete(id) {
    await ProductModel.findOneAndRemove(id);
  }

  async create(data) {
    if (data.id) {
      // eslint-disable-next-line no-param-reassign
      delete data.id;
    }
    const product = await ProductModel.create(data);
    return returnProducts(product);
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new ProductDaoMongo(logger);
    return instance;
  }
}

module.exports = ProductDaoMongo;
