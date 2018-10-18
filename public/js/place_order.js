/* eslint-env browser */

/* global

  filterValidationError,
  removeFromClassList,
  displaySuccessAlert,
  readResponseAsJSON,
  displayErrorAlert,
  displayElement,
  addToClassList,
  fetchFoodItems,
  createCartItem,
  toggleModal,
  setCartIcon,
  confirmUser,
  insertHTML,
  appendDOM,
  baseUrl,
  token,
  cart

*/

const placeOrderUrl = `${baseUrl}/api/v1/orders`;

const createCartItemElement = (cartItem, foodItems) => {
  const foodItem = foodItems.find(val => val.food_id === cartItem.foodId);
  foodItem.quantity = Number(cartItem.quantity);
  const foodItemElement = createCartItem(foodItem);
  return foodItemElement;
};

const renderOrderedItems = (cart) => {
  const foodItems = JSON.parse(localStorage.getItem('foodItems'));
  const cartItems = Object.keys(cart.items).map((key) => {
    const foodObj = {};
    foodObj.foodId = Number(key);
    foodObj.quantity = cart.items[key];
    return foodObj;
  });
  insertHTML('cart-items', '');
  cartItems.forEach((cartItem) => {
    const cartItemElement = createCartItemElement(cartItem, foodItems);
    appendDOM('cart-items', cartItemElement);
  });
};


const setTotalAmount = (cart) => {
  setCartIcon(cart);
  const amount = cart.total;
  insertHTML('amount', amount);
};

const processPlaceOrder = (response) => {
  if (!response.error) {
    displaySuccessAlert(response.message);
  } else {
    const { error } = response;
    const { description } = error;
    const errorCode = error.status;
    const { fields } = error;
    let errMess;
    let fieldsError;
    insertHTML('place-order-error', '');
    switch (errorCode) {
      case 401:
        errMess = `${description}</br> Please Login`;
        break;
      case 403:
        errMess = 'Your login session expired </br> Please Login';
        break;
      case 422:
        fieldsError = filterValidationError(fields);
        appendDOM('place-order-error', fieldsError);
        errMess = 'Error';
        break;
      case 400:
        errMess = 'description';
        break;
      default:
        errMess = 'something unusual happened, pls try later';
        break;
    }
    displayElement('loadingModal', 'none');
    displayElement('alertModal', 'block');
    insertHTML('place-order-error-text', errMess);
    addToClassList('place-order-alert-element', 'error-alert');
    removeFromClassList('place-order-alert-element', 'warning-alert');
    removeFromClassList('place-order-alert-element', 'success-alert');
  }
};

const placeOrderRequest = (event) => {
  event.preventDefault();
  const foodItems = cart.checkOut();
  const userData = {
    phoneNo: document.getElementById('phone-no').value,
    address: document.getElementById('address').value,
    foodItems
  };

  const postData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData)
  };

  displayElement('loadingModal', 'block');
  displayElement('alert', 'none');
  // fetch request
  fetch(placeOrderUrl, postData)
    .then(readResponseAsJSON)
    .then(processPlaceOrder)
    .catch((error) => {
      displayElement('loadingModal', 'none');
      displayErrorAlert(error);
    });
};

const renderCheckoutModal = () => {
  toggleModal('checkoutModal');
  setTotalAmount(cart);
  renderOrderedItems(cart);
};

const displayCheckoutModal = () => {
  const noOfItems = Object.keys(cart.items).length;
  if (noOfItems === 0) {
    displayErrorAlert('Your Cart is Empty');
  } else {
    renderCheckoutModal();
  }
};

const orderNow = (event) => { // eslint-disable-line no-unused-vars
  const isUser = confirmUser();
  if (!isUser) {
    displayErrorAlert('You need to login/signup to place an order');
  } else {
    displayCheckoutModal();
  }
};

const updateInputValue = (action, event) => {
  const inputElement = event.path[1].children[1];
  let inputValue = inputElement.value;
  inputValue = parseInt(inputValue, 10);
  if (action === 'plus') {
    inputElement.value = inputValue + 1;
  }
  if (action === 'minus') {
    inputElement.value = (inputValue < 1) ? 0 : inputValue - 1;
  }
};

const addItemToCart = (event) => { // eslint-disable-line no-unused-vars
  updateInputValue('plus', event);
  const foodId = event.path[3].children[3].attributes[1].value;
  let price = event.path[3].children[2].attributes[0].value;
  let quantity = event.path[1].children[1].value;
  quantity = parseInt(quantity, 10);
  price = parseInt(price, 10);
  quantity = parseInt(quantity, 10);
  cart.addItem(foodId, quantity, price);
  setCartIcon(cart);
  setTotalAmount(cart);
};

const removeItemFromCart = (event) => { // eslint-disable-line no-unused-vars
  updateInputValue('minus', event);
  const foodId = event.path[3].children[3].attributes[1].value;
  let price = event.path[3].children[2].attributes[0].value;
  let quantity = event.path[1].children[1].value;
  quantity = parseInt(quantity, 10);
  price = parseInt(price, 10);
  // cart.addItem(foodId, quantity, price);
  cart.removeItem(foodId, quantity, price);
  setTotalAmount(cart);
};

const editCartItem = (event) => { // eslint-disable-line no-unused-vars
  const foodId = event.path[3].children[3].attributes[1].value;
  let price = event.path[3].children[2].attributes[0].value;
  let quantity = event.path[1].children[1].value;
  quantity = parseInt(quantity, 10);
  price = parseInt(price, 10);
  cart.removeItem(foodId, quantity, price);
  setTotalAmount(cart);
};

const removeFoodItem = (event) => { // eslint-disable-line no-unused-vars
  const foodItemCard = event.path[2];
  foodItemCard.style.display = 'none';
  const foodId = event.path[1].attributes[1].value;
  let price = event.path[2].children[2].attributes[0].value;
  const quantity = 0;
  price = parseInt(price, 10);
  cart.removeItem(foodId, quantity, price);
  setTotalAmount(cart);
  if (cart.total === 0) {
    toggleModal('checkoutModal');
  }
};

window.addEventListener('load', () => {
  fetchFoodItems();
  document.getElementById('placeorder-form').addEventListener('submit', placeOrderRequest);
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('cart', JSON.stringify(cart));
});
