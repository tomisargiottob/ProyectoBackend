const fs = require('fs');
const { v4: uuid } = require('uuid');
const ProductDao = require('./product-dao');
const returnProducts = require('./product-dto');

let instance;

class ProductDaoFile extends ProductDao {
  constructor(logger) {
    super(logger);
    this.file = 'products.json';
    try {
      this.products = fs.readFileSync(this.file, 'utf-8');
      this.products = JSON.parse(this.products);
    } catch (err) {
      this.products = [];
    }
  }

  async create(product) {
    if (!this.products) {
      this.products = [];
    }
    // eslint-disable-next-line no-param-reassign
    product.id = uuid();
    this.products.push(product);
    await fs.promises.writeFile(this.file, JSON.stringify(this.products, null, 2));
    const createdProduct = returnProducts(product);
    return createdProduct;
  }

  find(id) {
    const productFound = this.products.filter((product) => product.id === id);
    if (productFound) {
      return returnProducts(productFound[0]);
    }
    throw new Error('Product not found');
  }

  getAll() {
    let products;
    try {
      this.products = fs.readFileSync(this.file, 'utf-8');
      this.products = JSON.parse(this.products);
      products = returnProducts(this.products);
    } catch (err) {
      this.log.warn('file not created yet, creating new one');
    }
    return products || [];
  }

  async delete(id) {
    try {
      this.products = fs.readFileSync(this.file, 'utf-8');
      this.products = JSON.parse(this.products).filter((product) => product.id !== id);
      fs.writeFileSync(this.file, JSON.stringify(this.products, null, 2));
      return true;
    } catch (err) {
      this.logger.error(err);
      return true;
    }
  }

  async update(id, data) {
    const productFound = this.products.findIndex((product) => product.id === id);
    if (productFound >= 0) {
      // eslint-disable-next-line no-param-reassign
      data.id = id;
      this.products[productFound] = data;
      await fs.promises.writeFile(this.file, JSON.stringify(this.products, null, 2));
      return this.products[productFound];
    }
    throw new Error('Product not found');
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new ProductDaoFile(logger);
    return instance;
  }
}

module.exports = ProductDaoFile;
