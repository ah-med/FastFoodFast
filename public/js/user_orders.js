const isUser = confirmUser();

if (!isUser) {
  reDirect('./login.html');
}

const renderUserOrders = (data) => {
  if (data.length === 0) {
    displayElement('no-orders', 'block');
  } else {
    displayElement('no-orders', 'none')
    data.forEach((element) => {
      const order = createOrderItems(element, 'user');
      appendDOM('user_orders', order);
    });
  }
};

const processUserOrdersResponse = (response) => {
  displayElement('loadingModal', 'none');
  if (!response.error) {
    renderUserOrders(response.data);
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

window.addEventListener('load', () => {
  displayElement('loadingModal', 'block');
  const userId = localStorage.getItem('userId');
  const pathToResource = `${baseUrl}/api/v1/users/${userId}/orders`;
  fetch(pathToResource, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(readResponseAsJSON)
    .then(processUserOrdersResponse)
    .catch((error) => {
      displayElement('loadingModal', 'none');
      displayErrorAlert(error);
    });
});
