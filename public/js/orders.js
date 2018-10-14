/* eslint-env browser */

/* global

  readResponseAsJSON,
  displayErrorAlert,
  displayElement,
  confirmAdmin,
  createNode,
  createManyNodes,
  appendManyNodes,
  fetchFoodItems,
  toggleModal,
  location,
  createOrderItems
  insertHTML,
  appendDOM,
  reDirect,
  baseUrl,
  token

*/
const createOrderItem = (item) => {
  const div = createNode('div'),
    img = createNode('img'),
    h4 = createNode('h4'),
    [price, quantity] = createManyNodes('div', 2);

  div.setAttribute('class', 'food-item-card');
  div.setAttribute('align', 'center');
  img.setAttribute('src', item.image_url);
  h4.innerHTML = item.food_name;
  price.innerHTML = `&#8358; ${item.price}`;
  quantity.innerHTML = `Quantity: ${item.quantity}`;
  appendManyNodes(div, [img, h4, price, quantity]);
  return div;
};

const renderOrderedItems = (item) => {
  const orderedFood = createOrderItem(item);
  appendDOM('view-order', orderedFood);
};

const setOrderInfo = (data) => {
  insertHTML('address', data.address);
  insertHTML('phone-no', data.phone_number);
  insertHTML('status', data.status);
  insertHTML('amount', `&#8358; ${data.total_amount}`);
};

const addOrderItems = (data) => {
  const foodItems = JSON.parse(localStorage.getItem('foodItems'));
  const orderItems = data.order_items;
  orderItems.forEach((element) => {
    const item = foodItems.find(val => val.food_id === element.foodId);
    item.quantity = element.quantity;
    renderOrderedItems(item);
  });
};

const renderSpecificOrder = (data) => {
  toggleModal('itemsModal');
  setOrderInfo(data[0]);
  addOrderItems(data[0]);
};

const processGetOrderResponse = (response) => {
  displayElement('loadingModal', 'none');
  if (!response.error) {
    renderSpecificOrder(response.data);
  } else {
    const { error } = response;
    const { description } = error;
    const errorCode = error.status;
    let errMess;
    switch (errorCode) {
      case 401:
        errMess = `${description}</br> Please Login`;
        break;
      case 403:
        errMess = 'Your login session expired </br> Please Login';
        break;
      case 422:
      case 400:
        errMess = description;
        break;
      default:
        errMess = 'something unusual happened, pls try later';
        break;
    }
    displayErrorAlert(errMess);
  }
};

const viewOrder = (event) => { // eslint-disable-line no-unused-vars
  displayElement('loadingModal', 'block');
  const orderId = event.path[1].attributes[1].value,
    pathToResource = `${baseUrl}/api/v1/orders/${orderId}`;
  fetch(pathToResource, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(readResponseAsJSON)
    .then(processGetOrderResponse)
    .catch((error) => {
      displayElement('loadingModal', 'none');
      displayErrorAlert(error);
    });
};


const processUpdateResponse = (response) => {
  displayElement('loadingModal', 'none');
  if (!response.error) {
    window.location.reload();
  } else {
    const { error } = response;
    const { description } = error;
    const errorCode = error.status;
    let errMess;
    switch (errorCode) {
      case 401:
        errMess = `${description}</br> Please Login`;
        break;
      case 403:
        errMess = 'Your login session expired </br> Please Login';
        break;
      case 422:
      case 400:
        errMess = description;
        break;
      default:
        errMess = 'something unusual happened, pls try later';
        break;
    }
    displayErrorAlert(errMess);
  }
};

const updateOrder = (event) => { // eslint-disable-line no-unused-vars
  displayElement('loadingModal', 'block');
  const orderId = event.path[0].attributes[2].value,
    status = event.path[0].innerText,
    pathToUpdate = `${baseUrl}/api/v1/orders/${orderId}`;
  const postData = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status })
  };
  fetch(pathToUpdate, postData)
    .then(readResponseAsJSON)
    .then(processUpdateResponse)
    .catch(() => {
      displayElement('loadingModal', 'none');
      displayErrorAlert('something is not right, check your connection');
    });
};

const renderOrders = (data) => {
  data.forEach((element) => {
    const order = createOrderItems(element);
    appendDOM('user_orders', order);
  });
};

const processOrdersResponse = (response) => {
  displayElement('loadingModal', 'none');
  if (!response.error) {
    renderOrders(response.data);
  } else {
    const { error } = response;
    const { description } = error;
    const errorCode = error.status;
    let errMess;
    switch (errorCode) {
      case 401:
        errMess = `${description}</br> Please Login`;
        break;
      case 403:
        errMess = 'Your login session expired </br> Please Login';
        break;
      case 422:
        errMess = description;
        break;
      default:
        errMess = 'something unusual happened, pls try later';
        break;
    }
    displayErrorAlert(errMess);
  }
};

const isAdmin = confirmAdmin();

if (!isAdmin) {
  reDirect('./login.html');
}

window.addEventListener('load', () => {
  displayElement('loadingModal', 'block');
  fetchFoodItems();
  const pathToResource = `${baseUrl}/api/v1/orders`;
  fetch(pathToResource, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(readResponseAsJSON)
    .then(processOrdersResponse)
    .catch((error) => {
      displayElement('loadingModal', 'none');
      displayErrorAlert(error);
    });
});
