function normalizeOrders(orders) {
  let parsedOrders;
  if (Array.isArray(orders)) {
    parsedOrders = orders.map((order) => ({
      id: order.id,
      user: order.user,
      status: order.status,
      deliveryDate: order.deliveryDate,
      products: order.products.map((product) => ({ id: product.id, ammount: product.ammount })),
    }));
  } else if (typeof orders === 'object') {
    parsedOrders = {
      id: orders.id,
      user: orders.user,
      status: orders.status,
      deliveryDate: orders.deliveryDate,
      products: orders.products.map((product) => ({ id: product.id, ammount: product.ammount })),
    };
  } else {
    throw new Error(`Orders must be of type object or array, recieved a ${typeof orders}`);
  }
  return parsedOrders;
}

module.exports = normalizeOrders;
