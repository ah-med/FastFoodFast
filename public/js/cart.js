/* eslint-env browser */

/**
 * @class Cart
 */
class Cart {
  /**
      * Constructor
        *@param {object} total quantity *.
        *@param {object} items price *.
        *@param {object} cartArray price *.
      */
  constructor(total, items, cartArray) {
    this.total = total || 0;
    this.items = items || {};
    this.cartArray = cartArray || [];
  }

  /**
        * add a foodItem to the cart
        *@param {object} foodId the foodId *.
        *@param {object} quantity quantity *.
        *@param {object} price price *.
        *@returns {object} returns undefined *
        */
  addItem(foodId, quantity, price) {
    this.total = (this.items[foodId])
      ? this.total - (this.items[foodId] * price) + (quantity * price)
      : this.total + (quantity * price);
    this.items[foodId] = quantity;
  }

  /**
        * remove foodItem from the cart
        *@param {object} foodId the foodId *.
        *@param {object} quantity quantity *.
        *@param {object} price price *.
        *@returns {object} returns undefined *
        */
  removeItem(foodId, quantity, price) {
    this.addItem(foodId, quantity, price);
    if (quantity === 0) {
      // remove the item from cart
      delete this.items[foodId];
    }
  }

  /**
        * checkout the cart items
        *@returns {array} returns cartArray *
        */
  checkOut() {
    const { items } = this;
    const cartArray = Object.keys(this.items).map((key) => {
      const foodObj = {};
      foodObj.foodId = Number(key);
      foodObj.quantity = items[key];
      return foodObj;
    });
      // empty the cart
    this.items = {};
    this.total = 0;
    this.cartArray = cartArray;
    return cartArray;
  }
}


const createCart = () => {
  const storedCart = localStorage.getItem('cart');
  let cart;
  if (storedCart === 'null') {
    cart = new Cart();
  } else {
    const { total, items, cartArray } = JSON.parse(storedCart);
    cart = new Cart(total, items, cartArray);
  }
  return cart;
};

const cart = createCart(); // eslint-disable-line no-unused-vars
