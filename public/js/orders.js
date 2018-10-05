/* eslint-env browser */

/* global

  readResponseAsJSON,
  displayErrorAlert,
  displayElement,
  confirmAdmin,
  appendDOM,
  reDirect,
  baseUrl,
  token

*/

const processUpdateResponse = (response) => {
  displayElement('loadingModal', 'none');
  if (!response.error) {
    location.reload();
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

const updateOrder = (event) => {
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
