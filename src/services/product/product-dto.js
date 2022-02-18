function normalizeProducts(products) {
  let parsedProducts;
  if (Array.isArray(products)) {
    parsedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      thumbnail: product.thumbnail,
      description: product.description,
      category: product.category,
      code: product.code,
      stock: product.stock,
    }));
  } else if (typeof products === 'object') {
    parsedProducts = {
      id: products.id,
      name: products.name,
      price: products.price,
      thumbnail: products.thumbnail,
      description: products.description,
      category: products.category,
      code: products.code,
      stock: products.stock,
    };
  } else {
    throw new Error(`Products must be of type object or array, recieved a ${typeof products}`);
  }
  return parsedProducts;
}

module.exports = normalizeProducts;
