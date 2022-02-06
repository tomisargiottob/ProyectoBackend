function normalizeCarts(carts) {
  let parsedCarts;
  if (Array.isArray(carts)) {
    parsedCarts = carts.map((cart) => ({
      id: cart.id,
      products: cart.products.map((product) => ({ id: product.id, ammount: product.ammount })),
      user: cart.user,
    }));
  } else if (typeof carts === 'object') {
    parsedCarts = {
      id: carts.id,
      products: carts.products.map((product) => ({ id: product.id, ammount: product.ammount })),
      user: carts.user,
    };
  } else {
    throw new Error(`Carts must be of type object or array, recieved a ${typeof carts}`);
  }
  return parsedCarts;
}

module.exports = normalizeCarts;
