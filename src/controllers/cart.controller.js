const CartDaoFactory = require('../services/cart/cart-factory');
const ProductDaoFactory = require('../services/product/product-factory');
const UserDaoFactory = require('../services/user/user-factory');
const OrderDaoFactory = require('../services/order/order-factory');
const logger = require('../utils/logger');
const sendEmail = require('../utils/mailer');

const CartDao = CartDaoFactory.getDao();
const ProductDao = ProductDaoFactory.getDao();
const UserDao = UserDaoFactory.getDao();
const OrderDao = OrderDaoFactory.getDao();

const log = logger.child({ module: 'Cart controller' });

async function getCarts(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).send({ message: 'Unauthorized request to get all carts' });
    }
    log.info('Searching for all carts');
    const carts = await CartDao.getAll();
    log.info('All carts information sent');
    return res.status(200).send(carts);
  } catch (err) {
    log.info('Could not fetch all carts');
    return res.status(500).send({ code: 500, message: err.message });
  }
}

async function findCart(req, res) {
  const { id } = req.params;
  try {
    const foundCart = await CartDao.find({ id });
    if (req.user.id !== foundCart.user && req.user.role !== 'admin') {
      res.status(401).send({ message: 'Unauthorized request to get cart information' });
    } else if (foundCart) {
      res.status(200).send(foundCart);
      log.info({ id }, 'Cart information sent');
    } else {
      log.info({ id }, 'Cart not found');
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    log.info('Could not fetch cart');
    res.status(500).send({ code: 500, message: err.message });
  }
}
// async function checkStock(products) {
//   const missing = [];
//   const dbProducts = await ProductDao.getAll();
//   products.forEach((product)=> {

//   })
// }
async function completeCart(req, res) {
  const { id } = req.params;
  try {
    const userCart = await CartDao.find({ id });
    if (req.user.id !== userCart.user && req.user.role !== 'admin') {
      res.status(401).send({ message: 'Unauthorized request to purchase all items in cart' });
    } else {
      const user = await UserDao.find({ id: userCart.user });
      const date = new Date();
      const createdOrder = await OrderDao.create({
        // eslint-disable-next-line no-underscore-dangle
        user: user.id,
        products: userCart.products,
        status: 'pending',
        deliveryDate: date.setDate(date.getDate() + 1),
      });
      res.status(200).send({ createdOrder });
      await CartDao.update(userCart.id, { products: [] });
      const subject = `Nueva orden de ${user.username}`;
      log.info('Sending email ');
      sendEmail({ subject, html: `<h1>Nueva orden registrada </h1><p> Se ha registrado una nueva orden del usuario con los siguientes productos ${JSON.stringify(userCart.products)}</p>`, to: 'admin' });
      log.info('Order succesfully created');
    }
  } catch (err) {
    log.warn('Could not create order');
    res.status(500).send({ message: err.message });
  }
}

async function deleteCart(req, res) {
  const { id } = req.params;
  try {
    const cart = await CartDao.find({ id });
    if (req.user.id !== cart.user && req.user.role !== 'admin') {
      res.status(401).send({ message: 'Unauthorized request to delete cart' });
    } else if (cart) {
      await CartDao.delete(id);
      await CartDao.create({ user: cart.user, products: [] });
      res.status(200).send({ cart });
      log.warn('Could succesfully created');
    } else {
      res.status(404).send({ code: 404, message: `Cart with id ${id} does not exist` });
      log.warn('Cart does not exist');
    }
  } catch (err) {
    log.warn('Cart could not be deleted');
    res.status(500).send({ code: 500, message: err.message });
  }
}

async function getCartProducts(req, res) {
  const { id } = req.params;
  try {
    const foundCart = await CartDao.find({ id });
    if (!foundCart) {
      log.warn('Cart does not exist');
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    } else if (req.user.id !== foundCart.user && req.user.role !== 'admin') {
      res.status(401).send({ message: 'Unauthorized request to get cart products' });
    } else {
      res.status(200).send({ products: foundCart.products });
      log.warn('Cart products fetched');
    }
  } catch (err) {
    log.warn('Cart products could not be fetched');
    res.status(500).send({ code: 500, message: err.message });
  }
}

async function addCartProduct(req, res) {
  const { id, idProd } = req.params;
  const { ammount } = req.body;
  try {
    if (!ammount || ammount < 0) {
      res.status(400).send({ code: 400, message: 'Can not set a negative ammount to a product' });
    }
    const foundCart = await CartDao.find({ id });
    if (!foundCart) {
      log.warn({ id }, 'Cart does not exist');
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    } else if (req.user.id !== foundCart.user && req.user.role !== 'admin') {
      res.status(401).send({ message: 'Unauthorized request to add product to cart' });
    } else {
      log.info({ id }, 'Cart fetched , adding products');
      // eslint-disable-next-line
      let product = foundCart.products.find((element) => element.id == idProd);
      if (!product) {
        product = await ProductDao.find({ id: idProd });
        if (!product) {
          log.warn({ id }, 'Product does not exist');
          res.status(404).send({ code: 404, message: `There is no product with the id ${idProd}` });
        }
        // eslint-disable-next-line no-underscore-dangle
        foundCart.products.push({ id: idProd, ammount });
      } else {
        product.ammount += ammount;
      }
      const updatedCart = await CartDao.update(
        id,
        { products: foundCart.products },
      );
      log.info({ id, product: idProd }, 'Product succesfully added to cart');
      res.status(200).send({ cart: updatedCart });
    }
  } catch (err) {
    log.warn({ cart: id, product: idProd }, 'Product could not be added to cart');
    res.status(500).send({ code: 500, message: err.message });
  }
}

async function updateCartProduct(req, res) {
  const { id, idProd } = req.params;
  const { ammount } = req.body;
  try {
    const foundCart = await CartDao.find({ id });
    if (foundCart) {
      if (req.user.id !== foundCart.user && req.user.role !== 'admin') {
        res.status(401).send({ message: 'Unauthorized request to update cart product' });
      } else {
        const product = foundCart.products.find((element) => element.id === idProd);
        if (product) {
          product.ammount = ammount;
          const updatedCart = await CartDao.update(id, { products: foundCart.products });
          res.status(200).send({ updatedCart });
          log.info({ id, product: idProd }, 'Cart product succesfully updated');
        } else {
          log.info({ id, product: idProd }, 'Cart does not have product selected');
          res.status(404).send({ code: 404, message: `There is no product with the id ${idProd} in the cart` });
        }
      }
    } else {
      log.info({ id }, 'Cart does not exist');
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    log.warn({ cart: id, product: idProd }, 'Product could not be edited in cart');
    res.status(500).send({ code: 500, message: err.message });
  }
}

async function removeCartProduct(req, res) {
  const { id, idProd } = req.params;
  try {
    const cart = await CartDao.find({ id });
    if (cart) {
      if (req.user.id !== cart.user && req.user.role !== 'admin') {
        res.status(401).send({ message: 'Unauthorized request to remove cart product' });
      } else {
        // eslint-disable-next-line
        cart.products = cart.products.filter((product) => product.id !== idProd);
        const updatedCart = await CartDao.update(id, { products: cart.products });
        res.status(200).send({ cart: updatedCart });
        log.info({ id, product: idProd }, 'Cart product succesfully removed');
      }
    } else {
      log.info({ id }, 'Cart does not exist');
      res.status(404).send({ code: 404, message: `There is no cart with the id ${id}` });
    }
  } catch (err) {
    log.warn({ cart: id, product: idProd }, 'Product could not be removed from cart');
    res.status(500).send({ code: 500, message: err.message });
  }
}

module.exports = {
  getCarts,
  findCart,
  completeCart,
  deleteCart,
  getCartProducts,
  addCartProduct,
  updateCartProduct,
  removeCartProduct,
};
